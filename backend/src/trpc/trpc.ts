import { initTRPC, TRPCError } from "@trpc/server";
import type { AppContext } from "./context.js";

const t = initTRPC.context<AppContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.walletAddress) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Wallet address required" });
  }
  return next({ ctx: { ...ctx, walletAddress: ctx.walletAddress } });
});
