// components/home/ServicesSection.tsx
"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import {
  FileText,
  IdCard,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

function subscribeToStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getActiveKagazIdSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  const savedCardId = localStorage.getItem("kagaz_card_id");
  return savedCardId && savedCardId.trim() ? savedCardId.trim() : null;
}

function getServerSnapshot(): string | null {
  return null;
}

export default function ServicesSection() {
  const activeKagazId = useSyncExternalStore(
    subscribeToStorage,
    getActiveKagazIdSnapshot,
    getServerSnapshot,
  );

  const features = [
    {
      title: "Create CV & Biodata",
      tagline: "Build a clean resume or biodata even without logging in.",
      points: [
        "Instant live A4 CV preview",
        "Switch layouts & export PDF",
        "Sync data with SutraNet ID",
      ],
      icon: FileText,
      link: "/create-cv",
      cta: "Create CV",
    },
    {
      title: "Download ID Card",
      tagline: "Get your smart digital & printable card with live QR.",
      points: [
        "Instant QR scan verification",
        "Clean black & white identity card",
        "Share or print anytime",
      ],
      icon: IdCard,
      link: "/dashboard",
      cta: "Download Card",
    },
    {
      title: "Verified Status & Profile",
      tagline:
        "Check verification status and open your public SutraNet record.",
      points: [
        "View live /p/[id] verified record",
        "Check person or company status",
        "Shareable identity & QR profile",
      ],
      icon: ShieldCheck,
      link: activeKagazId ? `/p/${encodeURIComponent(activeKagazId)}` : "/auth",
      cta: "Check Verified Profile",
    },

  ];

  return (
    <section className="relative bg-[#FDFCFB] text-[#141414] px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-neutral-200/80">
      <div className="mx-auto w-full">
        {/* মিনিমাল হেডার */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200/80 pb-6 sm:pb-8 mb-8 sm:mb-12 gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
              Ecosystem
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-light tracking-tight text-neutral-950 mt-1">
              What you can do here.
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">
            5 Core Actions // 1 Hub
          </p>
        </div>

        {/* ৫টি রেসপন্সিভ কার্ড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="h-full"
              >
                <Link
                  href={item.link}
                  className="group flex h-full flex-col justify-between border border-neutral-200 bg-white p-5 sm:p-6 rounded-xs transition-all duration-300 hover:border-neutral-950 hover:shadow-md cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-end mb-5 sm:mb-7">
                      <Icon className="h-4 w-4 text-neutral-500 group-hover:text-neutral-950 transition-colors shrink-0" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif text-neutral-950 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-5 font-light leading-relaxed">
                      {item.tagline}
                    </p>

                    {/* টু-দ্য-পয়েন্ট বুলেটস */}
                    <ul className="space-y-2 mb-6 border-t border-neutral-100 pt-4">
                      {item.points.map((pt, i) => (
                        <li
                          key={i}
                          className="text-xs text-neutral-600 flex items-center gap-2"
                        >
                          <span className="h-1 w-1 bg-neutral-400 rounded-full shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="inline-flex items-center justify-between border-t border-neutral-100 pt-4 text-xs font-mono uppercase tracking-wider text-neutral-950 group-hover:underline">
                    <span>{item.cta}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
