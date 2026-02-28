export declare const communityRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context.js").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            limit?: number | undefined;
            cursor?: string | undefined;
        };
        output: {
            items: {
                id: string;
                name: string;
                createdAt: Date;
                onChainAddress: string;
                description: string | null;
                creatorWallet: string;
                memberCount: number;
            }[];
            nextCursor: string | undefined;
        };
        meta: object;
    }>;
    getByName: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            name: string;
        };
        output: {
            id: string;
            name: string;
            createdAt: Date;
            onChainAddress: string;
            description: string | null;
            creatorWallet: string;
            memberCount: number;
        } | null;
        meta: object;
    }>;
    getPosts: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            communityId: string;
            limit?: number | undefined;
            cursor?: string | undefined;
        };
        output: {
            items: {
                id: string;
                createdAt: Date;
                onChainAddress: string;
                authorWallet: string;
                content: string;
                mediaUri: string | null;
                likeCount: number;
                commentCount: number;
                tipTotal: bigint;
                communityId: string | null;
                slot: bigint;
            }[];
            nextCursor: string | undefined;
        };
        meta: object;
    }>;
}>>;
