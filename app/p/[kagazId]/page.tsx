// app/p/[kagazId]/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ShieldAlert,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import PublicIndividualView, {
  PublicProfileData,
} from "./components/PublicIndividualView";
import PublicCompanyView, {
  PublicCompanyData,
  PublicJobItem,
} from "./components/PublicCompanyView";
import IndividualPrivacyModal from "@/app/dashboard/individual/components/IndividualPrivacyModal";
import CompanyPrivacyModal from "@/app/dashboard/organization/components/CompanyPrivacyModal";

function PublicIdentityContent() {
  const params = useParams();
  const kagazId =
    typeof params?.kagazId === "string"
      ? decodeURIComponent(params.kagazId)
      : "";

  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState<
    "individual" | "organization" | null
  >(null);
  const [individualData, setIndividualData] =
    useState<PublicProfileData | null>(null);
  const [companyData, setCompanyData] = useState<PublicCompanyData | null>(
    null,
  );
  const [companyJobs, setCompanyJobs] = useState<PublicJobItem[]>([]);

  const [isOwner, setIsOwner] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!kagazId) return;

    let isMounted = true;

    async function loadPublicEntity() {
      const activeId =
        typeof window !== "undefined"
          ? localStorage.getItem("kagaz_active_id")
          : null;

      // ১. প্রথমে Individual (profiles টেবিল + profile_education) চেক করা হচ্ছে
      const { data: indData } = await supabase
        .from("profiles")
        .select("*, profile_education(*)")
        .eq("kagaz_id", kagazId)
        .maybeSingle();

      if (!isMounted) return;

      if (indData) {
        setEntityType("individual");
        setIndividualData(indData as PublicProfileData);
        setIsOwner(
          Boolean(
            activeId &&
            (activeId === indData.id || activeId === indData.kagaz_id),
          ),
        );
        setLoading(false);
        return;
      }

      // ২. না পেলে Organization (company_profiles টেবিল) চেক করা হচ্ছে
      const { data: compData } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("kagaz_id", kagazId)
        .maybeSingle();

      if (!isMounted) return;

      if (compData) {
        const { data: jobsData } = await supabase
          .from("company_jobs")
          .select("*")
          .eq("company_id", compData.id)
          .eq("status", "Open")
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        setEntityType("organization");
        setCompanyData(compData as PublicCompanyData);
        setCompanyJobs((jobsData as PublicJobItem[]) || []);
        setIsOwner(
          Boolean(
            activeId &&
            (activeId === compData.id || activeId === compData.kagaz_id),
          ),
        );
        setLoading(false);
        return;
      }

      // ৩. কোনোটিই না পাওয়া গেলে
      setEntityType(null);
      setIsOwner(false);
      setLoading(false);
    }

    loadPublicEntity();

    return () => {
      isMounted = false;
    };
  }, [kagazId, refreshTrigger]);

  const handleClosePrivacyModal = () => {
    setIsPrivacyOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-neutral-50 flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="h-7 w-7 animate-spin text-neutral-900" />
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 text-center">
          Verifying SutraNet Identity...
        </p>
      </div>
    );
  }

  if (!entityType || (!individualData && !companyData)) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-neutral-50 flex items-center justify-center p-3 sm:p-4">
        <div className="max-w-md w-full bg-white border border-neutral-300 p-6 sm:p-8 text-center rounded-sm shadow-sm space-y-4">
          <div className="h-12 w-12 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6 text-neutral-700" />
          </div>
          <h1 className="text-base sm:text-lg font-serif font-bold text-neutral-950">
            Identity Not Found
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed wrap-break-word">
            No verified SutraNet record matches ID{" "}
            <span className="font-mono font-bold text-neutral-900">
              {kagazId}
            </span>
            . Check your SutraNet ID, QR code, or sign in to view your verified
            status and saved profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-neutral-950 text-white text-xs font-mono uppercase rounded-xs hover:bg-neutral-800 transition-colors"
            >
              <span>Check Status / Sign In</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-neutral-300 bg-white text-neutral-900 text-xs font-mono uppercase rounded-xs hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to SutraNet</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-100 text-neutral-900 flex flex-col justify-between overflow-x-hidden">
      <main className="max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-600 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xs border border-neutral-300 shadow-2xs">
            ● Official Verified Public Record
          </span>
        </div>

        {entityType === "individual" && individualData ? (
          <PublicIndividualView profile={individualData} />
        ) : companyData ? (
          <PublicCompanyView company={companyData} openJobs={companyJobs} />
        ) : null}
      </main>

      <footer
        className={`border-t border-neutral-200 bg-white py-5 mt-8 sm:mt-12 text-center px-4 ${
          isOwner ? "pb-20 sm:pb-5" : ""
        }`}
      >
        <p className="text-[11px] font-mono text-neutral-500">
          Verified Digital Identity Powered by{" "}
          <span className="font-bold text-neutral-900">SutraNet</span>
        </p>
      </footer>

      {/* Floating Customize Visibility Button (Only for Owner) */}
      {isOwner && (
        <button
          type="button"
          onClick={() => setIsPrivacyOpen(true)}
          className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-neutral-950 text-white text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-full border border-neutral-700 shadow-xl hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 shrink-0" />
          <span className="sm:hidden">Visibility</span>
          <span className="hidden sm:inline">Customize Visibility</span>
        </button>
      )}

      {isOwner && entityType === "individual" && (
        <IndividualPrivacyModal
          isOpen={isPrivacyOpen}
          onClose={handleClosePrivacyModal}
          profileId={kagazId}
        />
      )}

      {isOwner && entityType === "organization" && (
        <CompanyPrivacyModal
          isOpen={isPrivacyOpen}
          onClose={handleClosePrivacyModal}
          companyId={kagazId}
        />
      )}
    </div>
  );
}

export default function PublicIdentityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-64px)] bg-neutral-50 flex flex-col items-center justify-center gap-3 px-4">
          <Loader2 className="h-7 w-7 animate-spin text-neutral-900" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 text-center">
            Loading Identity...
          </p>
        </div>
      }
    >
      <PublicIdentityContent />
    </Suspense>
  );
}
