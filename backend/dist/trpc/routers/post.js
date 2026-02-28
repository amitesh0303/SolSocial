import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { posts, follows, comments } from "../../db/schema.js";
import { CacheKeys, TTL, getOrSet } from "../../redis/index.js";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
export const postRouter = router({
    getFeed: publicProcedure
        .input(z.object({
        wallet: z.string().min(1).max(44),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const cacheKey = CacheKeys.feed(input.wallet, input.cursor ?? "start");
        return getOrSet(cacheKey, TTL.feed, async () => {
            const followedWallets = ctx.db
                .select({ wallet: follows.followeeWallet })
                .from(follows)
                .where(eq(follows.followerWallet, input.wallet));
            const rows = await ctx.db
                .select()
                .from(posts)
                .where(sql `${posts.authorWallet} IN (${followedWallets})${input.cursor ? sql ` AND ${posts.createdAt} < ${new Date(input.cursor)}` : sql ``}`)
                .orderBy(desc(posts.createdAt))
                .limit(input.limit + 1);
            const hasMore = rows.length > input.limit;
            const items = rows.slice(0, input.limit);
            const nextCursor = hasMore
                ? items[items.length - 1]?.createdAt.toISOString()
                : undefined;
            return { items, nextCursor };
        });
    }),
    getByAuthor: publicProcedure
        .input(z.object({
        wallet: z.string().min(1).max(44),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const rows = await ctx.db
            .select()
            .from(posts)
            .where(sql `${eq(posts.authorWallet, input.wallet)}${input.cursor ? sql ` AND ${posts.createdAt} < ${new Date(input.cursor)}` : sql ``}`)
            .orderBy(desc(posts.createdAt))
            .limit(input.limit + 1);
        const hasMore = rows.length > input.limit;
        const items = rows.slice(0, input.limit);
        const nextCursor = hasMore
            ? items[items.length - 1]?.createdAt.toISOString()
            : undefined;
        return { items, nextCursor };
    }),
    getById: publicProcedure
        .input(z.object({ address: z.string().min(1).max(44) }))
        .query(async ({ input, ctx }) => {
        return getOrSet(CacheKeys.post(input.address), TTL.post, async () => {
            const [post] = await ctx.db
                .select()
                .from(posts)
                .where(eq(posts.onChainAddress, input.address))
                .limit(1);
            return post ?? null;
        });
    }),
    getTrending: publicProcedure
        .input(z.object({
        limit: z.number().int().min(1).max(50).default(10),
    }))
        .query(async ({ input, ctx }) => {
        return getOrSet(CacheKeys.trending(), TTL.trending, async () => {
            return ctx.db
                .select()
                .from(posts)
                .orderBy(desc(sql `${posts.likeCount} + ${posts.commentCount}`))
                .limit(input.limit);
        });
    }),
    getComments: publicProcedure
        .input(z.object({
        postAddress: z.string().min(1).max(44),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const rows = await ctx.db
            .select()
            .from(comments)
            .where(sql `${eq(comments.postAddress, input.postAddress)}${input.cursor ? sql ` AND ${comments.createdAt} < ${new Date(input.cursor)}` : sql ``}`)
            .orderBy(desc(comments.createdAt))
            .limit(input.limit + 1);
        const hasMore = rows.length > input.limit;
        const items = rows.slice(0, input.limit);
        const nextCursor = hasMore
            ? items[items.length - 1]?.createdAt.toISOString()
            : undefined;
        return { items, nextCursor };
    }),
});
