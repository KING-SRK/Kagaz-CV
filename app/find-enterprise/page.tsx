// app/find-enterprise/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Loader2, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  DEFAULT_ORG_VISIBILITY,
  EnterpriseProfile,
  ITEMS_PER_PAGE,
  OrganizationVisibility,
} from "./types";
import EnterpriseFilters from "./components/EnterpriseFilters";
import EnterpriseCard from "./components/EnterpriseCard";

// সমৃদ্ধ ও ভেরিফায়েড অর্গানাইজেশনগুলোকে আগে দেখানোর স্কোর
function getOrgRichnessScore(org: EnterpriseProfile): number {
  const vis: OrganizationVisibility = {
    ...DEFAULT_ORG_VISIBILITY,
    ...(org.public_visibility || {}),
  };
  let score = 0;
  if (org.is_verified) score += 10;
  if (org.logo_url) score += 3;
  if (vis.short_description && org.short_description?.trim()) score += 3;
  if (vis.services && Array.isArray(org.services) && org.services.length > 0)
    score += 4;
  if (vis.products && Array.isArray(org.products) && org.products.length > 0)
    score += 2;
  if (
    vis.open_jobs &&
    Array.isArray(org.company_jobs) &&
    org.company_jobs.some((j) => !j.status || j.status.toLowerCase() === "open")
  ) {
    score += 4;
  }
  return score;
}

