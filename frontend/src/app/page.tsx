"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────── helpers ─────────────────────── */

function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target, duration]);
  return value;
}

function AnimatedStat({
  value,
  suffix,
  prefix,
  label,
  start,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  start: boolean;
}) {
  const count = useCountUp(value, 2000, start);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-zinc-400 mt-1">{label}</div>
    </div>
  );
}

/* ─────────────────────────── data ────────────────────────── */

const features = [
  {
    icon: "🔐",
    title: "Own Your Data",
    desc: "Your profile and content live on Solana. No platform can delete or censor you.",
  },
  {
    icon: "💰",
    title: "Earn From Content",
    desc: "Receive SOL tips directly from your audience with zero platform fees.",
  },
  {
    icon: "🌐",
    title: "Portable Identity",
    desc: "Your social graph is yours. Take your followers anywhere.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Sub-second publishing at less than $0.01 per post on Solana.",
  },
  {
    icon: "🏘️",
    title: "Community Driven",
    desc: "Create and join communities with on-chain governance.",
  },
  {
    icon: "🛡️",
    title: "Censorship Resistant",
    desc: "No single entity controls your content or social connections.",
  },
];

const steps = [
  {
    n: "01",
    title: "Connect Wallet",
    desc: "Connect your Phantom, Solflare, or Backpack wallet in one click.",
  },
  {
    n: "02",
    title: "Create Profile",
    desc: "Set your username, bio, and avatar — stored permanently on-chain.",
  },
  {
    n: "03",
    title: "Start Posting",
    desc: "Share thoughts up to 280 characters, with media on Arweave/IPFS.",
  },
  {
    n: "04",
    title: "Build Community",
    desc: "Follow others, gain followers, and create your own communities.",
  },
  {
    n: "05",
    title: "Monetize",
    desc: "Receive SOL tips directly from your audience with no middleman.",
  },
];

const creators = [
  { name: "0xSatoshi", handle: "@satoshi", followers: "12.4k", tips: "42.1 SOL", color: "from-purple-500 to-blue-500" },
  { name: "CryptoLuna", handle: "@cryptoluna", followers: "8.9k", tips: "28.7 SOL", color: "from-pink-500 to-purple-600" },
  { name: "DecentDev", handle: "@decentdev", followers: "6.1k", tips: "19.3 SOL", color: "from-blue-500 to-cyan-500" },
];

/* ────────────────── section wrapper ──────────────────────── */

function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────── main component ───────────────────── */

export default function LandingPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <div className="bg-[#09090b] text-white overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #09090b 0%, #1a0533 60%, #09090b 100%)" }}
      >
        {/* grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* glow orbs */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl"
        >
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" aria-hidden="true" />
            Live on Solana Mainnet
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #60a5fa 100%)" }}
            >
              Own Your Social
            </span>
            <br />
            <span className="text-white">Identity</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The first fully on-chain social protocol on Solana. Create, share,
            and monetize — with complete data ownership.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
            >
              Launch App
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-200 hover:scale-105"
            >
              Read Docs
            </a>
          </div>

          {/* hero stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { val: "10k+", label: "Profiles" },
              { val: "50k+", label: "Posts" },
              { val: "$25k+", label: "Tips Sent" },
              { val: "<$0.01", label: "Per Post" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                <div className="text-xl font-bold text-white">{s.val}</div>
                <div className="text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-600 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for the{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #c084fc, #60a5fa)" }}
              >
                decentralized web
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Every feature is designed with sovereignty and ownership at its core.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeInSection key={f.title} delay={i * 0.07}>
                <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-purple-500/40 hover:bg-zinc-900/80 transition-all duration-300 h-full">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-white mb-2 text-lg">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(180deg, transparent, #0f0520 50%, transparent)" }}>
        <div className="mx-auto max-w-4xl">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 text-lg">
              Get started in minutes. Own your identity forever.
            </p>
          </FadeInSection>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/0 via-purple-500/40 to-purple-500/0 -translate-x-1/2 hidden md:block" />

            <div className="space-y-10">
              {steps.map((step, i) => (
                <FadeInSection key={step.n} delay={i * 0.1}>
                  <div className={`flex gap-6 md:gap-12 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`} />
                    {/* circle */}
                    <div className="shrink-0 relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-500 bg-zinc-950 text-purple-400 font-bold text-sm">
                      {step.n}
                    </div>
                    <div className={`flex-1 pb-4 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                      <h3 className="font-semibold text-white text-lg mb-1">{step.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div
            ref={statsRef}
            className="rounded-3xl border border-zinc-800 p-10 grid grid-cols-2 md:grid-cols-4 gap-8"
            style={{ background: "linear-gradient(135deg, #18181b, #27143a)" }}
          >
            <AnimatedStat value={10000} suffix="+" label="Profiles Created" start={statsInView} />
            <AnimatedStat value={50000} suffix="+" label="Posts Published" start={statsInView} />
            <AnimatedStat value={25000} prefix="$" suffix="+" label="Tips Sent (USD)" start={statsInView} />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">&lt;$0.01</div>
              <div className="text-sm text-zinc-400 mt-1">Cost Per Post</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Creator Spotlight ─────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <FadeInSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Top Creators This Week
            </h2>
            <p className="text-zinc-400 text-lg">
              The most-tipped voices on the protocol.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creators.map((c, i) => (
              <FadeInSection key={c.handle} delay={i * 0.1}>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-purple-500/30 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-5">
                    {/* avatar */}
                    <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-sm text-zinc-500">{c.handle}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="text-zinc-500 mb-0.5">Followers</div>
                      <div className="font-semibold text-white">{c.followers}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-zinc-500 mb-0.5">Tips Received</div>
                      <div className="font-semibold text-purple-400">{c.tips}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-30 blur-3xl"
          style={{ background: "radial-gradient(ellipse at 50% 50%, #7c3aed 0%, transparent 70%)" }}
        />
        <FadeInSection className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Own Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #c084fc, #60a5fa)" }}
            >
              Social Identity?
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of creators who have already taken back control of their online presence.
          </p>
          <Link
            href="/app"
            className="group inline-flex items-center gap-2 rounded-2xl px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
          >
            Launch App
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </FadeInSection>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  </svg>
                </div>
                <span className="font-bold text-white">SolSocial Protocol</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The first fully on-chain social protocol built on Solana.
              </p>
            </div>

            <div>
              <div className="font-semibold text-zinc-300 mb-3 text-sm">Product</div>
              <ul className="space-y-2 text-sm text-zinc-500">
                {[
                  { label: "Feed", href: "/app" },
                  { label: "Explore", href: "/explore" },
                  { label: "Communities", href: "/communities" },
                  { label: "Profile", href: "/app" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-zinc-300 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-300 mb-3 text-sm">Developers</div>
              <ul className="space-y-2 text-sm text-zinc-500">
                {[
                  { label: "Docs", href: "https://github.com" },
                  { label: "GitHub", href: "https://github.com" },
                  { label: "SDK", href: "https://github.com" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-300 mb-3 text-sm">Community</div>
              <ul className="space-y-2 text-sm text-zinc-500">
                {["Twitter", "Discord", "Telegram"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-zinc-300 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
            <span>© 2026 SolSocial Protocol. All rights reserved.</span>
            <span>Built on Solana ◎</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
