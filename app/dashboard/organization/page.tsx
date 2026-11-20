// app/dashboard/organization/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { toPng } from "html-to-image";
import CompanySmartCard, { CompanyCardData } from "./CompanySmartCard";
import { getCompanyProfile } from "@/lib/organizationService";
import CompanyDetailsSection from "./CompanyDetailsSection";
import CompanyPrivacyModal from "./components/CompanyPrivacyModal";

export default function OrganizationDashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [kagazId, setKagazId] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardData, setCardData] = useState<CompanyCardData>({
    name: "Organization Name",
    logoUrl: "",
    category: "Business Category",
    tagline: "Commercial Hub",
    phone: "Not Set",
    website: "",
    address: "Kolkata, WB",
    estYear: "2025",
    isVerified: false,
  });

  useEffect(() => {
    async function verifyAndLoadOrg() {
      const activeId = localStorage.getItem("kagaz_active_id");

      if (!activeId) {
        router.replace("/auth");
        return;
      }

      const { data, error } = await getCompanyProfile(activeId);

      if (error || !data) {
        router.replace("/dashboard/individual");
        return;
      }

      setKagazId(data.kagaz_id || activeId);

      const primaryBranch = data.branches?.[0];
      const formattedAddress =
        primaryBranch?.city && primaryBranch?.state
          ? `${primaryBranch.city}, ${primaryBranch.state}`
          : "Kolkata, WB";

      setCardData({
        name: data.company_name || "Organization Name",
        logoUrl: data.logo_url || "",
        category: data.business_category || data.industry || "Enterprise",
        tagline: data.short_description || "Commercial Hub",
        phone: data.contacts?.[0]?.phone || "Not Set",
        website: data.website || "",
        address: formattedAddress,
        estYear: data.est_year || "2025",
        isVerified: data.is_verified || false,
      });

      setCheckingAuth(false);
    }

    verifyAndLoadOrg();

    // রিয়েলটাইম কার্ড আপডেট লিসেনার
    const handleOrgUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const updated = customEvent.detail;
        const primaryBranch = updated.branches?.[0];
        const formattedAddress =
          primaryBranch?.city && primaryBranch?.state
            ? `${primaryBranch.city}, ${primaryBranch.state}`
            : undefined;

        setCardData((prev) => ({
          ...prev,
          name: updated.company_name || prev.name,
          logoUrl: updated.logo_url ?? prev.logoUrl,
          category:
            updated.business_category || updated.industry || prev.category,
          tagline: updated.short_description || prev.tagline,
          website: updated.website ?? prev.website,
          estYear: updated.est_year || prev.estYear,
          ...(updated.contacts?.[0]?.phone && {
            phone: updated.contacts[0].phone,
          }),
          ...(formattedAddress && { address: formattedAddress }),
        }));
      }
    };

    window.addEventListener("company-updated", handleOrgUpdate);
    return () => window.removeEventListener("company-updated", handleOrgUpdate);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-2 text-neutral-500 font-mono text-xs">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
        <span>Verifying workspace access...</span>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (!kagazId) return;
    navigator.clipboard.writeText(`${window.location.origin}/p/${kagazId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // ⚡ এক ক্লিকেই কোম্পানির সামনের ও পেছনের দুটো পিঠ আলাদা HD ইমেজ হিসেবে ডাউনলোড হবে
  const handleDownloadCard = async () => {
    const frontEl = document.getElementById("org-card-front");
    const backEl = document.getElementById("org-card-back");

    if (!frontEl || !backEl) return;

    try {
      setDownloading(true);

      // ১. সামনের পিঠ (Front Side) ডাউনলোড
      const frontDataUrl = await toPng(frontEl, {
        cacheBust: true,
        pixelRatio: 3,
        width: 440,
        height: 265,
        skipFonts: true,
        // যদি গুগল ছবি ব্লক করে, তবুও কার্ড ডাউনলোড আটকাবেনা
        imagePlaceholder:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        style: {
          transform: "none",
          width: "440px",
          height: "265px",
        },
      });

      const frontLink = document.createElement("a");
      frontLink.download = `CompanyCard-${kagazId || "org"}-Front.png`;
      frontLink.href = frontDataUrl;
      frontLink.click();

      // সামান্য বিরতি দিয়ে পেছনের পিঠ ডাউনলোড (যাতে ব্রাউজার ডাউনলোড ব্লক না করে)
      await new Promise((resolve) => setTimeout(resolve, 400));

      // ২. পেছনের পিঠ (Back Side) ডাউনলোড
      const backDataUrl = await toPng(backEl, {
        pixelRatio: 3,
        width: 440,
        height: 265,
        style: {
          transform: "none",
          width: "440px",
          height: "265px",
        },
      });

      const backLink = document.createElement("a");
      backLink.download = `CompanyCard-${kagazId || "org"}-Back.png`;
      backLink.href = backDataUrl;
      backLink.click();
    } catch (err) {
      console.error("Failed to download company card:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* ১. উপরের আইডেন্টিটি ও কোম্পানির স্মার্ট কার্ড সেকশন */}
        <div className="border border-neutral-200/80 bg-white p-4 sm:p-8 shadow-xs rounded-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-mono uppercase tracking-wider rounded-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Enterprise Digital Identity</span>
              </div>

              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xs border border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden shrink-0">
                  {cardData.logoUrl ? (
                    <img
                      src={cardData.logoUrl}
                      alt={cardData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-neutral-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-neutral-950 truncate">
                    {cardData.name}
                  </h1>
                  <p className="text-[11px] sm:text-xs font-mono text-neutral-500 mt-0.5 truncate">
                    ID: {kagazId || "Generating..."} • Est. {cardData.estYear}
                  </p>
                </div>
              </div>

              <p className="text-xs font-sans text-neutral-600 leading-relaxed">
                Manage your organization&apos;s verified identity, branches,
                products & services, team members, and official credentials in
                one unified hub.
              </p>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center w-full">
              <div ref={cardRef} className="p-1 w-full flex justify-center">
                <CompanySmartCard kagazId={kagazId} data={cardData} />
              </div>

              {/* 📱 রেসপন্সিভ অ্যাকশন বাটন বার */}
              <div className="w-full max-w-[360px] sm:max-w-[440px] grid grid-cols-2 sm:flex sm:items-center gap-2 mt-4">
                {/* ১. Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-neutral-300 bg-white py-2 px-3 text-[11px] font-mono uppercase text-neutral-800 hover:bg-neutral-50 cursor-pointer rounded-xs transition-colors"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                  )}
                  <span className="truncate">
                    {copied ? "Copied" : "Copy Link"}
                  </span>
                </button>

                {/* ২. Download Card */}
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-neutral-900 bg-neutral-900 py-2 px-3 text-[11px] font-mono uppercase text-white hover:bg-neutral-800 cursor-pointer rounded-xs transition-colors"
                >
                  {downloading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                  ) : (
                    <Download className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">
                    {downloading ? "Saving..." : "Download"}
                  </span>
                </button>

                {/* ৩. Privacy Settings & Public Page */}
                <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                  <Link
                    href={`/p/${kagazId}`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-emerald-600 bg-emerald-50/70 hover:bg-emerald-600 text-emerald-900 hover:text-white py-2 px-3 text-[11px] font-mono font-bold uppercase rounded-xs transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Public Page</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ২. নিচের কোম্পানি ডিটেইলস কন্টেইনার */}
        <CompanyDetailsSection />
      </div>
      <CompanyPrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        companyId={kagazId}
      />
    </div>
  );
}
