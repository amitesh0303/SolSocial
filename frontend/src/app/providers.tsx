"use client";

import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";

const WalletContextProvider = dynamic(
  () => import("./wallet-provider").then((m) => m.WalletContextProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WalletContextProvider>
        <Toast.Provider swipeDirection="right">
          {children}
          <Toast.Viewport className="fixed bottom-16 right-4 z-50 flex flex-col gap-2 w-80 lg:bottom-4" />
        </Toast.Provider>
      </WalletContextProvider>
    </QueryClientProvider>
  );
}
