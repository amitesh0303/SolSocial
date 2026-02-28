"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocialProgram } from "./useSocialProgram";
import { buildFollowTx } from "@/lib/program";
import { PublicKey } from "@solana/web3.js";

export function useFollow(targetWallet: string) {
  const queryClient = useQueryClient();
  const { program, wallet, connection } = useSocialProgram();

  const follow = useMutation({
    mutationFn: async () => {
      if (!program || !wallet) throw new Error("Wallet not connected");
      const follower = new PublicKey(wallet.publicKey.toString());
      const following = new PublicKey(targetWallet);
      const tx = await buildFollowTx(program, follower, following);
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = follower;
      const signed = await wallet.signTransaction(tx);
      return connection.sendRawTransaction(signed.serialize());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", targetWallet] });
      queryClient.invalidateQueries({
        queryKey: ["profile", wallet?.publicKey.toString()],
      });
    },
  });

  return { follow };
}
