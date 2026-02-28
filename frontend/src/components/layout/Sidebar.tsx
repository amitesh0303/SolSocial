"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Feed",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/explore",
    label: "Explore",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    href: "/communities",
    label: "Communities",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const trending = ["#Solana", "#Web3", "#DeFi", "#NFTs", "#GameFi"];

export function Sidebar() {
  const pathname = usePathname();
  const { publicKey } = useWallet();

  return (
    <aside className="hidden lg:flex flex-col gap-4 sticky top-20 h-fit w-64">
      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-purple-500/10 text-purple-400"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        {publicKey && (
          <Link
            href={`/profile/${publicKey.toString()}`}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/profile")
                ? "bg-purple-500/10 text-purple-400"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </Link>
        )}
      </nav>

      {/* Trending */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="font-semibold text-zinc-100 mb-3">Trending</h3>
        <div className="flex flex-col gap-2">
          {trending.map((tag) => (
            <Link
              key={tag}
              href={`/explore?q=${encodeURIComponent(tag)}`}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-zinc-600 px-1">
        © 2024 SolSocial · Built on Solana
      </p>
    </aside>
  );
}
