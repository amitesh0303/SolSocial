import { create } from "zustand";
import type { Profile } from "@/types";

interface AppState {
  user: Profile | null;
  isWalletConnected: boolean;
  setUser: (profile: Profile | null) => void;
  setIsWalletConnected: (connected: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isWalletConnected: false,
  setUser: (profile) => set({ user: profile }),
  setIsWalletConnected: (connected) => set({ isWalletConnected: connected }),
}));
