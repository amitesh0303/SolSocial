"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import type { Profile } from "@/types";
import { shortenAddress } from "@/lib/utils";

interface ProfileCardProps {
  profile: Profile;
  showBio?: boolean;
}

export function ProfileCard({ profile, showBio = false }: ProfileCardProps) {
  return (
    <Link href={`/profile/${profile.wallet}`}>
      <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-zinc-800/50 transition-colors">
        <Avatar
          src={profile.avatarUri}
          fallback={profile.displayName}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-100 truncate">
            {profile.displayName}
          </p>
          <p className="text-zinc-500 text-sm truncate">
            @{profile.username ?? shortenAddress(profile.wallet)}
          </p>
          {showBio && profile.bio && (
            <p className="text-zinc-400 text-xs mt-0.5 line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>
        <div className="text-right text-xs text-zinc-500 shrink-0">
          <div className="font-medium text-zinc-300">{profile.followersCount}</div>
          <div>followers</div>
        </div>
      </div>
    </Link>
  );
}
