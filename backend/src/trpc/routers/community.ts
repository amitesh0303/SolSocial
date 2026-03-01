import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { communities, posts } from "../../db/schema.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export const communityRouter = router({
  list: publicProcedure
    .input(
      z.object({
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ input, ctx }) => {
      const rows = await ctx.db
        .select()
        .from(communities)
        .where(
          input.cursor
            ? sql`${communities.createdAt} < ${new Date(input.cursor)}`
            : undefined
        )
        .orderBy(desc(communities.createdAt))
        .limit(input.limit + 1);

      const hasMore = rows.length > input.limit;
      const items = rows.slice(0, input.limit);
      const nextCursor = hasMore
        ? items[items.length - 1]?.createdAt.toISOString()
        : undefined;

      return { items, nextCursor };
    }),

  getByName: publicProcedure
    .input(z.object({ name: z.string().min(1).max(64) }))
    .query(async ({ input, ctx }) => {
      const [community] = await ctx.db
        .select()
        .from(communities)
        .where(eq(communities.name, input.name))
        .limit(1);
      return community ?? null;
    }),

  getPosts: publicProcedure
    .input(
      z.object({
        communityId: z.string().uuid(),
        cursor: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ input, ctx }) => {
      const rows = await ctx.db
        .select()
        .from(posts)
        .where(
          sql`${eq(posts.communityId, input.communityId)}${input.cursor ? sql` AND ${posts.createdAt} < ${new Date(input.cursor)}` : sql``}`
        )
        .orderBy(desc(posts.createdAt))
        .limit(input.limit + 1);

      const hasMore = rows.length > input.limit;
      const items = rows.slice(0, input.limit);
      const nextCursor = hasMore
        ? items[items.length - 1]?.createdAt.toISOString()
        : undefined;

      return { items, nextCursor };
    }),
});
