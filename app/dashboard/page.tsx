// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getIndividualProfile } from "@/lib/individualService";
import { getCompanyProfile } from "@/lib/organizationService";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkRoleAndRedirect() {
      const activeId = localStorage.getItem("kagaz_active_id");
      const savedRole = localStorage.getItem("kagaz_role");

      if (!activeId) {
        router.replace("/auth");
        return;
      }

      // ১. যদি লোকাল স্টোরেজে স্পষ্টভাবে 'individual' লেখা থাকে
      if (savedRole === "individual") {
        const { data: indData } = await getIndividualProfile(activeId);
        if (indData) {
          router.replace("/dashboard/individual");
          return;
        }
      }

      // ২. যদি লোকাল স্টোরেজে স্পষ্টভাবে 'organization' লেখা থাকে
      if (savedRole === "organization") {
        const { data: orgData } = await getCompanyProfile(activeId);
        if (orgData) {
          router.replace("/dashboard/organization");
          return;
        }
      }

      // ৩. ফলব্যাক: যদি savedRole না থাকে, তবে ডেটাবেজ থেকে খুঁজে বের করা
      const { data: indData } = await getIndividualProfile(activeId);
      if (indData) {
        localStorage.setItem("kagaz_role", "individual");
        router.replace("/dashboard/individual");
        return;
      }

      const { data: orgData } = await getCompanyProfile(activeId);
      if (orgData) {
        localStorage.setItem("kagaz_role", "organization");
        router.replace("/dashboard/organization");
        return;
      }

      // কোথাও না পাওয়া গেলে লগআউট করে /auth-এ পাঠানো
      localStorage.removeItem("kagaz_active_id");
      localStorage.removeItem("kagaz_card_id");
      localStorage.removeItem("kagaz_role");
      router.replace("/auth");
    }

    checkRoleAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-3 text-neutral-500 font-mono text-xs">
      <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
      <span>Redirecting to your dashboard workspace...</span>
    </div>
  );
}
