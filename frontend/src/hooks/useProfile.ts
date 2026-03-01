"use client";

import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@/types";

async function fetchProfile(wallet: string): Promise<Profile | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const res = await fetch(`${apiUrl}/api/profile/${wallet}`);
  if (!res.ok) return null;
  return res.json();
}

export function useProfile(wallet?: string | null) {
  return useQuery<Profile | null>({
    queryKey: ["profile", wallet],
    queryFn: () => fetchProfile(wallet!),
    enabled: !!wallet,
    staleTime: 1000 * 60 * 2,
  });
}