export default function FindEnterprisePage() {
  const [organizations, setOrganizations] = useState<EnterpriseProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // সার্চ ও ফিল্টার স্টেট
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<string>("All");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyHiring, setOnlyHiring] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"recommended" | "recent">("recommended");

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // ১. Supabase থেকে অর্গানাইজেশন প্রোফাইল লোড করা
  useEffect(() => {
    let isMounted = true;

    async function fetchOrganizations() {
      setLoading(true);
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .not("company_name", "is", null)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!isMounted) return;

      if (error) {
        console.error("Supabase company_profiles error:", error);
      } else if (Array.isArray(data)) {
        // যদি company_jobs আলাদা টেবিল হয়, তবে ওপেন জবগুলো আলাদা কুয়েরিতে আনা হচ্ছে (যাতে রিলেশন না থাকলেও এরর না দেয়)
        const { data: jobsData } = await supabase
          .from("company_jobs")
          .select("id, company_id, status");

        const enriched = data.map((org) => ({
          ...org,
          company_jobs: Array.isArray(jobsData)
            ? jobsData.filter(
                (j) => j.company_id === org.id || j.company_id === org.kagaz_id,
              )
            : [],
        }));

        setOrganizations(enriched as EnterpriseProfile[]);
      }
      setLoading(false);
    }

    fetchOrganizations();

    return () => {
      isMounted = false;
    };
  }, []);

  // ২. ইন্ডাস্ট্রি লিস্ট (ডিফল্ট + ডাটাবেস)
  const availableIndustries = useMemo(() => {
    const defaults = [
      "IT & Software",
      "Computer Hardware & Repairing",
      "Digital Agency & Marketing",
      "Education & Training",
      "Retail & E-Commerce",
      "Healthcare & Diagnostics",
      "Finance & Consulting",
      "Manufacturing & Industrial",
    ];
    const set = new Set<string>(defaults);
    organizations.forEach((org) => {
      const vis: OrganizationVisibility = {
        ...DEFAULT_ORG_VISIBILITY,
        ...(org.public_visibility || {}),
      };
      if (vis.industry_category && org.industry_category?.trim()) {
        set.add(org.industry_category.trim());
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [organizations]);

  // ৩. বিজনেস / এনটিটি টাইপ লিস্ট
  const availableBusinessTypes = useMemo(() => {
    const defaults = [
      "Proprietorship",
      "Partnership",
      "Private Limited (Pvt Ltd)",
      "Startup",
      "Local Business / Shop",
      "Agency / Studio",
      "Educational Institute",
    ];
    const set = new Set<string>(defaults);
    organizations.forEach((org) => {
      const vis: OrganizationVisibility = {
        ...DEFAULT_ORG_VISIBILITY,
        ...(org.public_visibility || {}),
      };
      if (vis.business_type && org.business_type?.trim()) {
        set.add(org.business_type.trim());
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [organizations]);

  // ৪. পপুলার সার্ভিস লিস্ট (ডাটাবেস + ডিফল্ট)
  const popularServices = useMemo(() => {
    const freqMap = new Map<string, { label: string; count: number }>();
    organizations.forEach((org) => {
      const vis: OrganizationVisibility = {
        ...DEFAULT_ORG_VISIBILITY,
        ...(org.public_visibility || {}),
      };
      if (vis.services && Array.isArray(org.services)) {
        org.services.forEach((s) => {
          const clean = (s.title || s.name || "").trim();
          if (!clean) return;
          const key = clean.toLowerCase();
          const prev = freqMap.get(key);
          if (prev) prev.count += 1;
          else freqMap.set(key, { label: clean, count: 1 });
        });
      }
    });

    const dbServices = Array.from(freqMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((item) => item.label);

    if (dbServices.length > 0) return dbServices;

    return [
      "Web Development",
      "Mobile App Development",
      "Laptop & Desktop Repairing",
      "Digital Marketing",
      "Graphic & UI Design",
      "IT Consulting",
    ];
  }, [organizations]);

  // ৫. প্রাইভেসি-সচেতন ফিল্টারিং ও স্মার্ট সর্টিং
  const filteredOrganizations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const locQ = selectedLocation.trim().toLowerCase();
    const srvQ = selectedService.trim().toLowerCase();

    const filtered = organizations.filter((org) => {
      if (!org.company_name?.trim()) return false;

      const vis: OrganizationVisibility = {
        ...DEFAULT_ORG_VISIBILITY,
        ...(org.public_visibility || {}),
      };

      const visibleLocation = vis.address
        ? [org.city, org.state, org.country].filter(Boolean).join(", ")
        : "";

      const visibleIndustry = vis.industry_category
        ? org.industry_category?.trim() || ""
        : "";

      const visibleBusinessType = vis.business_type
        ? org.business_type?.trim() || ""
        : "";

      const visibleOfferings = [
        ...(vis.services && Array.isArray(org.services)
          ? org.services.map((s) => (s.title || s.name || "").trim())
          : []),
        ...(vis.products && Array.isArray(org.products)
          ? org.products.map((p) => (p.title || p.name || "").trim())
          : []),
      ].filter(Boolean);

      const hasOpenJobs =
        vis.open_jobs &&
        Array.isArray(org.company_jobs) &&
        org.company_jobs.some(
          (j) => !j.status || j.status.toLowerCase() === "open",
        );

      if (onlyVerified && !org.is_verified) return false;
      if (onlyHiring && !hasOpenJobs) return false;
      if (selectedIndustry !== "All" && visibleIndustry !== selectedIndustry) {
        return false;
      }
      if (
        selectedBusinessType !== "All" &&
        visibleBusinessType !== selectedBusinessType
      ) {
        return false;
      }
      if (locQ && !visibleLocation.toLowerCase().includes(locQ)) {
        return false;
      }
      if (
        srvQ &&
        !visibleOfferings.some((item) => item.toLowerCase().includes(srvQ))
      ) {
        return false;
      }

      if (q) {
        const matchName = org.company_name.toLowerCase().includes(q);
        const matchId = org.kagaz_id?.toLowerCase().includes(q);
        const matchTagline = org.tagline?.toLowerCase().includes(q);
        const matchDesc =
          vis.short_description &&
          org.short_description?.toLowerCase().includes(q);
        const matchIndustry = visibleIndustry.toLowerCase().includes(q);
        const matchLoc = visibleLocation.toLowerCase().includes(q);
        const matchOffering = visibleOfferings.some((item) =>
          item.toLowerCase().includes(q),
        );

        if (
          !matchName &&
          !matchId &&
          !matchTagline &&
          !matchDesc &&
          !matchIndustry &&
          !matchLoc &&
          !matchOffering
        ) {
          return false;
        }
      }

      return true;
    });

    if (sortBy === "recommended") {
      return [...filtered].sort(
        (a, b) => getOrgRichnessScore(b) - getOrgRichnessScore(a),
      );
    }
    return filtered;
  }, [
    organizations,
    searchQuery,
    selectedIndustry,
    selectedBusinessType,
    selectedService,
    selectedLocation,
    onlyVerified,
    onlyHiring,
    sortBy,
  ]);

  const displayedOrgs = filteredOrganizations.slice(0, visibleCount);

  const activeFilterCount =
    (selectedIndustry !== "All" ? 1 : 0) +
    (selectedBusinessType !== "All" ? 1 : 0) +
    (selectedService.trim() ? 1 : 0) +
    (selectedLocation.trim() ? 1 : 0) +
    (onlyVerified ? 1 : 0) +
    (onlyHiring ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("All");
    setSelectedBusinessType("All");
    setSelectedService("");
    setSelectedLocation("");
    setOnlyVerified(false);
    setOnlyHiring(false);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FDFCFB] text-neutral-900">
      {/* ১. হিরো হেডার */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4 sm:pt-8 sm:pb-6">
          <div className="max-w-2xl space-y-1.5">
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
              ● SutraNet Enterprise Directory
            </span>
            <h1 className="text-xl sm:text-3xl font-serif font-bold tracking-tight text-neutral-950 leading-snug">
              Discover Verified Organizations &amp; Enterprises
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Explore verified companies, startups, and service providers by
              name, Enterprise ID, services, or city.
            </p>
          </div>
        </div>
      </section>

      {/* ২. স্টিকি সার্চ ও সর্ট বার */}
      <div className="sticky top-16 sm:top-20 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 sm:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="h-4 w-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0" />
              <input
                type="text"
                placeholder="Search by company name, Enterprise ID, service, industry, or city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="w-full pl-10 pr-9 py-2.5 text-sm border border-neutral-300 bg-neutral-50/60 focus:bg-white rounded-xs focus:outline-none focus:border-neutral-950 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "recommended" | "recent")
                }
                aria-label="Sort results"
                className="flex-1 sm:flex-none min-w-0 px-3 py-2.5 text-xs font-mono uppercase border border-neutral-300 bg-white text-neutral-800 rounded-xs focus:outline-none focus:border-neutral-950 cursor-pointer truncate"
              >
                <option value="recommended">Sort: Top &amp; Verified</option>
                <option value="recent">Sort: Recently Joined</option>
              </select>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-mono uppercase border border-neutral-900 bg-neutral-950 text-white rounded-xs cursor-pointer shrink-0 active:bg-neutral-800"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-500 text-neutral-950 text-[10px] font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ৩. মেইন কন্টেন্ট গ্রিড */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* ফিল্টার সাইডবার ও মোবাইল ড্রয়ার */}
          <EnterpriseFilters
            availableIndustries={availableIndustries}
            selectedIndustry={selectedIndustry}
            onSelectIndustry={(ind) => {
              setSelectedIndustry(ind);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            availableBusinessTypes={availableBusinessTypes}
            selectedBusinessType={selectedBusinessType}
            onSelectBusinessType={(type) => {
              setSelectedBusinessType(type);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            popularServices={popularServices}
            selectedService={selectedService}
            onSelectService={(srv) => {
              setSelectedService(srv);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            selectedLocation={selectedLocation}
            onChangeLocation={(loc) => {
              setSelectedLocation(loc);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            onlyVerified={onlyVerified}
            onToggleVerified={(val) => {
              setOnlyVerified(val);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            onlyHiring={onlyHiring}
            onToggleHiring={(val) => {
              setOnlyHiring(val);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            activeFilterCount={activeFilterCount}
            hasSearchQuery={Boolean(searchQuery.trim())}
            onResetAll={resetAllFilters}
            mobileOpen={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
            totalResults={filteredOrganizations.length}
          />

          {/* ডানপাশের রেজাল্ট গ্রিড */}
          <div className="lg:col-span-9 space-y-4 min-w-0">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>
                Showing{" "}
                <strong className="text-neutral-900">
                  {displayedOrgs.length}
                </strong>{" "}
                of{" "}
                <strong className="text-neutral-900">
                  {filteredOrganizations.length}
                </strong>{" "}
                organizations
              </span>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2.5 bg-white border border-neutral-200 rounded-xs">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                  Loading Verified Enterprises...
                </p>
              </div>
            ) : displayedOrgs.length === 0 ? (
              <div className="py-14 sm:py-16 px-4 text-center bg-white border border-neutral-300 rounded-xs space-y-3">
                <p className="text-base font-serif font-bold text-neutral-900">
                  No matching organizations found
                </p>
                <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Try clearing some filters or searching with a different
                  company name, service, city, or Enterprise ID.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase rounded-xs hover:bg-neutral-800 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 sm:gap-4">
                  {displayedOrgs.map((org) => (
                    <EnterpriseCard key={org.id} org={org} />
                  ))}
                </div>

                {visibleCount < filteredOrganizations.length && (
                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                      }
                      className="w-full sm:w-auto px-6 py-2.5 border border-neutral-900 bg-white text-neutral-950 hover:bg-neutral-950 hover:text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      Load More Organizations (
                      {filteredOrganizations.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
