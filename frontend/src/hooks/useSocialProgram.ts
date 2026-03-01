"use client";

import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { getSocialProgram } from "@/lib/program";

export function useSocialProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;
    return getSocialProgram(connection, wallet);
  }, [connection, wallet]);

  return { program, connection, wallet };
}
