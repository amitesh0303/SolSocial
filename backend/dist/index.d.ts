import { Hono } from "hono";
declare const app: Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
export type { AppRouter } from "./trpc/index.js";
export { app };
