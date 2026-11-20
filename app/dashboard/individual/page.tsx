// app/dashboard/individual/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Fingerprint, Loader2, FileText, ArrowRight } from "lucide-react";
import PrimaryIdentity from "./PrimaryIdentity";
import CardSection from "./CardSection";
import ProfileDetailsSection from "./ProfileDetailsSection";
import IdentityBadge from "./IdentityBadge";
import { getIndividualProfile } from "@/lib/individualService";

export default function IndividualDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    async function verifyAndFetchUser() {
      const activeId = localStorage.getItem("kagaz_active_id");
      const savedRole = localStorage.getItem("kagaz_role");

      // ১. লগইন না থাকলে /auth পেজে পাঠিয়ে দেবে
      if (!activeId) {
        router.replace("/auth");
        return;
      }

      // ২. লোকাল স্টোরেজে রোল 'organization' থাকলে সরাসরি Organization ড্যাশবোর্ডে পাঠাবে!
      if (savedRole === "organization") {
        router.replace("/dashboard/organization");
        return;
      }

      const { data } = await getIndividualProfile(activeId);

      // ৩. যদি profiles টেবিলে না পাওয়া যায় বা রোল organization হয়
      if (!data) {
        router.replace("/auth");
        return;
      }

      if (data.role === "organization") {
        router.replace("/dashboard/organization");
        return;
      }

      if (data.full_name) {
        setUserName(data.full_name);
      }

      // ৪. সব ঠিক থাকলে ড্যাশবোর্ড দেখাবে
      setCheckingAuth(false);
    }

    verifyAndFetchUser();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-2 text-neutral-500 font-mono text-xs px-4 text-center">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
        <span>Verifying identity workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-950 overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* ব্যানার হেডার */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4 sm:pb-5">
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5 sm:gap-2">
              <Fingerprint className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 shrink-0" />
              <span className="truncate">Verified Primary Identity</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-950 mt-1 truncate">
              Welcome{userName ? `, ${userName}` : ""}
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-neutral-100/80 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-xs border border-neutral-200/80 sm:border-0 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-mono text-neutral-600 sm:text-neutral-500 uppercase">
              Active Network
            </span>
          </div>
        </div>

        {/* মাঝখানে SutraNet ID */}
        <IdentityBadge />

        {/* ওপরের গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-6 w-full">
            <PrimaryIdentity />
          </div>

          <div className="lg:col-span-6 w-full">
            <CardSection />
          </div>
        </div>

        {/* নিচের প্রোফাইল ডিটেইলস */}
        <div className="pt-1 sm:pt-2">
          <ProfileDetailsSection />
        </div>

        {/* নিচের Create / Export CV কল-টু-অ্যাকশন কার্ড */}
        <div className="border border-neutral-300 bg-white p-5 sm:p-6 rounded-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xs bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-950">
                Ready to generate your ATS-Friendly CV?
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Your SutraNet profile details auto-sync into clean executive
                templates—customize sections and export PDF in seconds.
              </p>
            </div>
          </div>

          <Link
            href="/create-cv"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 transition-colors shrink-0"
          >
            <span>Create CV</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
          </Link>
        </div>
      </main>
    </div>
  );
}
