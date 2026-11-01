// components/HowItWorks.tsx
"use client";

import { motion } from "motion/react";
import { Sliders, QrCode, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Draft Your Profile",
    subtitle: "Personal or Enterprise",
    desc: "Choose between an individual job resume, family biodata, or a company business card. Input your background, services, and social channels with zero friction.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Toggle Visibility",
    subtitle: "Absolute Data Control",
    desc: "Decide precisely what stays visible on paper and what reveals online. Switch off contact numbers, family details, or private links with a single click.",
    icon: Sliders,
  },
  {
    step: "03",
    title: "Print & Dynamic QR",
    subtitle: "Paper Meets Live Web",
    desc: "Download a publication-grade PDF with your unique QR code embedded. Anyone scanning your physical paper lands instantly on your interactive live profile.",
    icon: QrCode,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#FDFCFB] text-[#141414] px-6 py-24 sm:py-32 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl">
        
        {/* সেকশন হেডার */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/80 pb-12 mb-16 gap-6">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-mono font-medium">
              The Architecture
            </span>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight font-serif text-neutral-950">
              How KagazCV <span className="italic font-normal">functions.</span>
            </h2>
          </div>
          <p className="text-sm text-neutral-500 max-w-xs font-light leading-relaxed">
            Three measured steps from blank paper to an interconnected digital entity.
          </p>
        </div>

        {/* ৩টি কার্ডের গ্রিড (Minimal Editorial Bordered Box) */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between border border-neutral-200 bg-white p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-neutral-900"
              >
                {/* কার্ডের শীর্ষ: নম্বর ও আইকন */}
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-6 mb-8">
                    <span className="text-2xl font-serif text-neutral-300 transition-colors duration-300 group-hover:text-neutral-950">
                      {item.step}
                    </span>
                    <div className="h-10 w-10 border border-neutral-200 flex items-center justify-center bg-neutral-50 transition-colors duration-300 group-hover:bg-neutral-950 group-hover:border-neutral-950 group-hover:text-white">
                      <Icon className="h-4 w-4 stroke-[1.5]" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl font-medium tracking-tight text-neutral-950 mt-1 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* কার্ডের ফুটার দাগ */}
                <div className="pt-8 mt-8 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>PHASE {item.step}</span>
                  <span className="h-1 w-1 rounded-full bg-neutral-300 group-hover:bg-neutral-950 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* বটম ব্যানার কল-আউট */}
        <div className="mt-20 border border-neutral-200 bg-neutral-100/50 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-serif text-neutral-950">Ready to author your profile?</h4>
            <p className="text-xs text-neutral-500 font-light">It requires less than four minutes to configure and generate.</p>
          </div>
          <Link
            href="/dashboard/builder"
            className="inline-flex items-center gap-2 bg-neutral-950 text-white px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors"
          >
            <span>Start Direct Setup</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}