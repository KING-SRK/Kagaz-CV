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

      // ৩. কোনোটিই না পাওয়া গেলে
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
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-neutral-900" />
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Verifying SutraNet Identity...
        </p>
      </div>
    );
  }

  if (!entityType || (!individualData && !companyData)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-neutral-300 p-8 text-center rounded-sm shadow-sm space-y-4">
          <div className="h-12 w-12 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6 text-neutral-700" />
          </div>
          <h1 className="text-lg font-serif font-bold text-neutral-950">
            Identity Not Found
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed">
            No verified SutraNet record matches ID{" "}
            <span className="font-mono font-bold text-neutral-900">
              {kagazId}
            </span>
            . Please check the QR code or URL and try again.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to SutraNet</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 bg-white px-3 py-1.5 rounded-xs border border-neutral-300 shadow-2xs">
            ● Official Verified Public Record
          </span>
        </div>

        {entityType === "individual" && individualData ? (
          <PublicIndividualView profile={individualData} />
        ) : companyData ? (
          <PublicCompanyView company={companyData} openJobs={companyJobs} />
        ) : null}
      </main>

      <footer className="border-t border-neutral-200 bg-white py-5 mt-12 text-center">
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
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider rounded-full border border-neutral-700 shadow-2xl hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
          <span>Customize Visibility</span>
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
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-neutral-900" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Loading Identity...
          </p>
        </div>
      }
    >
      <PublicIdentityContent />
    </Suspense>
  );
}
