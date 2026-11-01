// app/onboarding/page.tsx
"use client";

import { motion } from "motion/react";
import { User, Building2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const handleSelectRole = (role: "individual" | "organization") => {
    // ড্যাশবোর্ডের বিল্ডার ফর্মে রোল পাঠিয়ে দেওয়া
    router.push(`/dashboard/builder?type=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#141414] flex items-center justify-center px-6 py-20">
      <div className="max-w-3xl w-full">
        {/* হেডার */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
            Initial Setup
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-neutral-950">
            Define your entity type.
          </h1>
          <p className="text-sm text-neutral-500 font-light max-w-md mx-auto">
            Choose how you wish to establish your presence on KagazCV.
          </p>
        </div>

        {/* দুটি বড় ইন্টারেক্টিভ সিলেকশন কার্ড */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* ১. Individual Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelectRole("individual")}
            className="group cursor-pointer border border-neutral-200 bg-white p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-neutral-950 shadow-[0_4px_25px_rgba(0,0,0,0.02)]"
          >
            <div>
              <div className="h-12 w-12 border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-900 mb-8 transition-colors group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950">
                <User className="h-5 w-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                For Persons
              </span>
              <h3 className="text-2xl font-serif text-neutral-950 mt-1 mb-3">
                Individual
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Create modern job resumes, family biodatas, personal contact
                hubs, and dynamic printable QR profiles.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-100 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-900 group-hover:underline">
              <span>Select Individual</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </motion.div>

          {/* ২. Organization Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelectRole("organization")}
            className="group cursor-pointer border border-neutral-200 bg-white p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-neutral-950 shadow-[0_4px_25px_rgba(0,0,0,0.02)]"
          >
            <div>
              <div className="h-12 w-12 border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-900 mb-8 transition-colors group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950">
                <Building2 className="h-5 w-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                For Teams & Enterprises
              </span>
              <h3 className="text-2xl font-serif text-neutral-950 mt-1 mb-3">
                Organization
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Establish an agency hub, showcase retail/digital services,
                unified social media links, and desk QR posters.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-100 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-900 group-hover:underline">
              <span>Select Organization</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
