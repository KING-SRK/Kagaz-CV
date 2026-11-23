// components/ServicesSection.tsx
"use client";

import { motion } from "motion/react";
import { User, Building2, Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "01",
    title: "Personal CV & Digital ID",
    tagline: "Create a job-ready resume, verified profile, and free PDF.",
    points: [
      "Instant A4 PDF CV builder",
      "Show or hide any CV section",
      "Live QR code for verification",
    ],
    icon: User,
    link: "/create-cv",
    cta: "Build Free CV",
  },
  {
    id: "02",
    title: "Enterprise & Business Hub",
    tagline: "Official online profile for companies, shops, and teams.",
    points: [
      "List your services & products",
      "Post open jobs & hire talent",
      "Verified Enterprise ID badge",
    ],
    icon: Building2,
    link: "/auth",
    cta: "Create Business Page",
  },
  {
    id: "03",
    title: "Public Search Directory",
    tagline: "Find verified professionals and trusted local businesses.",
    points: [
      "Filter by skill, sector & city",
      "Check any SutraNet ID online",
      "Safe & privacy-controlled profiles",
    ],
    icon: Search,
    link: "/find-talent",
    cta: "Explore Directory",
  },
];

export default function ServicesSection() {
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
              What you can create.
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">
            3 Systems // 1 Platform
          </p>
        </div>

        {/* ৩টি রেসপন্সিভ কার্ড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col justify-between border border-neutral-200 bg-white p-5 sm:p-7 rounded-xs transition-all duration-300 hover:border-neutral-950 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <span className="text-xs font-mono text-neutral-300 group-hover:text-neutral-950 transition-colors">
                      /{item.id}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-500 group-hover:text-neutral-950 transition-colors shrink-0" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif text-neutral-950 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-5 sm:mb-6 font-light leading-relaxed">
                    {item.tagline}
                  </p>

                  {/* টু-দ্য-পয়েন্ট বুলেটস */}
                  <ul className="space-y-2 mb-6 sm:mb-8 border-t border-neutral-100 pt-4">
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

                <Link
                  href={item.link}
                  className="inline-flex items-center justify-between border-t border-neutral-100 pt-4 text-xs font-mono uppercase tracking-wider text-neutral-950 group-hover:underline"
                >
                  <span>{item.cta}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
