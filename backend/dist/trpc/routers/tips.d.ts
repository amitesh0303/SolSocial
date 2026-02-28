export declare const tipsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context.js").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getByCreator: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            wallet: string;
            limit?: number | undefined;
            cursor?: string | undefined;
        };
        output: {
            items: {
                id: string;
                createdAt: Date;
                fromWallet: string;
                toWallet: string;
                amount: bigint;
                mint: string;
                txSignature: string;
            }[];
            nextCursor: string | undefined;
        };
        meta: object;
    }>;
    getLeaderboard: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            limit?: number | undefined;
        };
        output: {
            wallet: string;
            total: number;
        }[];
        meta: object;
    }>;
}>>;
