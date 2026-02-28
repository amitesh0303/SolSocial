import { initTRPC, TRPCError } from "@trpc/server";
const t = initTRPC.context().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.walletAddress) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Wallet address required" });
    }
    return next({ ctx: { ...ctx, walletAddress: ctx.walletAddress } });
});
