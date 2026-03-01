"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { Comment } from "@/types";
import { shortenAddress, formatTimestamp } from "@/lib/utils";
import { motion } from "framer-motion";

interface CommentThreadProps {
  comments: Comment[];
  isLoading?: boolean;
  onSubmit?: (content: string) => Promise<void>;
}

export function CommentThread({ comments, isLoading, onSubmit }: CommentThreadProps) {
  const { connected } = useWallet();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit?.(content.trim());
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {/* Comment input */}
      {connected && (
        <div className="border-b border-zinc-800 px-4 py-4">
          <div className="flex gap-3">
            <Avatar fallback="Me" size="sm" className="shrink-0 mt-1" />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Post your reply"
                rows={2}
                className="w-full resize-none bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none leading-relaxed"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  isLoading={isSubmitting}
                  size="sm"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-zinc-500 text-sm">
          No replies yet. Be the first to reply!
        </div>
      ) : (
        <div>
          {comments.map((comment, i) => (
            <motion.div
              key={comment.address}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-3 border-b border-zinc-800 px-4 py-4"
            >
              <Avatar
                src={comment.authorProfile?.avatarUri}
                fallback={
                  comment.authorProfile?.displayName ??
                  shortenAddress(comment.author)
                }
                size="sm"
                className="shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-100 text-sm">
                    {comment.authorProfile?.displayName ??
                      shortenAddress(comment.author)}
                  </span>
                  <span className="text-zinc-500 text-xs">
                    {formatTimestamp(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-zinc-300 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
