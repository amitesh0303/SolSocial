import Redis from "ioredis";

const redisUrl = process.env["REDIS_URL"] ?? "redis://localhost:6379";

export const redis = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on("error", (err: Error) => {
  console.error("[Redis] Connection error:", err.message);
});

redis.on("connect", () => {
  console.info("[Redis] Connected");
});

// ─── Key Builders ────────────────────────────────────────────────────────────

export const CacheKeys = {
  profile: (wallet: string) => `profile:wallet:${wallet}`,
  profileByUsername: (username: string) => `profile:username:${username}`,
  post: (address: string) => `post:${address}`,
  feed: (wallet: string, cursor: string) => `feed:${wallet}:${cursor}`,
  trending: () => `trending:posts`,
  tipsLeaderboard: () => `tips:leaderboard`,
} as const;

export const TTL = {
  profile: 300,       // 5 min
  post: 120,          // 2 min
  feed: 30,           // 30 s
  trending: 60,       // 1 min
  leaderboard: 60,    // 1 min
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export async function getOrSet<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // Cache miss or parse error – fall through to fetcher
  }

  const value = await fetcher();

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch {
    // Best-effort cache write
  }

  return value;
}

export async function invalidate(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    // Best-effort invalidation
  }
}

export async function publish(channel: string, payload: unknown): Promise<void> {
  try {
    await redis.publish(channel, JSON.stringify(payload));
  } catch {
    // Best-effort publish
  }
}
