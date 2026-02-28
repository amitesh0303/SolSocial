import type { Context } from "hono";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { DB } from "../db/index.js";
import type { Redis } from "ioredis";

export interface AppContext extends Record<string, unknown> {
  db: DB;
  redis: Redis;
  walletAddress: string | null;
}

export function createContext(
  db: DB,
  redisClient: Redis
): (opts: FetchCreateContextFnOptions, c: Context) => AppContext {
  return (_opts, c) => {
    const authHeader = c.req.header("x-wallet-address") ?? null;
    return {
      db,
      redis: redisClient,
      walletAddress: authHeader,
    };
  };
}
