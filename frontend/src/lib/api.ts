import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trpcClient = createTRPCClient<any>({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,
      transformer: superjson,
    }),
  ],
});
