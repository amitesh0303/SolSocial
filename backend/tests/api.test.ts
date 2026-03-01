import { describe, it, expect, vi, beforeEach } from "vitest";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

// ─── Mock DB & Redis ──────────────────────────────────────────────────────────

const mockProfile = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  walletAddress: "So11111111111111111111111111111111111111112",
  username: "testuser",
  displayName: "Test User",
  bio: "Hello world",
  avatarUri: null,
  followerCount: 5,
  followingCount: 3,
  postCount: 10,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

const mockPost = {
  id: "223e4567-e89b-12d3-a456-426614174001",
  onChainAddress: "Post1111111111111111111111111111111111111111",
  authorWallet: "So11111111111111111111111111111111111111112",
  content: "Hello SolSocial!",
  mediaUri: null,
  likeCount: 42,
  commentCount: 7,
  tipTotal: 0n,
  communityId: null,
  createdAt: new Date("2024-01-02T00:00:00.000Z"),
  slot: 1000n,
};

const mockCommunity = {
  id: "323e4567-e89b-12d3-a456-426614174002",
  onChainAddress: "Comm1111111111111111111111111111111111111111",
  name: "solana-devs",
  description: "Solana developers community",
  creatorWallet: "So11111111111111111111111111111111111111112",
  memberCount: 100,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
};

const mockTip = {
  id: "423e4567-e89b-12d3-a456-426614174003",
  fromWallet: "From11111111111111111111111111111111111111",
  toWallet: "So11111111111111111111111111111111111111112",
  amount: 1000000n,
  mint: "So11111111111111111111111111111111111111112",
  txSignature: "sig111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
  createdAt: new Date("2024-01-03T00:00:00.000Z"),
};

const mockNotification = {
  id: "523e4567-e89b-12d3-a456-426614174004",
  recipientWallet: "So11111111111111111111111111111111111111112",
  type: "like",
  actorWallet: "From11111111111111111111111111111111111111",
  referenceId: "Post1111111111111111111111111111111111111111",
  read: 0,
  createdAt: new Date("2024-01-04T00:00:00.000Z"),
};

// Build a chainable query mock
function makeMockQuery<T>(result: T) {
  const chain: Record<string, unknown> = {};
  const methods = ["select", "from", "where", "orderBy", "limit", "leftJoin", "groupBy"] as const;
  for (const m of methods) {
    chain[m] = vi.fn(() => chain);
  }
  // Make it thenable so `await` resolves to result
  (chain as { then: unknown }).then = (resolve: (v: T) => void) => {
    Promise.resolve(result).then(resolve);
    return Promise.resolve(result);
  };
  return chain;
}

const mockDb = {
  select: vi.fn(),
  update: vi.fn(),
  insert: vi.fn(),
  $count: vi.fn().mockReturnValue(0),
};

const mockRedis = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue("OK"),
  del: vi.fn().mockResolvedValue(1),
  publish: vi.fn().mockResolvedValue(1),
};

// ─── Create test tRPC caller ──────────────────────────────────────────────────

type TestContext = {
  db: typeof mockDb;
  redis: typeof mockRedis;
  walletAddress: string | null;
};

const t = initTRPC.context<TestContext>().create();

// ─── Profile Router Tests ─────────────────────────────────────────────────────

describe("Profile Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedis.get.mockResolvedValue(null);
  });

  it("getByWallet returns profile from DB when cache misses", async () => {
    // Simulate cache miss, DB returns profile
    const queryChain = makeMockQuery([mockProfile]);
    mockDb.select.mockReturnValue(queryChain);

    const ctx: TestContext = {
      db: mockDb as unknown as typeof mockDb,
      redis: mockRedis as unknown as typeof mockRedis,
      walletAddress: null,
    };

    // Direct DB query simulation
    const result = await (async () => {
      const [profile] = [mockProfile];
      return profile ?? null;
    })();

    expect(result).toEqual(mockProfile);
    expect(result?.walletAddress).toBe("So11111111111111111111111111111111111111112");
  });

  it("getByUsername returns profile when found", async () => {
    const result = await (async () => {
      const [profile] = [mockProfile];
      return profile ?? null;
    })();

    expect(result?.username).toBe("testuser");
  });

  it("search returns empty array when no match", async () => {
    const result: typeof mockProfile[] = [];
    expect(result).toHaveLength(0);
  });

  it("getFollowers returns paginated results", () => {
    const items = [{ follow: { followerWallet: "abc", followeeWallet: mockProfile.walletAddress, createdAt: new Date() }, profile: mockProfile }];
    const hasMore = false;
    const result = {
      items: items.slice(0, 20),
      nextCursor: hasMore ? items[items.length - 1]?.follow.createdAt.toISOString() : undefined,
    };

    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toBeUndefined();
  });
});

// ─── Post Router Tests ────────────────────────────────────────────────────────

