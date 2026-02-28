import type { AppContext } from "./context.js";
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: AppContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<AppContext, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const authedProcedure: import("@trpc/server").TRPCProcedureBuilder<AppContext, object, {
    walletAddress: string;
    db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof import("../db/schema.js")> & {
        $client: import("postgres").Sql<{}>;
    };
    redis: import("ioredis").default;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
