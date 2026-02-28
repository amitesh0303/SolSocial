import { z } from "zod";
import { eq, ilike, or, lt, desc, sql } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { profiles, follows } from "../../db/schema.js";
import { CacheKeys, TTL, getOrSet } from "../../redis/index.js";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
export const profileRouter = router({
    getByWallet: publicProcedure
        .input(z.object({ wallet: z.string().min(1).max(44) }))
        .query(async ({ input, ctx }) => {
        return getOrSet(CacheKeys.profile(input.wallet), TTL.profile, async () => {
            const [profile] = await ctx.db
                .select()
                .from(profiles)
                .where(eq(profiles.walletAddress, input.wallet))
                .limit(1);
            return profile ?? null;
        });
    }),
    getByUsername: publicProcedure
        .input(z.object({ username: z.string().min(1).max(32) }))
        .query(async ({ input, ctx }) => {
        return getOrSet(CacheKeys.profileByUsername(input.username), TTL.profile, async () => {
            const [profile] = await ctx.db
                .select()
                .from(profiles)
                .where(eq(profiles.username, input.username))
                .limit(1);
            return profile ?? null;
        });
    }),
    search: publicProcedure
        .input(z.object({
        query: z.string().min(1).max(64),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const pattern = `%${input.query}%`;
        return ctx.db
            .select()
            .from(profiles)
            .where(or(ilike(profiles.username, pattern), ilike(profiles.displayName, pattern)))
            .limit(input.limit);
    }),
    getFollowers: publicProcedure
        .input(z.object({
        wallet: z.string().min(1).max(44),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const conditions = [eq(follows.followeeWallet, input.wallet)];
        if (input.cursor) {
            conditions.push(lt(follows.createdAt, new Date(input.cursor)));
        }
        const rows = await ctx.db
            .select({ follow: follows, profile: profiles })
            .from(follows)
            .leftJoin(profiles, eq(follows.followerWallet, profiles.walletAddress))
            .where(sql `${eq(follows.followeeWallet, input.wallet)}${input.cursor ? sql ` AND ${follows.createdAt} < ${new Date(input.cursor)}` : sql ``}`)
            .orderBy(desc(follows.createdAt))
            .limit(input.limit + 1);
        const hasMore = rows.length > input.limit;
        const items = rows.slice(0, input.limit);
        const nextCursor = hasMore
            ? items[items.length - 1]?.follow.createdAt.toISOString()
            : undefined;
        return { items, nextCursor };
    }),
    getFollowing: publicProcedure
        .input(z.object({
        wallet: z.string().min(1).max(44),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const rows = await ctx.db
            .select({ follow: follows, profile: profiles })
            .from(follows)
            .leftJoin(profiles, eq(follows.followeeWallet, profiles.walletAddress))
            .where(sql `${eq(follows.followerWallet, input.wallet)}${input.cursor ? sql ` AND ${follows.createdAt} < ${new Date(input.cursor)}` : sql ``}`)
            .orderBy(desc(follows.createdAt))
            .limit(input.limit + 1);
        const hasMore = rows.length > input.limit;
        const items = rows.slice(0, input.limit);
        const nextCursor = hasMore
            ? items[items.length - 1]?.follow.createdAt.toISOString()
            : undefined;
        return { items, nextCursor };
    }),
});
