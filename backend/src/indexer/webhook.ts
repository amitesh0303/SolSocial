import { createHmac, timingSafeEqual } from "crypto";
import type { Context } from "hono";
import { eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  profiles,
  posts,
  likes,
  follows,
  tips,
  comments,
  notifications,
  communities,
} from "../db/schema.js";
import { invalidate, publish, CacheKeys } from "../redis/index.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wraps Drizzle's $count result in a scalar subquery safe for .set() calls. */
function countOf<T>(table: T, condition: ReturnType<typeof eq>): number {
  return db.$count(table as Parameters<typeof db.$count>[0], condition) as unknown as number;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeliusTokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  mint: string;
  tokenAmount: number;
}

interface HeliusNativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

interface HeliusTransaction {
  signature: string;
  slot: number;
  timestamp: number;
  type: string;
  description: string;
  accountData: Array<{ account: string; nativeBalanceChange: number }>;
  tokenTransfers: HeliusTokenTransfer[];
  nativeTransfers: HeliusNativeTransfer[];
  logs: string[];
}

// ─── Signature Verification ───────────────────────────────────────────────────

function verifyHeliusSignature(
  body: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ─── Event Classification ─────────────────────────────────────────────────────

type EventType =
  | "PROFILE_CREATED"
  | "POST_CREATED"
  | "COMMENT_CREATED"
  | "LIKE"
  | "FOLLOW"
  | "TIP"
  | "COMMUNITY_CREATED"
  | "UNKNOWN";

function classifyEvent(tx: HeliusTransaction): EventType {
  const log = tx.logs.join(" ");
  if (log.includes("CreateProfile")) return "PROFILE_CREATED";
  if (log.includes("CreatePost")) return "POST_CREATED";
  if (log.includes("CreateComment")) return "COMMENT_CREATED";
  if (log.includes("LikePost")) return "LIKE";
  if (log.includes("FollowUser")) return "FOLLOW";
  if (log.includes("SendTip")) return "TIP";
  if (log.includes("CreateCommunity")) return "COMMUNITY_CREATED";
  return "UNKNOWN";
}

// ─── Event Handlers ───────────────────────────────────────────────────────────

async function handleProfileCreated(tx: HeliusTransaction): Promise<void> {
  const account = tx.accountData[0]?.account;
  if (!account) return;

  await db
    .insert(profiles)
    .values({
      walletAddress: account,
      username: account.slice(0, 16),
      createdAt: new Date(tx.timestamp * 1000),
      updatedAt: new Date(tx.timestamp * 1000),
    })
    .onConflictDoNothing();
}

async function handlePostCreated(tx: HeliusTransaction): Promise<void> {
  const authorAccount = tx.accountData[0]?.account;
  const postAccount = tx.accountData[1]?.account;
  if (!authorAccount || !postAccount) return;

  await db
    .insert(posts)
    .values({
      onChainAddress: postAccount,
      authorWallet: authorAccount,
      content: tx.description,
      slot: BigInt(tx.slot),
      createdAt: new Date(tx.timestamp * 1000),
    })
    .onConflictDoNothing();

  // Increment post count
  await db
    .update(profiles)
    .set({ postCount: countOf(posts, eq(posts.authorWallet, authorAccount)) })
    .where(eq(profiles.walletAddress, authorAccount));

  await invalidate(CacheKeys.profile(authorAccount), CacheKeys.feed(authorAccount, "start"));
  await publish(`feed:${authorAccount}`, { type: "POST_CREATED", postAddress: postAccount });
}

async function handleCommentCreated(tx: HeliusTransaction): Promise<void> {
  const authorWallet = tx.accountData[0]?.account;
  const commentAddress = tx.accountData[1]?.account;
  const postAddress = tx.accountData[2]?.account;
  if (!authorWallet || !commentAddress || !postAddress) return;

  await db
    .insert(comments)
    .values({
      onChainAddress: commentAddress,
      postAddress,
      authorWallet,
      content: tx.description,
      createdAt: new Date(tx.timestamp * 1000),
    })
    .onConflictDoNothing();

  await db
    .update(posts)
    .set({ commentCount: countOf(comments, eq(comments.postAddress, postAddress)) })
    .where(eq(posts.onChainAddress, postAddress));

  const [post] = await db
    .select({ authorWallet: posts.authorWallet })
    .from(posts)
    .where(eq(posts.onChainAddress, postAddress))
    .limit(1);

  if (post) {
    await db.insert(notifications).values({
      recipientWallet: post.authorWallet,
      type: "comment",
      actorWallet: authorWallet,
      referenceId: postAddress,
    });
    await publish(`post:${postAddress}`, { type: "COMMENT", authorWallet, commentAddress });
    await publish(`profile:${post.authorWallet}`, { type: "COMMENT", actorWallet: authorWallet });
  }

  await invalidate(CacheKeys.post(postAddress));
}

async function handleLike(tx: HeliusTransaction): Promise<void> {
  const userWallet = tx.accountData[0]?.account;
  const postAddress = tx.accountData[1]?.account;
  if (!userWallet || !postAddress) return;

  await db
    .insert(likes)
    .values({
      userWallet,
      postAddress,
      createdAt: new Date(tx.timestamp * 1000),
    })
    .onConflictDoNothing();

  await db
    .update(posts)
    .set({ likeCount: countOf(likes, eq(likes.postAddress, postAddress)) })
    .where(eq(posts.onChainAddress, postAddress));

  const [post] = await db
    .select({ authorWallet: posts.authorWallet })
    .from(posts)
    .where(eq(posts.onChainAddress, postAddress))
    .limit(1);

  if (post) {
    await db.insert(notifications).values({
      recipientWallet: post.authorWallet,
      type: "like",
      actorWallet: userWallet,
      referenceId: postAddress,
    });
    await publish(`post:${postAddress}`, { type: "LIKE", userWallet });
    await publish(`profile:${post.authorWallet}`, { type: "LIKE", actorWallet: userWallet });
  }

  await invalidate(CacheKeys.post(postAddress), CacheKeys.trending());
}

async function handleFollow(tx: HeliusTransaction): Promise<void> {
  const followerWallet = tx.accountData[0]?.account;
  const followeeWallet = tx.accountData[1]?.account;
  if (!followerWallet || !followeeWallet) return;

  await db
    .insert(follows)
    .values({
      followerWallet,
      followeeWallet,
      createdAt: new Date(tx.timestamp * 1000),
    })
    .onConflictDoNothing();

  // Update counts (best-effort)
  await Promise.all([
    db
      .update(profiles)
      .set({ followingCount: countOf(follows, eq(follows.followerWallet, followerWallet)) })
      .where(eq(profiles.walletAddress, followerWallet)),
    db
      .update(profiles)
      .set({ followerCount: countOf(follows, eq(follows.followeeWallet, followeeWallet)) })
      .where(eq(profiles.walletAddress, followeeWallet)),
  ]);

  await db.insert(notifications).values({
    recipientWallet: followeeWallet,
    type: "follow",
    actorWallet: followerWallet,
  });

  await invalidate(
    CacheKeys.profile(followerWallet),
    CacheKeys.profile(followeeWallet)
  );
  await publish(`profile:${followeeWallet}`, { type: "FOLLOW", actorWallet: followerWallet });
}

async function handleTip(tx: HeliusTransaction): Promise<void> {
  const fromWallet = tx.accountData[0]?.account;
  const toWallet = tx.accountData[1]?.account;
  if (!fromWallet || !toWallet) return;

  // Prefer token transfers; fall back to native SOL
  const tokenTx = tx.tokenTransfers[0];
  const nativeTx = tx.nativeTransfers[0];
  const amount = tokenTx ? BigInt(Math.round(tokenTx.tokenAmount)) : BigInt(nativeTx?.amount ?? 0);
  const mint = tokenTx?.mint ?? "So11111111111111111111111111111111111111112";

  await db
    .insert(tips)
    .values({
      fromWallet,
      toWallet,
      amount,
      mint,
      txSignature: tx.signature,
      createdAt: new Date(tx.timestamp * 1000),
    })
    .onConflictDoNothing();

  await db.insert(notifications).values({
    recipientWallet: toWallet,
    type: "tip",
    actorWallet: fromWallet,
    referenceId: tx.signature,
  });

  await invalidate(CacheKeys.tipsLeaderboard());
  await publish(`profile:${toWallet}`, { type: "TIP", fromWallet, amount: amount.toString() });
}

async function handleCommunityCreated(tx: HeliusTransaction): Promise<void> {
  const creatorWallet = tx.accountData[0]?.account;
  const communityAddress = tx.accountData[1]?.account;
  if (!creatorWallet || !communityAddress) return;

  await db
    .insert(communities)
    .values({
      onChainAddress: communityAddress,
      name: communityAddress.slice(0, 16),
      description: tx.description,
      creatorWallet,
      createdAt: new Date(tx.timestamp * 1000),
    })
    .onConflictDoNothing();
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function heliusWebhookHandler(c: Context): Promise<Response> {
  const secret = process.env["HELIUS_WEBHOOK_SECRET"];
  if (!secret) {
    return c.json({ error: "Webhook secret not configured" }, 500);
  }

  const rawBody = await c.req.text();
  const signature = c.req.header("x-helius-signature");

  if (!verifyHeliusSignature(rawBody, signature, secret)) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  let transactions: HeliusTransaction[];
  try {
    transactions = JSON.parse(rawBody) as HeliusTransaction[];
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const results: Array<{ signature: string; event: string; ok: boolean }> = [];

  for (const tx of transactions) {
    const event = classifyEvent(tx);

    try {
      switch (event) {
        case "PROFILE_CREATED":
          await handleProfileCreated(tx);
          break;
        case "POST_CREATED":
          await handlePostCreated(tx);
          break;
        case "COMMENT_CREATED":
          await handleCommentCreated(tx);
          break;
        case "LIKE":
          await handleLike(tx);
          break;
        case "FOLLOW":
          await handleFollow(tx);
          break;
        case "TIP":
          await handleTip(tx);
          break;
        case "COMMUNITY_CREATED":
          await handleCommunityCreated(tx);
          break;
        default:
          break;
      }
      results.push({ signature: tx.signature, event, ok: true });
    } catch (err) {
      console.error(`[Webhook] Failed to process ${event} (${tx.signature}):`, err);
      results.push({ signature: tx.signature, event, ok: false });
    }
  }

  return c.json({ processed: results.length, results });
}
