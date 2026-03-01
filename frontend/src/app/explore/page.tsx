"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostFeed } from "@/components/post/PostFeed";
import { ProfileCard } from "@/components/profile/ProfileCard";
import type { Profile } from "@/types";

const SUGGESTED_PROFILES: Profile[] = [
  {
    wallet: "DemoWallet111111111111111111111111111111111",
    username: "solana_dev",
    displayName: "Solana Dev",
    bio: "Building on Solana 🔨",
    avatarUri: "",
    followersCount: 1200,
    followingCount: 340,
    postsCount: 87,
    createdAt: Date.now() / 1000 - 90 * 86400,
    bump: 255,
  },
  {
    wallet: "DemoWallet222222222222222222222222222222222",
    username: "nft_collector",
    displayName: "NFT Collector",
    bio: "Collecting the best Solana NFTs",
    avatarUri: "",
    followersCount: 5600,
    followingCount: 210,
    postsCount: 450,
    createdAt: Date.now() / 1000 - 180 * 86400,
    bump: 254,
  },
  {
    wallet: "DemoWallet333333333333333333333333333333333",
    username: "defi_alpha",
    displayName: "DeFi Alpha",
    bio: "Finding alpha in DeFi markets",
    avatarUri: "",
    followersCount: 8900,
    followingCount: 120,
    postsCount: 920,
    createdAt: Date.now() / 1000 - 270 * 86400,
    bump: 253,
  },
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search profiles, posts, communities…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-base py-3"
            />
          </div>

          {/* Suggested profiles */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-zinc-800 overflow-hidden mb-6"
          >
            <div className="border-b border-zinc-800 px-4 py-3">
              <h2 className="font-bold text-zinc-100">Who to follow</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {SUGGESTED_PROFILES.filter((p) =>
                query
                  ? p.displayName.toLowerCase().includes(query.toLowerCase()) ||
                    p.username.toLowerCase().includes(query.toLowerCase())
                  : true
              ).map((profile) => (
                <div key={profile.wallet} className="px-2">
                  <ProfileCard profile={profile} showBio />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Trending posts */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-zinc-800 overflow-hidden"
          >
            <div className="border-b border-zinc-800 px-4 py-3">
              <h2 className="font-bold text-zinc-100">Trending posts</h2>
            </div>
            <PostFeed />
          </motion.section>
        </div>
      </div>
    </div>
  );
}
