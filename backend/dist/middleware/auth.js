/**
 * Middleware that extracts the wallet address from the `x-wallet-address` header.
 * Verifying the signature is intentionally left for production-grade Solana
 * `signMessage` verification; here we trust the header value so that the
 * tRPC context can gate protected procedures.
 */
export async function authMiddleware(c, next) {
    const wallet = c.req.header("x-wallet-address");
    if (wallet) {
        c.set("walletAddress", wallet);
    }
    await next();
}
