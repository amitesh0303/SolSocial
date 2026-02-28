import type { Metadata } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "SolSocial — Decentralized Social on Solana",
  description:
    "The premier decentralized social network built on the Solana blockchain.",
  openGraph: {
    title: "SolSocial",
    description: "Decentralized social on Solana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
