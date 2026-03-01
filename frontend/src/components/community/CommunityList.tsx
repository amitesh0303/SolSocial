"use client";

import { CommunityCard } from "./CommunityCard";
import { Spinner } from "@/components/ui/Spinner";
import type { Community } from "@/types";

interface CommunityListProps {
  communities: Community[];
  isLoading?: boolean;
}

const MOCK_COMMUNITIES: Community[] = [
  {
    name: "solana-dev",
    description: "Discussions for Solana developers building the future of web3",
    creator: "11111111111111111111111111111111",
    membersCount: 1420,
    postsCount: 380,
    createdAt: Date.now() / 1000 - 30 * 86400,
  },
  {
    name: "nft-drops",
    description: "Latest NFT drops and collections on Solana",
    creator: "11111111111111111111111111111111",
    membersCount: 3800,
    postsCount: 920,
    createdAt: Date.now() / 1000 - 60 * 86400,
  },
  {
    name: "defi-alpha",
    description: "DeFi strategies, yield farming, and protocol updates",
    creator: "11111111111111111111111111111111",
    membersCount: 2100,
    postsCount: 540,
    createdAt: Date.now() / 1000 - 45 * 86400,
  },
  {
    name: "gaming",
    description: "Web3 gaming on Solana — play-to-earn, guilds, and more",
    creator: "11111111111111111111111111111111",
    membersCount: 890,
    postsCount: 210,
    createdAt: Date.now() / 1000 - 20 * 86400,
  },
];

export function CommunityList({ communities, isLoading }: CommunityListProps) {
  const list = communities.length > 0 ? communities : MOCK_COMMUNITIES;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {list.map((community) => (
        <CommunityCard key={community.name} community={community} />
      ))}
    </div>
  );
}
