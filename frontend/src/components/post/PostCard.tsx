"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Post, Profile } from "@/types";
import { shortenAddress, formatTimestamp, formatSol } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  profile?: Profile | null;
  onLike?: (postAddress: string) => void;
  onTip?: (postAddress: string, author: string) => void;
}

export function PostCard({ post, profile, onLike, onTip }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showHeart, setShowHeart] = useState(false);

  const displayName = profile?.displayName ?? shortenAddress(post.author);
  const username = profile?.username ?? shortenAddress(post.author, 6);

  function handleLike() {
    if (liked) return;
    setLiked(true);
    setLikesCount((c) => c + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 600);
    onLike?.(post.address);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative border-b border-zinc-800 px-4 py-4 hover:bg-zinc-900/50 transition-colors"
    >
      {/* Floating heart animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-4xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            ❤️
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <Link href={`/profile/${post.author}`} className="shrink-0">
          <Avatar
            src={profile?.avatarUri}
            fallback={displayName}
            size="md"
            className="hover:ring-2 hover:ring-purple-500 transition-all"
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${post.author}`}
              className="font-semibold text-zinc-100 hover:text-purple-400 transition-colors truncate"
            >
              {displayName}
            </Link>
            <span className="text-zinc-500 text-sm truncate">@{username}</span>
            <span className="text-zinc-600 text-sm">·</span>
            <span className="text-zinc-500 text-sm shrink-0">
              {formatTimestamp(post.createdAt)}
            </span>
          </div>

          {/* Content */}
          <Link href={`/post/${post.address}`}>
            <p className="mt-1.5 text-zinc-200 whitespace-pre-wrap break-words leading-relaxed hover:text-zinc-100 transition-colors">
              {post.content}
            </p>
          </Link>

          {/* Community badge */}
          {post.community && (
            <Link href={`/communities/${post.community}`}>
              <span className="mt-2 inline-block rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400 hover:bg-purple-500/20 transition-colors">
                {post.community}
              </span>
            </Link>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1 text-zinc-500">
            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleLike}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                liked
                  ? "text-red-400 bg-red-400/10"
                  : "hover:text-red-400 hover:bg-red-400/10"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{likesCount}</span>
            </motion.button>

            {/* Comment */}
            <Link
              href={`/post/${post.address}`}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{post.commentsCount}</span>
            </Link>

            {/* Tip */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onTip?.(post.address, post.author)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {post.tipsTotal > 0 && (
                <span>{formatSol(post.tipsTotal, 2)} SOL</span>
              )}
            </motion.button>

            {/* Share */}
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/post/${post.address}`
                )
              }
              className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hover:text-green-400 hover:bg-green-400/10 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
