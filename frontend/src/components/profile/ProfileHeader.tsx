"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@/types";
import { shortenAddress } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onEdit?: () => void;
}

export function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-zinc-800 px-4 py-6"
    >
      {/* Banner */}
      <div className="h-24 rounded-2xl bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 mb-4" />

      <div className="flex items-start justify-between gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Avatar
            src={profile.avatarUri}
            fallback={profile.displayName}
            size="xl"
            className="ring-4 ring-zinc-950 -mt-10"
          />
        </motion.div>

        <div className="mt-1">
          {isOwnProfile ? (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit profile
            </Button>
          ) : (
            <Button
              variant={isFollowing ? "secondary" : "primary"}
              size="sm"
              onClick={onFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3">
        <h1 className="text-xl font-bold text-zinc-100">{profile.displayName}</h1>
        <p className="text-zinc-500 text-sm">@{profile.username}</p>
        <p className="text-zinc-400 text-sm mt-1">{shortenAddress(profile.wallet)}</p>

        {profile.bio && (
          <p className="mt-2 text-zinc-200 leading-relaxed">{profile.bio}</p>
        )}

        <div className="mt-3 flex gap-4 text-sm">
          <span>
            <span className="font-bold text-zinc-100">
              {profile.followingCount}
            </span>{" "}
            <span className="text-zinc-500">Following</span>
          </span>
          <span>
            <span className="font-bold text-zinc-100">
              {profile.followersCount}
            </span>{" "}
            <span className="text-zinc-500">Followers</span>
          </span>
          <span>
            <span className="font-bold text-zinc-100">{profile.postsCount}</span>{" "}
            <span className="text-zinc-500">Posts</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
