import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { db } from "./db/index.js";
import { redis } from "./redis/index.js";
import { appRouter } from "./trpc/index.js";
import { createContext } from "./trpc/context.js";
import { heliusWebhookHandler } from "./indexer/webhook.js";
import { createWsServer } from "./websocket/index.js";
import { authMiddleware } from "./middleware/auth.js";
const app = new Hono();
// ─── Global Middleware ────────────────────────────────────────────────────────
app.use("*", authMiddleware);
// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (c) => {
    return c.json({ status: "ok", ts: new Date().toISOString() });
});
// ─── tRPC ────────────────────────────────────────────────────────────────────
app.use("/trpc/*", trpcServer({
    router: appRouter,
    createContext: createContext(db, redis),
}));
// ─── Helius Webhook ───────────────────────────────────────────────────────────
app.post("/webhook/helius", heliusWebhookHandler);
// ─── Start ───────────────────────────────────────────────────────────────────
const port = Number(process.env["PORT"] ?? 3001);
const wsPort = Number(process.env["WS_PORT"] ?? 3002);
serve({ fetch: app.fetch, port }, () => {
    console.info(`[HTTP] Server listening on port ${port}`);
});
createWsServer(wsPort);
export { app };
