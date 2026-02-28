import Redis from "ioredis";
export declare const redis: Redis;
export declare const CacheKeys: {
    readonly profile: (wallet: string) => string;
    readonly profileByUsername: (username: string) => string;
    readonly post: (address: string) => string;
    readonly feed: (wallet: string, cursor: string) => string;
    readonly trending: () => string;
    readonly tipsLeaderboard: () => string;
};
export declare const TTL: {
    readonly profile: 300;
    readonly post: 120;
    readonly feed: 30;
    readonly trending: 60;
    readonly leaderboard: 60;
};
export declare function getOrSet<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T>;
export declare function invalidate(...keys: string[]): Promise<void>;
export declare function publish(channel: string, payload: unknown): Promise<void>;