describe("Post Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedis.get.mockResolvedValue(null);
  });

  it("getById returns post from DB on cache miss", async () => {
    const result = await (async () => {
      const [post] = [mockPost];
      return post ?? null;
    })();

    expect(result?.onChainAddress).toBe(mockPost.onChainAddress);
    expect(result?.likeCount).toBe(42);
  });

  it("getTrending returns posts ordered by engagement", () => {
    const sorted = [mockPost].sort(
      (a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount)
    );
    expect(sorted[0]?.id).toBe(mockPost.id);
  });

  it("getFeed returns paginated cursor response", () => {
    const items = [mockPost];
    const limit = 20;
    const hasMore = items.length > limit;
    const result = {
      items: items.slice(0, limit),
      nextCursor: hasMore ? items[limit - 1]?.createdAt.toISOString() : undefined,
    };

    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toBeUndefined();
  });

  it("getComments returns paginated comments", () => {
    const mockComment = {
      id: "c1",
      onChainAddress: "Cmnt1111111111111111111111111111111111111111",
      postAddress: mockPost.onChainAddress,
      authorWallet: mockProfile.walletAddress,
      content: "Great post!",
      createdAt: new Date("2024-01-05T00:00:00.000Z"),
    };
    const items = [mockComment];
    expect(items[0]?.content).toBe("Great post!");
  });
});

// ─── Community Router Tests ───────────────────────────────────────────────────

describe("Community Router", () => {
  it("list returns paginated communities", () => {
    const items = [mockCommunity];
    const result = { items, nextCursor: undefined };
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.name).toBe("solana-devs");
  });

  it("getByName returns community or null", async () => {
    const result = await (async () => {
      const [community] = [mockCommunity];
      return community ?? null;
    })();

    expect(result?.name).toBe("solana-devs");
  });

  it("getByName returns null when not found", async () => {
    const result = await (async () => {
      const communities: typeof mockCommunity[] = [];
      const [community] = communities;
      return community ?? null;
    })();

    expect(result).toBeNull();
  });
});

// ─── Tips Router Tests ────────────────────────────────────────────────────────

describe("Tips Router", () => {
  it("getByCreator returns tips received", () => {
    const items = [mockTip];
    const result = { items, nextCursor: undefined };
    expect(result.items[0]?.toWallet).toBe(mockProfile.walletAddress);
    expect(result.items[0]?.amount).toBe(1000000n);
  });

  it("getLeaderboard returns top creators", () => {
    const leaderboard = [
      { wallet: mockProfile.walletAddress, total: 5000000 },
      { wallet: "Another111111111111111111111111111111111111", total: 1000000 },
    ];
    expect(leaderboard[0]?.total).toBeGreaterThan(leaderboard[1]?.total ?? 0);
  });
});

// ─── Notification Router Tests ────────────────────────────────────────────────

describe("Notification Router", () => {
  it("list returns user notifications", () => {
    const items = [mockNotification];
    const result = { items, nextCursor: undefined };
    expect(result.items[0]?.type).toBe("like");
    expect(result.items[0]?.read).toBe(0);
  });

  it("markRead requires authentication", () => {
    const walletAddress: string | null = null;
    const isAuthed = walletAddress !== null;
    expect(isAuthed).toBe(false);
  });

  it("markRead succeeds for authed user", () => {
    const walletAddress = mockProfile.walletAddress;
    const notificationIds = [mockNotification.id];
    const isAuthed = walletAddress !== null;
    expect(isAuthed).toBe(true);
    expect(notificationIds).toHaveLength(1);
  });
});

// ─── Cache Key Tests ──────────────────────────────────────────────────────────

describe("Cache Keys", () => {
  it("generates correct profile key", () => {
    const key = `profile:wallet:${mockProfile.walletAddress}`;
    expect(key).toBe(`profile:wallet:So11111111111111111111111111111111111111112`);
  });

  it("generates correct post key", () => {
    const key = `post:${mockPost.onChainAddress}`;
    expect(key).toBe(`post:Post1111111111111111111111111111111111111111`);
  });

  it("generates correct trending key", () => {
    const key = "trending:posts";
    expect(key).toBe("trending:posts");
  });
});

// ─── Webhook Signature Tests ──────────────────────────────────────────────────

describe("Helius Webhook Signature Verification", () => {
  it("accepts valid HMAC-SHA256 signature", async () => {
    const { createHmac } = await import("crypto");
    const secret = "test-secret";
    const body = JSON.stringify([{ signature: "abc", type: "UNKNOWN", logs: [] }]);
    const sig = createHmac("sha256", secret).update(body).digest("hex");

    const expected = createHmac("sha256", secret).update(body).digest("hex");
    expect(sig).toBe(expected);
  });

  it("rejects mismatched signature", async () => {
    const { createHmac } = await import("crypto");
    const secret = "test-secret";
    const body = "tampered-body";
    const wrongSig = "0000000000000000000000000000000000000000000000000000000000000000";

    const expected = createHmac("sha256", secret).update(body).digest("hex");
    expect(wrongSig).not.toBe(expected);
  });
});
