import { z } from "zod";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { router, publicProcedure, authedProcedure } from "../trpc.js";
import { notifications } from "../../db/schema.js";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
export const notificationRouter = router({
    list: publicProcedure
        .input(z.object({
        wallet: z.string().min(1).max(44),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    }))
        .query(async ({ input, ctx }) => {
        const rows = await ctx.db
            .select()
            .from(notifications)
            .where(sql `${eq(notifications.recipientWallet, input.wallet)}${input.cursor ? sql ` AND ${notifications.createdAt} < ${new Date(input.cursor)}` : sql ``}`)
            .orderBy(desc(notifications.createdAt))
            .limit(input.limit + 1);
        const hasMore = rows.length > input.limit;
        const items = rows.slice(0, input.limit);
        const nextCursor = hasMore
            ? items[items.length - 1]?.createdAt.toISOString()
            : undefined;
        return { items, nextCursor };
    }),
    markRead: authedProcedure
        .input(z.object({ notificationIds: z.array(z.string().uuid()).min(1).max(100) }))
        .mutation(async ({ input, ctx }) => {
        await ctx.db
            .update(notifications)
            .set({ read: 1 })
            .where(sql `${inArray(notifications.id, input.notificationIds)} AND ${eq(notifications.recipientWallet, ctx.walletAddress)}`);
        return { success: true, count: input.notificationIds.length };
    }),
});
