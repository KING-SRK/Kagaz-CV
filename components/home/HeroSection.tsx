// components/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { QrCode, ArrowUpRight, Users } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-[#FDFCFB] text-[#141414] px-4 sm:px-6 lg:px-8 pt-4 pb-14 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20 overflow-x-clip">
      <div className="mx-auto w-full">
        {/* মেইন রেসপন্সিভ গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 items-start lg:items-center">
          {/* বাঁদিকের টাইপোগ্রাফি ও অ্যাকশন */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* টপ মেটা ট্যাগ (বামপাশেই থাকবে) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase text-neutral-500 font-mono font-medium mb-4 sm:mb-6 text-left"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="leading-snug">
                Verified Digital Identity, Smart CV &amp; Organization Hub
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-light tracking-tight leading-[1.06] text-neutral-950 font-serif"
            >
              Paper CV. <br />
              <span className="italic font-normal">Alive with dynamic QR.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-sm sm:text-base md:text-lg text-neutral-600 font-light max-w-xl leading-relaxed"
            >
              Create clean, job-ready resumes, verified personal profiles, or
              company pages. Print your CV with a live QR code and SutraNet ID
              so anyone can verify your profile in one scan.
            </motion.p>

            {/* শুধুমাত্র বাটন দুটো মোবাইলে সেন্টার, ডেস্কটপে লেফট-অ্যালাইনড */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 pt-1"
            >
              <Link
                href="/create-cv"
                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-neutral-950 text-white px-4 sm:px-7 py-2.5 sm:py-3.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 active:bg-neutral-900 transition-all shadow-sm whitespace-nowrap"
              >
                <span>Create Free CV</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </Link>

              <Link
                href="/find-talent"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-neutral-300 text-neutral-900 px-4 sm:px-6 py-2.5 sm:py-3.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider rounded-xs hover:border-neutral-950 hover:bg-neutral-50 active:bg-neutral-100 transition-colors whitespace-nowrap"
              >
                <Users className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                <span>Explore Talent</span>
              </Link>
            </motion.div>

            {/* ৩টি পরিষ্কার কি-ফিচার (বামপাশেই থাকবে) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="pt-5 sm:pt-6 grid grid-cols-3 gap-3 sm:gap-6 border-t border-neutral-200/80 max-w-lg text-left"
            >
              <div className="min-w-0">
                <p className="text-sm sm:text-lg md:text-xl font-light font-serif text-neutral-950 truncate">
                  Paper + Web
                </p>
                <p className="text-[9.5px] sm:text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5 sm:mt-1 leading-tight">
                  Connected via QR
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-lg md:text-xl font-light font-serif text-neutral-950 truncate">
                  Dual Mode
                </p>
                <p className="text-[9.5px] sm:text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5 sm:mt-1 leading-tight">
                  Person &amp; Enterprise
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-lg md:text-xl font-light font-serif text-neutral-950 truncate">
                  Zero Cost
                </p>
                <p className="text-[9.5px] sm:text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5 sm:mt-1 leading-tight">
                  Free PDF Export
                </p>
              </div>
            </motion.div>
          </div>

          {/* ডানদিকের ইমেজ ও কিউআর লেয়ারিং */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative pb-10 sm:pb-8 max-w-md mx-auto w-full"
          >
            {/* মূল ইমেজ ফ্রেম (বাড়তি টেক্সট ওভারলে ছাড়া পরিষ্কার ভিজ্যুয়াল) */}
            <div className="group relative aspect-4/5 w-full overflow-hidden bg-neutral-100 border border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-tl-full rounded-tr-full">
              <Image
                src="/images/image.png"
                alt="SutraNet Digital Identity, Talent and Enterprise Network"
                fill
                priority
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 448px, 38vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
            </div>

            {/* ওভারল্যাপিং মিনি কিউআর ব্যাজ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-0 left-0 sm:-left-6 bg-white border border-neutral-200 p-3 sm:p-4 lg:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] w-40 sm:w-52.5 space-y-1.5 sm:space-y-2.5 rounded-xs"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-1 sm:pb-1.5">
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-neutral-400">
                  Dynamic QR Code
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <div className="bg-neutral-50 p-1.5 sm:p-2 border border-neutral-100 flex justify-center">
                <QrCode className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-neutral-900 stroke-[1.2]" />
              </div>
              <p className="text-[9.5px] sm:text-[11px] leading-tight text-neutral-600 font-light">
                Printed on physical CV. Scans directly to your live record.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
