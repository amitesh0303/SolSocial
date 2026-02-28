"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import { Spinner } from "@/components/ui/Spinner";
import { usePosts } from "@/hooks/usePosts";

interface PostFeedProps {
  wallet?: string;
}

export function PostFeed({ wallet }: PostFeedProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePosts(wallet);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
        <svg
          viewBox="0 0 24 24"
          className="h-12 w-12 mb-3 opacity-30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p className="text-sm">No posts yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {posts.map((post, i) => (
        <motion.div
          key={post.address}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={observerRef} className="h-4" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}
    </motion.div>
  );
}
