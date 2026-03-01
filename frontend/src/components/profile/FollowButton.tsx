"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useFollow } from "@/hooks/useFollow";
import { useWallet } from "@solana/wallet-adapter-react";

interface FollowButtonProps {
  targetWallet: string;
  initialFollowing?: boolean;
}

export function FollowButton({ targetWallet, initialFollowing = false }: FollowButtonProps) {
  const { connected } = useWallet();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const { follow } = useFollow(targetWallet);

  if (!connected) return null;

  async function handleClick() {
    try {
      await follow.mutateAsync();
      setIsFollowing((v) => !v);
    } catch (err) {
      console.error("Follow action failed:", err);
    }
  }

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        variant={isFollowing ? "secondary" : "primary"}
        size="sm"
        onClick={handleClick}
        isLoading={follow.isPending}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </motion.div>
  );
}
