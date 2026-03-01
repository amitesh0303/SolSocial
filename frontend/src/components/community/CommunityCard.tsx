"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Community } from "@/types";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/communities/${community.name}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-purple-500/40 hover:bg-zinc-900 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-xl shrink-0">
            {community.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-100 truncate">
              {community.name}
            </h3>
            {community.description && (
              <p className="text-zinc-400 text-sm mt-0.5 line-clamp-2">
                {community.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
              <span>
                <span className="font-medium text-zinc-300">
                  {community.membersCount}
                </span>{" "}
                members
              </span>
              <span>
                <span className="font-medium text-zinc-300">
                  {community.postsCount}
                </span>{" "}
                posts
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
