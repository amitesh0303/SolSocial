import type { Context } from "hono";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { DB } from "../db/index.js";
import type { Redis } from "ioredis";
export interface AppContext extends Record<string, unknown> {
    db: DB;
    redis: Redis;
    walletAddress: string | null;
}
export declare function createContext(db: DB, redisClient: Redis): (opts: FetchCreateContextFnOptions, c: Context) => AppContext;
