export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("./context.js").AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    profile: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context.js").AppContext;
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
    post: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context.js").AppContext;
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
    community: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context.js").AppContext;
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
    tips: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context.js").AppContext;
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
    notification: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./context.js").AppContext;
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
}>>;
export type AppRouter = typeof appRouter;
