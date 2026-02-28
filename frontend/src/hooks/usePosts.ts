"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, FeedPage } from "@/types";
import { useSocialProgram } from "./useSocialProgram";
import { buildCreatePostTx } from "@/lib/program";
import { PublicKey } from "@solana/web3.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchPosts(wallet?: string, cursor?: string): Promise<FeedPage> {
  const params = new URLSearchParams();
  if (wallet) params.set("wallet", wallet);
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${API_URL}/api/posts?${params.toString()}`);
  if (!res.ok) return { posts: [] };
  return res.json();
}

// Mock data for development / when API is unavailable
function getMockPosts(wallet?: string): FeedPage {
  const posts: Post[] = Array.from({ length: 5 }, (_, i) => ({
    address: `mock-post-${i}-${wallet ?? "global"}`,
    author: wallet ?? "11111111111111111111111111111111",
    content: `This is a sample post #${i + 1} on SolSocial! 🚀 Building the decentralized social future on Solana.`,
    likesCount: Math.floor(Math.random() * 100),
    commentsCount: Math.floor(Math.random() * 20),
    tipsTotal: Math.floor(Math.random() * 1000000),
    createdAt: Math.floor(Date.now() / 1000) - i * 3600,
    isLiked: false,
  }));
  return { posts };
}

export function usePosts(wallet?: string) {
  return useInfiniteQuery<FeedPage>({
    queryKey: ["posts", wallet],
    queryFn: async ({ pageParam }) => {
      try {
        return await fetchPosts(wallet, pageParam as string | undefined);
      } catch {
        return getMockPosts(wallet);
      }
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 30,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { program, wallet, connection } = useSocialProgram();

  return useMutation({
    mutationFn: async ({
      content,
      mediaUri = "",
      community = "",
    }: {
      content: string;
      mediaUri?: string;
      community?: string;
    }) => {
      if (!program || !wallet) throw new Error("Wallet not connected");
      const author = new PublicKey(wallet.publicKey.toString());
      const tx = await buildCreatePostTx(program, author, content, mediaUri, community);
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = author;
      const signed = await wallet.signTransaction(tx);
      return connection.sendRawTransaction(signed.serialize());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
