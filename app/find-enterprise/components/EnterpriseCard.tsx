// app/find-enterprise/components/EnterpriseCard.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Building2,
  ArrowUpRight,
  Briefcase,
  Users,
  Calendar,
} from "lucide-react";
import {
  DEFAULT_ORG_VISIBILITY,
  EnterpriseProfile,
  OrganizationVisibility,
} from "../types";

export default function EnterpriseCard({ org }: { org: EnterpriseProfile }) {
  const vis: OrganizationVisibility = {
    ...DEFAULT_ORG_VISIBILITY,
    ...(org.public_visibility || {}),
  };

  const locationText = vis.address
    ? [org.city, org.state].filter(Boolean).join(", ")
    : "";

  const visibleDescription =
    vis.short_description && org.short_description
      ? org.short_description.trim()
      : "";

  const visibleServices =
    vis.services && Array.isArray(org.services)
      ? org.services
          .map((s) => (s.title || s.name || "").trim())
          .filter(Boolean)
      : [];

  const visibleProducts =
    vis.products && Array.isArray(org.products)
      ? org.products
          .map((p) => (p.title || p.name || "").trim())
          .filter(Boolean)
      : [];

  const allOfferings = [...visibleServices, ...visibleProducts];

  // অ্যাক্টিভ ওপেন জব কাউন্ট (যদি প্রাইভেসিতে open_jobs অন থাকে)
  const openJobsCount =
    vis.open_jobs && Array.isArray(org.company_jobs)
      ? org.company_jobs.filter(
          (j) => !j.status || j.status.toLowerCase() === "open",
        ).length
      : 0;

  return (
    <div className="bg-white border border-neutral-300 hover:border-neutral-950 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group min-w-0">
      <div>
        {/* ১. ক্লিন টপ ORG ID স্ট্রিপ */}
        <div className="px-3.5 sm:px-4 py-2 bg-neutral-50 border-b border-neutral-200/80 flex items-center justify-between gap-2">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-neutral-500 truncate">
            ● Enterprise ID
          </span>
          <span className="px-2 py-0.5 bg-white border border-neutral-300 text-[10px] font-mono font-bold text-neutral-900 rounded-xs shrink-0">
            {org.kagaz_id}
          </span>
        </div>

        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5">
          {/* ২. কোম্পানি লোগো + নাম, ইন্ডাস্ট্রি ও লোকেশন */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="h-14 w-14 sm:h-18 sm:w-18 rounded-md border-2 border-neutral-200 group-hover:border-neutral-900 bg-neutral-50 shadow-xs overflow-hidden flex items-center justify-center shrink-0 transition-colors p-1">
              {org.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={org.logo_url}
                  alt={org.company_name || "Organization Logo"}
                  className="w-full h-full object-contain rounded-xs group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-serif font-bold text-neutral-950 leading-snug truncate">
                  {org.company_name}
                </h2>
                {org.is_verified && (
                  <ShieldCheck
                    className="h-4 w-4 text-emerald-600 shrink-0"
                    aria-label="Verified Organization"
                  />
                )}
              </div>

              {(vis.industry_category && org.industry_category) ||
              org.tagline ? (
                <p className="text-xs font-medium text-neutral-800 line-clamp-1">
                  {org.tagline || org.industry_category}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10.5px] sm:text-[11px] font-mono text-neutral-500">
                {vis.business_type && org.business_type && (
                  <span className="truncate max-w-32.5 sm:max-w-none">
                    {org.business_type}
                  </span>
                )}
                {vis.business_type && org.business_type && locationText && (
                  <span>•</span>
                )}
                {locationText && (
                  <span className="inline-flex items-center gap-1 min-w-0">
                    <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{locationText}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ৩. কুইক অর্গানাইজেশন মেটা বক্স (Team Size / Founded / Hiring) */}
          {((vis.employee_count && org.employee_count) ||
            (vis.founding_year && org.founding_year) ||
            openJobsCount > 0) && (
            <div className="p-2 sm:p-2.5 bg-neutral-50 border border-neutral-200/90 rounded-xs flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] font-mono text-neutral-700">
              {vis.founding_year && org.founding_year && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-neutral-500 shrink-0" />
                  <span>Est. {org.founding_year}</span>
                </span>
              )}

              {vis.employee_count && org.employee_count && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3 text-neutral-500 shrink-0" />
                  <span>{org.employee_count}</span>
                </span>
              )}

              {openJobsCount > 0 && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xs font-semibold">
                  <Briefcase className="h-2.5 w-2.5 shrink-0" />
                  <span>
                    {openJobsCount} Open {openJobsCount === 1 ? "Job" : "Jobs"}
                  </span>
                </span>
              )}
            </div>
          )}

          {/* ৪. সংক্ষিপ্ত বিবরণ (Short Description) */}
          {visibleDescription && (
            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
              {visibleDescription}
            </p>
          )}

          {/* ৫. Services & Solutions চিপস (সর্বোচ্চ ৩টি) */}
          {allOfferings.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
              {allOfferings.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-neutral-100 border border-neutral-200/80 text-neutral-800 text-[10.5px] font-mono rounded-xs"
                >
                  {item}
                </span>
              ))}
              {allOfferings.length > 3 && (
                <span className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 text-neutral-500 text-[10.5px] font-mono rounded-xs">
                  +{allOfferings.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ৬. ফুটার CTA বাটন */}
      <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-4">
        <Link
          href={`/p/${org.kagaz_id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-900 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors"
        >
          <span>Visit Organization</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
