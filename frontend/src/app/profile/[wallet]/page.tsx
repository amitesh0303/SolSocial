"use client";

import { use } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostFeed } from "@/components/post/PostFeed";
import { Spinner } from "@/components/ui/Spinner";
import { useProfile } from "@/hooks/useProfile";

interface ProfilePageProps {
  params: Promise<{ wallet: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { wallet } = use(params);
  const { publicKey } = useWallet();
  const { data: profile, isLoading } = useProfile(wallet);
  const isOwnProfile = publicKey?.toString() === wallet;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1 min-w-0 max-w-2xl">
            <div className="rounded-2xl border border-zinc-800 p-8 text-center">
              <p className="text-zinc-400">Profile not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            <ProfileHeader
              profile={profile}
              isOwnProfile={isOwnProfile}
            />
            <div className="border-b border-zinc-800 px-4 py-3">
              <h2 className="font-bold text-zinc-100">Posts</h2>
            </div>
            <PostFeed wallet={wallet} />
          </div>
        </div>
      </div>
    </div>
  );
}
