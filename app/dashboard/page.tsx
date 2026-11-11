// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getIndividualProfile } from "@/lib/individualService";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkRoleAndRedirect() {
      const activeId = localStorage.getItem("kagaz_active_id");

      if (!activeId) {
        router.replace("/auth");
        return;
      }

      const { data } = await getIndividualProfile(activeId);

      if (data?.role === "organization") {
        router.replace("/dashboard/organization");
      } else {
        router.replace("/dashboard/individual");
      }
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
