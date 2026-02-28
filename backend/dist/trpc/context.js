export function createContext(db, redisClient) {
    return (_opts, c) => {
        const authHeader = c.req.header("x-wallet-address") ?? null;
        return {
            db,
            redis: redisClient,
            walletAddress: authHeader,
        };
    };
}
