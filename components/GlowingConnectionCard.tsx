// components/GlowingConnectionCard.tsx
"use client";

import { motion } from "motion/react";
import { ShieldCheck, Globe, User, Mail } from "lucide-react";

export default function GlowingConnectionCard() {
  // সেন্ট্রাল হাব (x: 180, y: 36) থেকে নিচের ৩টি নোডের দিকে যাওয়ার SVG পাথ
  const paths = [
    "M 180 42 C 180 85, 65 75, 65 125", // বামদিকের নোড
    "M 180 42 L 180 125", // মাঝখানের সোজা নোড
    "M 180 42 C 180 85, 295 75, 295 125", // ডানদিকের নোড
  ];

  const nodes = [
    { label: "Google", icon: Globe, delay: 0 },
    { label: "User", icon: User, delay: 0.45 },
    { label: "Email OTP", icon: Mail, delay: 0.9 },
  ];

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl overflow-hidden select-none">
      {/* অ্যানিমেটেড কানেকশন গ্রাফিক এরিয়া */}
      <div className="relative h-44 w-full flex flex-col items-center justify-between">
        {/* ব্যাকগ্রাউন্ড রেডিয়াল গ্লো */}
        <div
          aria-hidden="true"
          className="absolute top-2 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none"
        />

        {/* SVG কানেকশন লাইন ও অ্যানিমেটেড পালস */}
        <svg
          viewBox="0 0 360 150"
          className="absolute inset-0 h-full w-full pointer-events-none"
          fill="none"
        >
          <defs>
            <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {paths.map((d, index) => (
            <g key={index}>
              {/* ১. স্থির বেস লাইন */}
              <path
                d={d}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* ২. চলমান গ্লোয়িং ডেটা পালস */}
              <motion.path
                d={d}
                stroke="url(#pulse-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0.28, pathOffset: -0.3, opacity: 0 }}
                animate={{
                  pathOffset: [-0.3, 1.1],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  delay: index * 0.45,
                  ease: "easeInOut",
                }}
              />
            </g>
          ))}
        </svg>

        {/* ওপরের সেন্ট্রাল হাব আইকন (SutraNet / Auth Core) */}
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/40 bg-neutral-900 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
        </div>

        {/* নিচের ৩টি কানেক্টেড আইকন নোড */}
        <div className="relative z-10 grid w-full grid-cols-3 gap-3 px-3 pb-1">
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.label}
                animate={{
                  borderColor: [
                    "rgba(38,38,38,1)",
                    "rgba(52,211,153,0.55)",
                    "rgba(38,38,38,1)",
                  ],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: node.delay + 0.8,
                }}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 py-2.5 px-2 backdrop-blur-xs"
              >
                <Icon className="h-4 w-4 text-neutral-200" />
                <span className="text-[10px] font-mono text-neutral-400">
                  {node.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* কার্ডের নিচের টেক্সট অংশ */}
      <div className="mt-5 border-t border-neutral-800/80 pt-4">
        <h3 className="text-sm font-semibold tracking-tight text-white">
          Instant Identity Sync
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-neutral-400">
          Connect multiple verification channels with real-time cryptographic
          pulse sync across your digital profile.
        </p>
      </div>
    </div>
  );
}
