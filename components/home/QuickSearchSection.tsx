// components/QuickSearchSection.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function QuickSearchSection() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<"talent" | "enterprise">(
    "talent",
  );
  const [query, setQuery] = useState("");

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

  const quickTags =
    searchMode === "talent"
      ? ["Full-Stack Developer", "Hardware Engineer", "UI/UX Design", "Kolkata"]
      : [
          "Web Development",
          "Computer Repairing",
          "Digital Agency",
          "Barrackpore",
        ];

  return (
    <section className="border-y border-neutral-200/80 text-black bg-white text- px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
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
