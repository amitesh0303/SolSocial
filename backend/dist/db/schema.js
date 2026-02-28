import { pgTable, varchar, text, integer, bigint, uuid, timestamp, primaryKey, index, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
// ─── Profiles ────────────────────────────────────────────────────────────────
export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    walletAddress: varchar("wallet_address", { length: 44 }).notNull().unique(),
    username: varchar("username", { length: 32 }).notNull().unique(),
    displayName: varchar("display_name", { length: 64 }),
    bio: text("bio"),
    avatarUri: text("avatar_uri"),
    followerCount: integer("follower_count").notNull().default(0),
    followingCount: integer("following_count").notNull().default(0),
    postCount: integer("post_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => [
    index("profiles_username_idx").on(t.username),
    index("profiles_wallet_idx").on(t.walletAddress),
]);
// ─── Communities ─────────────────────────────────────────────────────────────
export const communities = pgTable("communities", {
    id: uuid("id").primaryKey().defaultRandom(),
    onChainAddress: varchar("on_chain_address", { length: 44 })
        .notNull()
        .unique(),
    name: varchar("name", { length: 64 }).notNull().unique(),
    description: text("description"),
    creatorWallet: varchar("creator_wallet", { length: 44 }).notNull(),
    memberCount: integer("member_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => [index("communities_name_idx").on(t.name)]);
// ─── Posts ────────────────────────────────────────────────────────────────────
export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    onChainAddress: varchar("on_chain_address", { length: 44 })
        .notNull()
        .unique(),
    authorWallet: varchar("author_wallet", { length: 44 })
        .notNull()
        .references(() => profiles.walletAddress),
    content: text("content").notNull(),
    mediaUri: text("media_uri"),
    likeCount: integer("like_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    tipTotal: bigint("tip_total", { mode: "bigint" }).notNull().default(0n),
    communityId: uuid("community_id").references(() => communities.id),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    slot: bigint("slot", { mode: "bigint" }).notNull().default(0n),
}, (t) => [
    index("posts_author_idx").on(t.authorWallet),
    index("posts_created_at_idx").on(t.createdAt),
    index("posts_community_idx").on(t.communityId),
]);
// ─── Follows ──────────────────────────────────────────────────────────────────
export const follows = pgTable("follows", {
    followerWallet: varchar("follower_wallet", { length: 44 }).notNull(),
    followeeWallet: varchar("followee_wallet", { length: 44 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => [
    primaryKey({ columns: [t.followerWallet, t.followeeWallet] }),
    index("follows_follower_idx").on(t.followerWallet),
    index("follows_followee_idx").on(t.followeeWallet),
]);
// ─── Likes ────────────────────────────────────────────────────────────────────
export const likes = pgTable("likes", {
    userWallet: varchar("user_wallet", { length: 44 }).notNull(),
    postAddress: varchar("post_address", { length: 44 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => [
    primaryKey({ columns: [t.userWallet, t.postAddress] }),
    index("likes_post_idx").on(t.postAddress),
    index("likes_user_idx").on(t.userWallet),
]);
// ─── Comments ─────────────────────────────────────────────────────────────────
export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    onChainAddress: varchar("on_chain_address", { length: 44 })
        .notNull()
        .unique(),
    postAddress: varchar("post_address", { length: 44 }).notNull(),
    authorWallet: varchar("author_wallet", { length: 44 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => [
    index("comments_post_idx").on(t.postAddress),
    index("comments_author_idx").on(t.authorWallet),
]);
// ─── Tips ─────────────────────────────────────────────────────────────────────
export const tips = pgTable("tips", {
    id: uuid("id").primaryKey().defaultRandom(),
    fromWallet: varchar("from_wallet", { length: 44 }).notNull(),
    toWallet: varchar("to_wallet", { length: 44 }).notNull(),
    amount: bigint("amount", { mode: "bigint" }).notNull(),
    mint: varchar("mint", { length: 44 }).notNull(),
    txSignature: varchar("tx_signature", { length: 88 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => [
    index("tips_to_wallet_idx").on(t.toWallet),
    index("tips_from_wallet_idx").on(t.fromWallet),
]);
// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = pgTable("notifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    recipientWallet: varchar("recipient_wallet", { length: 44 }).notNull(),
    type: varchar("type", { length: 32 }).notNull(), // follow | like | comment | tip
    actorWallet: varchar("actor_wallet", { length: 44 }),
    referenceId: varchar("reference_id", { length: 88 }), // post address / tx sig etc.
    read: integer("read").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (t) => [
    index("notifications_recipient_idx").on(t.recipientWallet),
    index("notifications_read_idx").on(t.read),
]);
// ─── Relations ────────────────────────────────────────────────────────────────
export const profileRelations = relations(profiles, ({ many }) => ({
    posts: many(posts),
}));
export const postRelations = relations(posts, ({ one, many }) => ({
    author: one(profiles, {
        fields: [posts.authorWallet],
        references: [profiles.walletAddress],
    }),
    community: one(communities, {
        fields: [posts.communityId],
        references: [communities.id],
    }),
    comments: many(comments),
}));
export const communityRelations = relations(communities, ({ many }) => ({
    posts: many(posts),
}));
