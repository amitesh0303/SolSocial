"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocialProgram } from "./useSocialProgram";
import { buildTipPostTx } from "@/lib/program";
import { PublicKey } from "@solana/web3.js";

export function useTip(postAddress: string, postAuthor: string) {
  const queryClient = useQueryClient();
  const { program, wallet, connection } = useSocialProgram();

  const tip = useMutation({
    mutationFn: async (amountLamports: number) => {
      if (!program || !wallet) throw new Error("Wallet not connected");
      const tipper = new PublicKey(wallet.publicKey.toString());
      const postPubkey = new PublicKey(postAddress);
      const authorPubkey = new PublicKey(postAuthor);
      const tx = await buildTipPostTx(
        program,
        tipper,
        postPubkey,
        authorPubkey,
        amountLamports
      );
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = tipper;
      const signed = await wallet.signTransaction(tx);
      return connection.sendRawTransaction(signed.serialize());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { tip };
}
