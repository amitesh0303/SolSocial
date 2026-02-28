"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Feed" },
  { href: "/explore", label: "Explore" },
  { href: "/communities", label: "Communities" },
];

export function Navbar() {
  const pathname = usePathname();
  const { publicKey } = useWallet();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-zinc-100 hidden sm:block">
            SolSocial
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              )}
            >
              {link.label}
            </Link>
          ))}
          {publicKey && (
            <Link
              href={`/profile/${publicKey.toString()}`}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/profile")
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              )}
            >
              Profile
            </Link>
          )}
        </nav>

        <div className="ml-auto">
          <WalletMultiButton
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              height: "36px",
              padding: "0 16px",
            }}
          />
        </div>
      </div>
    </header>
  );
}
