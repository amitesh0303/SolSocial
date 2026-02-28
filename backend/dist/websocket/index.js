import WebSocket, { WebSocketServer } from "ws";
import Redis from "ioredis";
const clients = new Map();
function channelKey(ch) {
    switch (ch.type) {
        case "feed":
            return `feed:${ch.wallet}`;
        case "post":
            return `post:${ch.address}`;
        case "profile":
            return `profile:${ch.wallet}`;
        case "community":
            return `community:${ch.id}`;
    }
}
export function createWsServer(port) {
    const wss = new WebSocketServer({ port });
    // Subscriber for pub/sub events from the indexer
    const subscriber = new Redis(process.env["REDIS_URL"] ?? "redis://localhost:6379");
    subscriber.on("error", (err) => console.error("[WS Subscriber] Redis error:", err.message));
    subscriber.psubscribe("feed:*", "post:*", "profile:*", "community:*", (err) => {
        if (err)
            console.error("[WS] psubscribe error:", err);
    });
    subscriber.on("pmessage", (_pattern, channel, message) => {
        let payload;
        try {
            payload = JSON.parse(message);
        }
        catch {
            return;
        }
        for (const client of clients.values()) {
            if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({ channel, data: payload }));
            }
        }
    });
    wss.on("connection", (ws, _req) => {
        const id = crypto.randomUUID();
        const client = { ws, subscriptions: new Set() };
        clients.set(id, client);
        ws.on("message", (raw) => {
            try {
                const msg = JSON.parse(raw.toString());
                const key = channelKey(msg.channel);
                if (msg.action === "subscribe") {
                    client.subscriptions.add(key);
                }
                else if (msg.action === "unsubscribe") {
                    client.subscriptions.delete(key);
                }
            }
            catch {
                // Ignore malformed messages
            }
        });
        ws.on("close", () => {
            clients.delete(id);
        });
        ws.on("error", (err) => {
            console.error(`[WS] Client ${id} error:`, err.message);
            clients.delete(id);
        });
        ws.send(JSON.stringify({ type: "connected", id }));
    });
    wss.on("error", (err) => {
        console.error("[WS Server] Error:", err.message);
    });
    console.info(`[WS Server] Listening on port ${port}`);
    return wss;
}
