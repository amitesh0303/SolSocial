export declare const notificationRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context.js").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            wallet: string;
            limit?: number | undefined;
            cursor?: string | undefined;
        };
        output: {
            items: {
                id: string;
                createdAt: Date;
                recipientWallet: string;
                type: string;
                actorWallet: string | null;
                referenceId: string | null;
                read: number;
            }[];
            nextCursor: string | undefined;
        };
        meta: object;
    }>;
    markRead: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            notificationIds: string[];
        };
        output: {
            success: boolean;
            count: number;
        };
        meta: object;
    }>;
}>>;
