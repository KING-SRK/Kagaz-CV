// app/dashboard/organization/components/CompanyPrivacyModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface CompanyVisibility {
  about: boolean;
  website: boolean;
  contacts: boolean;
  branches: boolean;
  offerings: boolean;
  operations: boolean;
  team_members: boolean;
  portfolio: boolean;
  achievements: boolean;
  social_links: boolean;
  open_jobs: boolean;
  legal_info: boolean;
}

export const DEFAULT_COMPANY_VISIBILITY: CompanyVisibility = {
  about: true,
  website: true,
  contacts: true,
  branches: true,
  offerings: true,
  operations: true,
  team_members: true,
  portfolio: true,
  achievements: true,
  social_links: true,
  open_jobs: true,
  legal_info: false,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

const COMPANY_VISIBILITY_GROUPS: {
  groupTitle: string;
  items: { key: keyof CompanyVisibility; label: string; desc: string }[];
}[] = [
  {
    groupTitle: "Brand & Overview",
    items: [
      {
        key: "about",
        label: "About & Overview",
        desc: "Short/detailed description, Est. year, business type & size",
      },
      {
        key: "website",
        label: "Official Website",
        desc: "Direct link to your company website",
      },
      {
        key: "social_links",
        label: "Social Media Profiles",
        desc: "LinkedIn, Instagram, YouTube, Facebook links",
      },
    ],
  },
  {
    groupTitle: "Contact & Operations",
    items: [
      {
        key: "contacts",
        label: "Department Contacts",
        desc: "Only contacts marked as 'Public' in your Contacts tab",
      },
      {
        key: "branches",
        label: "Branches & Locations",
        desc: "Head office, store addresses & Google Maps links",
      },
      {
        key: "operations",
        label: "Business Hours & Operations",
        desc: "Open status, timings, delivery & payment methods",
      },
    ],
  },
  {
    groupTitle: "Catalog, Work & Hiring",
    items: [
      {
        key: "offerings",
        label: "Products & Services",
        desc: "Your service/product catalog & pricing",
      },
      {
        key: "portfolio",
        label: "Project Portfolio",
        desc: "Completed projects & case studies",
      },
      {
        key: "achievements",
        label: "Awards & Certifications",
        desc: "Company milestones & recognitions",
      },
      {
        key: "open_jobs",
        label: "Active Job Openings",
        desc: "Currently open positions from your Jobs board",
      },
    ],
  },
  {
    groupTitle: "Team & Compliance",
    items: [
      {
        key: "team_members",
        label: "Verified Team Members",
        desc: "Only members who accepted consent",
      },
      {
        key: "legal_info",
        label: "Business Registrations",
        desc: "GSTIN (if enabled), Udyam, Trade License, FSSAI (PAN stays private)",
      },
    ],
  },
];

// কোম্পানির কোন কোন সেকশনে আসল ডাটা আছে তা চেক করার ফাংশন
function computeFilledCompanyFields(
  company: Record<string, unknown>,
  hasJobsInTable: boolean,
): Record<keyof CompanyVisibility, boolean> {
  const hasText = (v: unknown) => typeof v === "string" && v.trim().length > 0;

  const hasValidArray = (arr: unknown, keysToCheck: string[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    return arr.some(
      (item) =>
        item &&
        typeof item === "object" &&
        keysToCheck.some((k) => hasText((item as Record<string, unknown>)[k])),
    );
  };

  const ops = company.operations as Record<string, unknown> | undefined;
  const hasOperations = Boolean(
    ops &&
    (hasText(ops.openingDays) ||
      hasText(ops.openingTime) ||
      hasText(ops.closingTime) ||
      hasText(ops.opening_time) ||
      hasText(ops.closing_time) ||
      hasText(ops.working_days) ||
      (Array.isArray(ops.paymentMethods) && ops.paymentMethods.length > 0) ||
      (Array.isArray(ops.payment_methods) && ops.payment_methods.length > 0)),
  );

  const legal = company.legal_info as Record<string, unknown> | undefined;
  const hasLegal = Boolean(
    legal &&
    (hasText(legal.gstin) ||
      hasText(legal.udyam) ||
      hasText(legal.trade_license) ||
      hasText(legal.fssai) ||
      hasText(legal.cin)),
  );

  return {
    about:
      hasText(company.short_description) ||
      hasText(company.detailed_description) ||
      hasText(company.about) ||
      hasText(company.business_type) ||
      hasText(company.team_size) ||
      hasText(company.est_year),
    website: hasText(company.website),
    social_links: hasValidArray(company.social_links, ["url"]),
    contacts: hasValidArray(company.contacts, [
      "phone",
      "email",
      "personName",
      "name",
    ]),
    branches: hasValidArray(company.branches, ["city", "area", "street"]),
    operations: hasOperations,
    offerings: hasValidArray(company.offerings, ["name", "title"]),
    portfolio: hasValidArray(company.portfolio, ["title", "name"]),
    achievements: hasValidArray(company.achievements, ["title", "name"]),
    open_jobs:
      hasJobsInTable ||
      hasValidArray(company.open_jobs, ["job_title", "title", "role"]),
    team_members: hasValidArray(company.team_members, [
      "name",
      "kagazId",
      "kagaz_id",
    ]),
    legal_info: hasLegal,
  };
}

export default function CompanyPrivacyModal({
  isOpen,
  onClose,
  companyId,
}: Props) {
  const [visibility, setVisibility] = useState<CompanyVisibility>(
    DEFAULT_COMPANY_VISIBILITY,
  );
  const [filledMap, setFilledMap] = useState<
    Record<keyof CompanyVisibility, boolean>
  >(() =>
    Object.keys(DEFAULT_COMPANY_VISIBILITY).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof CompanyVisibility, boolean>,
    ),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isUuid = (val: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  useEffect(() => {
    if (!isOpen || !companyId) return;

    async function fetchVisibility() {
      setLoading(true);
      setErrorMsg(null);

      const column = isUuid(companyId) ? "id" : "kagaz_id";
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .eq(column, companyId)
        .maybeSingle();

      if (error) {
        console.error("Fetch company visibility error:", error);
        setErrorMsg(error.message);
      } else if (data) {
        // company_jobs টেবিলে কোনো জব আছে কি না তাও চেক করে নিচ্ছি
        const { count: jobCount } = await supabase
          .from("company_jobs")
          .select("id", { count: "exact", head: true })
          .eq("company_id", data.id);

        const computed = computeFilledCompanyFields(
          data as Record<string, unknown>,
          (jobCount || 0) > 0,
        );
        setFilledMap(computed);

        const merged = {
          ...DEFAULT_COMPANY_VISIBILITY,
          ...(data.public_visibility || {}),
        };
        (Object.keys(merged) as (keyof CompanyVisibility)[]).forEach((k) => {
          if (!computed[k]) {
            merged[k] = false;
          }
        });
        setVisibility(merged);
      }
      setLoading(false);
    }

    fetchVisibility();
  }, [isOpen, companyId]);

  const handleToggle = (key: keyof CompanyVisibility) => {
    if (!filledMap[key]) return;
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    setSavedSuccess(false);
    setErrorMsg(null);

    const column = isUuid(companyId) ? "id" : "kagaz_id";
    const { data, error } = await supabase
      .from("company_profiles")
      .update({ public_visibility: visibility })
      .eq(column, companyId)
      .select("id");

    setSaving(false);

    if (error) {
      console.error("Save company visibility error:", error);
      setErrorMsg(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setErrorMsg(
        "Update blocked! Check Supabase RLS policy for 'company_profiles'.",
      );
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2.5 sm:p-4">
      <div className="bg-white border border-neutral-300 w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-2 px-3.5 sm:px-5 py-3 sm:py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-start sm:items-center gap-2 min-w-0">
            <ShieldCheck className="h-5 w-5 text-neutral-900 shrink-0 mt-0.5 sm:mt-0" />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-950 truncate">
                Organization Page Privacy
              </h3>
              <p className="text-[10.5px] sm:text-[11px] text-neutral-500 leading-snug">
                Choose which business sections appear on your public QR page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-200 rounded-xs transition-colors cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-5 sm:space-y-6">
          {/* Mandatory Locked Section */}
          <div className="bg-neutral-100 border border-neutral-200 rounded-xs p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase text-neutral-800">
              <Lock className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
              <span>Always Visible (Mandatory Identity)</span>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-neutral-600 leading-relaxed">
              <strong>
                Company Name, Logo, Cover Banner, ORG ID, Industry &amp;
                Category
              </strong>{" "}
              and <strong>Verified Badge</strong> are always visible.{" "}
              <span className="text-neutral-500 italic">
                (Company PAN &amp; verification docs remain strictly private.)
              </span>
            </p>
          </div>

          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
            </div>
          ) : (
            COMPANY_VISIBILITY_GROUPS.map((group) => (
              <div key={group.groupTitle} className="space-y-2">
                <h4 className="text-[10.5px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-1">
                  {group.groupTitle}
                </h4>
                <div className="divide-y divide-neutral-100">
                  {group.items.map((item) => {
                    const hasData = filledMap[item.key];
                    const isOn = hasData && visibility[item.key];
                    return (
                      <div
                        key={item.key}
                        onClick={() => handleToggle(item.key)}
                        className={`py-2.5 flex items-center justify-between gap-2.5 sm:gap-3 px-1.5 sm:px-2 rounded-xs transition-colors ${
                          hasData
                            ? "cursor-pointer hover:bg-neutral-50"
                            : "opacity-55 cursor-not-allowed bg-neutral-50/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isOn ? (
                              <Eye className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            )}
                            <span className="text-xs font-semibold text-neutral-900">
                              {item.label}
                            </span>
                            {!hasData && (
                              <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-600 text-[9px] font-mono uppercase rounded-xs shrink-0">
                                Not Added
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-[10.5px] text-neutral-500 pl-5 leading-snug mt-0.5">
                            {item.desc}
                          </p>
                        </div>

                        {/* Toggle Switch */}
                        <button
                          type="button"
                          role="switch"
                          disabled={!hasData}
                          aria-checked={isOn}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            !hasData
                              ? "bg-neutral-200 cursor-not-allowed"
                              : isOn
                                ? "bg-neutral-900 cursor-pointer"
                                : "bg-neutral-300 cursor-pointer"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              isOn ? "translate-x-4.5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {errorMsg && (
          <div className="px-3.5 sm:px-5 py-2 bg-red-50 border-t border-red-200 text-[10.5px] sm:text-[11px] font-mono text-red-700">
            Error: {errorMsg}
          </div>
        )}

        {/* Footer */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 rounded-xs cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-mono uppercase bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-500 rounded-xs cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
