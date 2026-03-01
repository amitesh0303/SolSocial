"use client";

import { use } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/post/PostCard";
import { CommentThread } from "@/components/post/CommentThread";
import { Spinner } from "@/components/ui/Spinner";
import type { Post, Comment } from "@/types";

// Mock data – in production these would come from TanStack Query
const MOCK_POST: Post = {
  address: "mock-post-detail",
  author: "DemoWallet111111111111111111111111111111111",
  content:
    "Just deployed my first Solana program using Anchor! The on-chain social protocol is live on devnet. Check it out and give it a try. Building the future of decentralized social is happening right now 🚀 #Solana #Web3",
  likesCount: 42,
  commentsCount: 7,
  tipsTotal: 500000000,
  createdAt: Math.floor(Date.now() / 1000) - 3600,
  isLiked: false,
};

const MOCK_COMMENTS: Comment[] = [
  {
    address: "comment-1",
    author: "DemoWallet222222222222222222222222222222222",
    post: "mock-post-detail",
    content: "This is amazing! Can't wait to try it out.",
    createdAt: Math.floor(Date.now() / 1000) - 1800,
  },
  {
    address: "comment-2",
    author: "DemoWallet333333333333333333333333333333333",
    post: "mock-post-detail",
    content: "Great work! The future of social media is on-chain.",
    createdAt: Math.floor(Date.now() / 1000) - 900,
  },
];

interface PostPageProps {
  params: Promise<{ address: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const { address } = use(params);

  // In production: useQuery to fetch post by address
  const post = { ...MOCK_POST, address };
  const comments = MOCK_COMMENTS;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="border-b border-zinc-800 px-4 py-3">
              <h1 className="font-bold text-zinc-100">Post</h1>
            </div>
            <PostCard post={post} />
            <div className="border-t border-zinc-800">
              <CommentThread comments={comments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
