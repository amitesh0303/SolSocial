import Redis from "ioredis";
const redisUrl = process.env["REDIS_URL"] ?? "redis://localhost:6379";
export const redis = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
});
redis.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
});
redis.on("connect", () => {
    console.info("[Redis] Connected");
});
// ─── Key Builders ────────────────────────────────────────────────────────────
export const CacheKeys = {
    profile: (wallet) => `profile:wallet:${wallet}`,
    profileByUsername: (username) => `profile:username:${username}`,
    post: (address) => `post:${address}`,
    feed: (wallet, cursor) => `feed:${wallet}:${cursor}`,
    trending: () => `trending:posts`,
    tipsLeaderboard: () => `tips:leaderboard`,
};
export const TTL = {
    profile: 300, // 5 min
    post: 120, // 2 min
    feed: 30, // 30 s
    trending: 60, // 1 min
    leaderboard: 60, // 1 min
};
// ─── Helpers ─────────────────────────────────────────────────────────────────
export async function getOrSet(key, ttl, fetcher) {
    try {
        const cached = await redis.get(key);
        if (cached !== null) {
            return JSON.parse(cached);
        }
    }
    catch {
        // Cache miss or parse error – fall through to fetcher
    }
    const value = await fetcher();
    try {
        await redis.set(key, JSON.stringify(value), "EX", ttl);
    }
    catch {
        // Best-effort cache write
    }
    return value;
}
export async function invalidate(...keys) {
    if (keys.length === 0)
        return;
    try {
        await redis.del(...keys);
    }
    catch {
        // Best-effort invalidation
    }
}
export async function publish(channel, payload) {
    try {
        await redis.publish(channel, JSON.stringify(payload));
    }
    catch {
        // Best-effort publish
    }
}
