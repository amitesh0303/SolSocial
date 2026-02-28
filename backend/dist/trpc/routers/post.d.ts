export declare const postRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context.js").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getFeed: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            wallet: string;
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
    getByAuthor: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            wallet: string;
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
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            address: string;
        };
        output: {
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
        } | null;
        meta: object;
    }>;
    getTrending: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            limit?: number | undefined;
        };
        output: {
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
        meta: object;
    }>;
    getComments: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            postAddress: string;
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
                postAddress: string;
            }[];
            nextCursor: string | undefined;
        };
        meta: object;
    }>;
}>>;
