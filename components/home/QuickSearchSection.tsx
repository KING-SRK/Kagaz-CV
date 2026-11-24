// components/QuickSearchSection.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const FALLBACK_TALENT_TAGS = [
  "Web Developer",
  "Next.js",
  "Kolkata",
  "Barrackpore",
];

const FALLBACK_ENTERPRISE_TAGS = [
  "Web Development",
  "Computer Repairing",
  "Digital Solutions",
  "Barrackpore",
];

function getTopFrequentItems(items: string[], limit: number): string[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const raw of items) {
    const clean = raw?.trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { label: clean, count: 1 });
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => entry.label);
}

export default function QuickSearchSection() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<"talent" | "enterprise">(
    "talent",
  );
  const [query, setQuery] = useState("");
  const [talentTags, setTalentTags] = useState<string[]>(FALLBACK_TALENT_TAGS);
  const [enterpriseTags, setEnterpriseTags] = useState<string[]>(
    FALLBACK_ENTERPRISE_TAGS,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPopularTags() {
      // ১. profiles টেবিল থেকে আসল skills ও city আনা
      const { data: profiles } = await supabase
        .from("profiles")
        .select("skills, city")
        .limit(50);

      if (isMounted && profiles && profiles.length > 0) {
        const allSkills: string[] = [];
        const allCities: string[] = [];

        profiles.forEach((p) => {
          if (Array.isArray(p.skills)) {
            allSkills.push(...p.skills);
          }
          if (typeof p.city === "string" && p.city.trim()) {
            allCities.push(p.city.trim());
          }
        });

        const topSkills = getTopFrequentItems(allSkills, 3);
        const topCity = getTopFrequentItems(allCities, 1);
        const combined = [...topSkills, ...topCity];

        if (combined.length > 0) {
          setTalentTags(combined);
        }
      }

      // ২. company_profiles টেবিল থেকে আসল industry, business_category ও branches-এর city আনা
      const { data: companies } = await supabase
        .from("company_profiles")
        .select("industry, business_category, branches")
        .limit(50);

      if (isMounted && companies && companies.length > 0) {
        const allCategories: string[] = [];
        const allCities: string[] = [];

        companies.forEach((c) => {
          if (typeof c.industry === "string" && c.industry.trim()) {
            allCategories.push(c.industry.trim());
          } else if (
            typeof c.business_category === "string" &&
            c.business_category.trim()
          ) {
            allCategories.push(c.business_category.trim());
          }

          if (Array.isArray(c.branches)) {
            c.branches.forEach((b: Record<string, unknown>) => {
              const branchCity =
                typeof b?.city === "string"
                  ? b.city
                  : typeof b?.location === "string"
                    ? b.location.split(",")[0]
                    : "";
              if (branchCity && branchCity.trim()) {
                allCities.push(branchCity.trim());
              }
            });
          }
        });

        const topCategories = getTopFrequentItems(allCategories, 3);
        const topCity = getTopFrequentItems(allCities, 1);
        const combined = [...topCategories, ...topCity];

        if (combined.length > 0) {
          setEnterpriseTags(combined);
        }
      }
    }

    loadPopularTags();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const basePath =
      searchMode === "talent" ? "/find-talent" : "/find-enterprise";

    if (trimmed) {
      router.push(`${basePath}?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(basePath);
    }
  };

  const quickTags = searchMode === "talent" ? talentTags : enterpriseTags;

  return (
    <section className="border-y border-neutral-200/80 text-black bg-white px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl w-full space-y-6">
        {/* ওপরের হেডিং ও মোড সুইচার */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Instant Directory &amp; ID Lookup</span>
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-neutral-950">
              Verify a Person, Enterprise, or SutraNet ID
            </h2>
          </div>

          {/* Talent vs Enterprise টগল পিল */}
          <div className="inline-flex p-1 bg-neutral-100 border border-neutral-200 rounded-xs self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setSearchMode("talent")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                searchMode === "talent"
                  ? "bg-neutral-950 text-white shadow-2xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>Talent</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchMode("enterprise")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                searchMode === "enterprise"
                  ? "bg-neutral-950 text-white shadow-2xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>Enterprise</span>
            </button>
          </div>
        </div>

        {/* মেইন সার্চ বার ফর্ম */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2.5 sm:gap-3"
        >
          <div className="relative flex-1 min-w-0">
            <Search className="h-4 w-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchMode === "talent"
                  ? "Search by name, SutraNet ID, skill, or city..."
                  : "Search by company name, Enterprise ID, service, or city..."
              }
              className="w-full pl-10 pr-4 py-3 sm:py-3.5 text-sm border border-neutral-300 bg-neutral-50/60 focus:bg-white rounded-xs focus:outline-none focus:border-neutral-950 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-neutral-950 text-white px-6 py-3 sm:py-3.5 text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 active:bg-neutral-900 transition-colors cursor-pointer shrink-0"
          >
            <span>
              Search {searchMode === "talent" ? "Talent" : "Enterprises"}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          </button>
        </form>

        {/* কুইক সাজেশন ট্যাগস */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400 mr-1">
            Popular:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                const basePath =
                  searchMode === "talent" ? "/find-talent" : "/find-enterprise";
                router.push(`${basePath}?q=${encodeURIComponent(tag)}`);
              }}
              className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-[11px] font-mono rounded-xs transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
