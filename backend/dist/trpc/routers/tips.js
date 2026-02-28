import { z } from "zod";
import { eq, desc, sql, sum } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { tips } from "../../db/schema.js";
import { CacheKeys, TTL, getOrSet } from "../../redis/index.js";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
export const tipsRouter = router({
    getByCreator: publicProcedure
        .input(z.object({
        wallet: z.string().min(1).max(44),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const rows = await ctx.db
            .select()
            .from(tips)
            .where(sql `${eq(tips.toWallet, input.wallet)}${input.cursor ? sql ` AND ${tips.createdAt} < ${new Date(input.cursor)}` : sql ``}`)
            .orderBy(desc(tips.createdAt))
            .limit(input.limit + 1);
        const hasMore = rows.length > input.limit;
        const items = rows.slice(0, input.limit);
        const nextCursor = hasMore
            ? items[items.length - 1]?.createdAt.toISOString()
            : undefined;
        return { items, nextCursor };
    }),
    getLeaderboard: publicProcedure
        .input(z.object({
        limit: z.number().int().min(1).max(50).default(10),
    }))
        .query(async ({ input, ctx }) => {
        return getOrSet(CacheKeys.tipsLeaderboard(), TTL.leaderboard, async () => {
            return ctx.db
                .select({
                wallet: tips.toWallet,
                total: sum(tips.amount).mapWith(Number),
            })
                .from(tips)
                .groupBy(tips.toWallet)
                .orderBy(desc(sum(tips.amount)))
                .limit(input.limit);
        });
    }),
});
