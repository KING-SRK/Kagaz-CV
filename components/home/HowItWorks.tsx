// components/HowItWorks.tsx
"use client";

import { motion } from "motion/react";
import { Sliders, QrCode, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    subtitle: "Person or Business",
    desc: "Sign up as an individual or a business. Add your skills, work experience, services, and projects—or start building your CV right away.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Control Your Privacy",
    subtitle: "You Decide What Shows",
    desc: "Choose what appears on your printed CV and public profile. Hide or show your phone number, education, or any section with one click.",
    icon: Sliders,
  },
  {
    step: "03",
    title: "Download PDF & Share QR",
    subtitle: "Paper Meets Live Web",
    desc: "Download a clean A4 PDF resume with your SutraNet ID and QR code. Anyone who scans it can view and verify your live profile.",
    icon: QrCode,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-[#FDFCFB] text-[#141414] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 border-t border-neutral-200/80"
    >
      <div className="mx-auto w-full">
        {/* সেকশন হেডার */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/80 pb-8 sm:pb-12 mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4 max-w-xl">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-400 font-mono font-medium">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight font-serif text-neutral-950">
              How SutraNet <span className="italic font-normal">works.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xs font-light leading-relaxed">
            Three measured steps from blank paper to an interconnected digital
            identity.
          </p>
        </div>

        {/* ৩টি কার্ডের গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col justify-between border border-neutral-200 bg-white p-6 sm:p-8 lg:p-10 rounded-xs shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-neutral-900"
              >
                {/* কার্ডের শীর্ষ: নম্বর ও আইকন */}
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-6 sm:mb-8">
                    <span className="text-xl sm:text-2xl font-serif text-neutral-300 transition-colors duration-300 group-hover:text-neutral-950">
                      {item.step}
                    </span>
                    <div className="h-9 w-9 sm:h-10 sm:w-10 border border-neutral-200 flex items-center justify-center bg-neutral-50 transition-colors duration-300 group-hover:bg-neutral-950 group-hover:border-neutral-950 group-hover:text-white shrink-0">
                      <Icon className="h-4 w-4 stroke-[1.5]" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                    {item.subtitle}
                  </span>
                  <h3 className="text-lg sm:text-xl font-medium tracking-tight text-neutral-950 mt-1 mb-3 sm:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* কার্ডের ফুটার দাগ */}
                <div className="pt-6 mt-6 sm:pt-8 sm:mt-8 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>PHASE {item.step}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 group-hover:bg-neutral-950 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* বটম ব্যানার কল-আউট */}
        <div className="mt-12 sm:mt-20 border border-neutral-200 bg-neutral-100/60 p-6 sm:p-10 lg:p-12 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-serif text-neutral-950">
              Ready to build your verified digital identity?
            </h4>
            <p className="text-xs text-neutral-500 font-light">
              Create your free PDF resume immediately or claim your permanent
              SutraNet ID.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/create-cv"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-950 text-white px-5 sm:px-6 py-3 text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 transition-colors"
            >
              <span>Create Free CV</span>
              <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            </Link>
            <Link
              href="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-neutral-300 text-neutral-900 px-5 sm:px-6 py-3 text-xs font-mono uppercase tracking-wider rounded-xs hover:border-neutral-950 transition-colors"
            >
              <span>Claim SutraNet ID</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
