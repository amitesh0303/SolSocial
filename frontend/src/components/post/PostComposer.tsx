"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useCreatePost } from "@/hooks/usePosts";
import { useAppStore } from "@/stores/app-store";

const MAX_CHARS = 280;

export function PostComposer() {
  const { connected } = useWallet();
  const user = useAppStore((s) => s.user);
  const [content, setContent] = useState("");
  const [mediaUri, setMediaUri] = useState("");
  const [showMedia, setShowMedia] = useState(false);
  const { mutateAsync: createPost, isPending } = useCreatePost();

  if (!connected) {
    return (
      <div className="border-b border-zinc-800 px-4 py-6 text-center">
        <p className="text-zinc-400 text-sm">
          Connect your wallet to start posting
        </p>
      </div>
    );
  }

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;

  async function handleSubmit() {
    if (!content.trim() || isOverLimit || isPending) return;
    try {
      await createPost({ content: content.trim(), mediaUri: mediaUri.trim() });
      setContent("");
      setMediaUri("");
      setShowMedia(false);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  }

  return (
    <div className="border-b border-zinc-800 px-4 py-4">
      <div className="flex gap-3">
        <Avatar
          src={user?.avatarUri}
          fallback={user?.displayName ?? "Me"}
          size="md"
          className="shrink-0"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on Solana?"
            rows={3}
            className="w-full resize-none bg-transparent text-zinc-100 placeholder-zinc-500 text-lg focus:outline-none leading-relaxed"
          />

          {showMedia && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <input
                type="url"
                value={mediaUri}
                onChange={(e) => setMediaUri(e.target.value)}
                placeholder="Media URL (Arweave, IPFS…)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </motion.div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMedia((v) => !v)}
                className="rounded-full p-2 text-purple-400 hover:bg-purple-400/10 transition-colors"
                title="Add media"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <svg
                    viewBox="0 0 36 36"
                    className="h-8 w-8 -rotate-90"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#27272a"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke={isOverLimit ? "#ef4444" : remaining < 20 ? "#f59e0b" : "#a855f7"}
                      strokeWidth="3"
                      strokeDasharray={`${(content.length / MAX_CHARS) * 94.25} 94.25`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    className={`text-sm font-medium ${
                      isOverLimit
                        ? "text-red-400"
                        : remaining < 20
                        ? "text-yellow-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {remaining}
                  </span>
                </motion.div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isOverLimit}
                isLoading={isPending}
                size="md"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
