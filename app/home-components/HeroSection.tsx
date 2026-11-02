// components/HeroSection.tsx
"use client";

import { motion } from "motion/react";
import { ArrowUpRight, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-[#FDFCFB] text-[#141414] px-6 py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl w-full">
        {/* টপ মেটা ট্যাগ: একদম পরিষ্কার প্রোডাক্ট পরিচয় */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-neutral-500 font-mono font-medium mb-10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
          <span>Smart CV, Biodata & Organization Hub</span>
        </motion.div>

        {/* মেইন গ্রিড */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* বাঁদিকের টাইপোগ্রাফি ও অ্যাকশন */}
          <div className="lg:col-span-7 space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl font-light tracking-tight leading-[1.04] text-neutral-950 font-serif"
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
              className="text-base sm:text-lg text-neutral-600 font-light max-w-lg leading-relaxed"
            >
              Build publication-grade resumes, family biodatas, or company
              profiles. Print your document with a live QR code that connects
              anyone to your digital portfolio in one scan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap items-center gap-6 pt-2"
            ></motion.div>

            {/* ৩টি পরিষ্কার কি-ফিচার */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="pt-8 grid grid-cols-3 gap-6 border-t border-neutral-200/80 max-w-md text-left"
            >
              <div>
                <p className="text-xl font-light font-serif text-neutral-950">
                  Paper + Web
                </p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">
                  Connected via QR
                </p>
              </div>
              <div>
                <p className="text-xl font-light font-serif text-neutral-950">
                  Dual Mode
                </p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">
                  Person & Business
                </p>
              </div>
              <div>
                <p className="text-xl font-light font-serif text-neutral-950">
                  Zero Cost
                </p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">
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
            className="lg:col-span-5 relative"
          >
            {/* মূল ইমেজ ফ্রেম */}
            <div className="group relative aspect-4/5 w-full max-w-md mx-auto overflow-hidden bg-neutral-100 border border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-tl-full rounded-tr-full">
              <Image
                src="/hero-portrait.jpg"
                alt="Editorial Portrait Profile"
                fill
                priority
                className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-75" />

              <div className="pointer-events-none absolute bottom-6 right-6 text-white space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono bg-white/20 backdrop-blur-md px-2.5 py-1">
                  Live Candidate Card
                </span>
                <p className="text-lg font-serif">Helena Vance</p>
                <p className="text-xs text-white/80 font-light">
                  Architect • Kolkata / Remote
                </p>
              </div>
            </div>

            {/* ওভারল্যাপিং মিনি কিউআর ব্যাজ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-8 -left-4 sm:-left-8 bg-white border border-neutral-200 p-5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] max-w-56 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
                  Dynamic QR Code
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="bg-neutral-50 p-2 border border-neutral-100 flex justify-center">
                <QrCode className="w-20 h-20 text-neutral-900 stroke-[1.2]" />
              </div>
              <p className="text-[11px] leading-tight text-neutral-600 font-light">
                Printed on physical CV. Scans directly to your live portfolio.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
