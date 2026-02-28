export declare const profileRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context.js").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getByWallet: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            wallet: string;
        };
        output: {
            id: string;
            walletAddress: string;
            username: string;
            displayName: string | null;
            bio: string | null;
            avatarUri: string | null;
            followerCount: number;
            followingCount: number;
            postCount: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        meta: object;
    }>;
    getByUsername: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            username: string;
        };
        output: {
            id: string;
            walletAddress: string;
            username: string;
            displayName: string | null;
            bio: string | null;
            avatarUri: string | null;
            followerCount: number;
            followingCount: number;
            postCount: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        meta: object;
    }>;
    search: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            query: string;
            limit?: number | undefined;
        };
        output: {
            id: string;
            walletAddress: string;
            username: string;
            displayName: string | null;
            bio: string | null;
            avatarUri: string | null;
            followerCount: number;
            followingCount: number;
            postCount: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: object;
    }>;
    getFollowers: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            wallet: string;
            limit?: number | undefined;
            cursor?: string | undefined;
        };
        output: {
            items: {
                follow: {
                    createdAt: Date;
                    followerWallet: string;
                    followeeWallet: string;
                };
                profile: {
                    id: string;
                    walletAddress: string;
                    username: string;
                    displayName: string | null;
                    bio: string | null;
                    avatarUri: string | null;
                    followerCount: number;
                    followingCount: number;
                    postCount: number;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            }[];
            nextCursor: string | undefined;
        };
        meta: object;
    }>;
    getFollowing: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            wallet: string;
            limit?: number | undefined;
            cursor?: string | undefined;
        };
        output: {
            items: {
                follow: {
                    createdAt: Date;
                    followerWallet: string;
                    followeeWallet: string;
                };
                profile: {
                    id: string;
                    walletAddress: string;
                    username: string;
                    displayName: string | null;
                    bio: string | null;
                    avatarUri: string | null;
                    followerCount: number;
                    followingCount: number;
                    postCount: number;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            }[];
            nextCursor: string | undefined;
        };
        meta: object;
    }>;
}>>;
