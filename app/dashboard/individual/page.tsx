// app/dashboard/individual/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Loader2 } from "lucide-react";
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
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-2 text-neutral-500 font-mono text-xs">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
        <span>Verifying identity workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-950">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* ব্যানার হেডার */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <div>
            <span className="text-sm font-mono uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-slate-500" />
              Verified Primary Identity
            </span>
            <h1 className="text-3xl font-serif font-normal text-neutral-950 mt-1">
              Welcome{userName ? `, ${userName}` : ""}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-neutral-500 uppercase">
              Active Network
            </span>
          </div>
        </div>

        {/* মাঝখানে SutraNet ID */}
        <IdentityBadge />

        {/* ওপরের গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <PrimaryIdentity />
          </div>

          <div className="lg:col-span-6">
            <CardSection />
          </div>
        </div>

        {/* নিচের প্রোফাইল ডিটেইলস */}
        <div className="pt-2">
          <ProfileDetailsSection />
        </div>
      </main>
    </div>
  );
}
