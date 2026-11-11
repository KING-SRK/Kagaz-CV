// components/ServicesSection.tsx
"use client";

import { motion } from "motion/react";
import { User, Building2, Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "01",
    title: "Personal CV & Bio",
    tagline: "Resumes, family biodatas, and instant PDF.",
    points: ["Job-ready templates", "Family biodata mode", "Dynamic paper QR"],
    icon: User,
    link: "/dashboard/builder?type=individual",
    cta: "Build CV",
  },
  {
    id: "02",
    title: "Organization Hub",
    tagline: "Digital identity for shops, agencies, and teams.",
    points: ["Service catalogue", "All social links in one", "Counter QR poster"],
    icon: Building2,
    link: "/dashboard/builder?type=organization",
    cta: "Build Hub",
  },
  {
    id: "03",
    title: "Public Directory",
    tagline: "Search local talent and verified businesses.",
    points: ["Skill & category search", "Direct WhatsApp contact", "Zero middlemen"],
    icon: Search,
    link: "/explore",
    cta: "Explore",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative bg-[#FDFCFB] text-[#141414] px-6 py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl">
        
        {/* মিনিমাল হেডার: বড় টেক্সট বাদ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200/80 pb-8 mb-12 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
              Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-neutral-950 mt-1">
              What you can create.
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            3 Systems // 1 Platform
          </p>
        </div>

        {/* ৩টি স্লিক কার্ড */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col justify-between border border-neutral-200 bg-white p-7 transition-all duration-300 hover:border-neutral-950"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono text-neutral-300 group-hover:text-neutral-950 transition-colors">
                      /{item.id}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-500 group-hover:text-neutral-950 transition-colors" />
                  </div>

                  <h3 className="text-xl font-serif text-neutral-950 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6 font-light">
                    {item.tagline}
                  </p>

                  {/* শুধু টু-দ্য-পয়েন্ট বুলেটস */}
                  <ul className="space-y-2 mb-8 border-t border-neutral-100 pt-4">
                    {item.points.map((pt, i) => (
                      <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                        <span className="h-1 w-1 bg-neutral-400 rounded-full" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={item.link}
                  className="inline-flex items-center justify-between border-t border-neutral-100 pt-4 text-xs font-mono uppercase tracking-wider text-neutral-950 group-hover:underline"
                >
                  <span>{item.cta}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}