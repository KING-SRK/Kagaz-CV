// app/find-talent/page.tsx
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Loader2, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  DEFAULT_INDIVIDUAL_VISIBILITY,
  IndividualVisibility,
} from "@/app/dashboard/individual/components/IndividualPrivacyModal";
import { TalentProfile, ITEMS_PER_PAGE } from "./types";
import TalentFilters from "./components/TalentFilters";
import TalentCard from "./components/TalentCard";

// প্রোফাইলটি কতটা তথ্যপূর্ণ তা বের করার স্কোর ফাংশন (যাতে সমৃদ্ধ প্রোফাইলগুলো আগে দেখায়)
function getProfileRichnessScore(p: TalentProfile): number {
  const vis: IndividualVisibility = {
    ...DEFAULT_INDIVIDUAL_VISIBILITY,
    ...(p.public_visibility || {}),
  };
  let score = 0;
  if (p.is_verified) score += 10;
  if (p.avatar_url) score += 3;
  if (p.title?.trim()) score += 3;
  if (vis.bio && p.bio?.trim()) score += 2;
  if (vis.experience && Array.isArray(p.experience) && p.experience.length > 0)
    score += 4;
  if (vis.skills && Array.isArray(p.skills) && p.skills.length > 0) score += 3;
  if (vis.projects && Array.isArray(p.projects) && p.projects.length > 0)
    score += 3;
  return score;
}

function FindTalentContent() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // সার্চ ও ফিল্টার স্টেট (URL থেকে ?q= থাকলে শুরুতেই বসিয়ে নেবে)
  const [searchQuery, setSearchQuery] = useState<string>(
    () => searchParams.get("q") || "",
  );
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<
    "all" | "experienced" | "fresher"
  >("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyOpenToJob, setOnlyOpenToJob] = useState<boolean>(false);
  const [onlyFreelance, setOnlyFreelance] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"recommended" | "recent">("recommended");

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // ১. Supabase থেকে প্রোফাইল লোড করা
  useEffect(() => {
    let isMounted = true;

    async function fetchTalents() {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, kagaz_id, full_name, title, sector, bio, avatar_url, city, state, country, is_verified, skills, experience, projects, career_preferences, public_visibility, created_at, profile_education(degree, institution)",
        )
        .not("full_name", "is", null)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!isMounted) return;

      if (!error && Array.isArray(data)) {
        setProfiles(data as TalentProfile[]);
      }
      setLoading(false);
    }

    fetchTalents();

    return () => {
      isMounted = false;
    };
  }, []);

  // ২. স্ট্যান্ডার্ড সেক্টর + ডাটাবেসের ইউনিক সেক্টর লিস্ট
  const availableSectors = useMemo(() => {
    const defaultSectors = [
      "IT & Software",
      "Hardware & Electronics",
      "Design & Creative",
      "Digital Marketing",
      "Education & Training",
      "Finance & Accounting",
      "Healthcare",
      "Business & Operations",
    ];
    const sectors = new Set<string>(defaultSectors);
    profiles.forEach((p) => {
      if (p.sector && p.sector.trim()) {
        sectors.add(p.sector.trim());
      }
    });
    return ["All", ...Array.from(sectors).sort()];
  }, [profiles]);

  // ৩. ডাটাবেসের স্কিল + জনপ্রিয় ডিফল্ট স্কিলস
  const popularSkills = useMemo(() => {
    const freqMap = new Map<string, { label: string; count: number }>();
    profiles.forEach((p) => {
      const vis: IndividualVisibility = {
        ...DEFAULT_INDIVIDUAL_VISIBILITY,
        ...(p.public_visibility || {}),
      };
      if (vis.skills && Array.isArray(p.skills)) {
        p.skills.forEach((rawSkill) => {
          const clean = rawSkill.trim();
          if (!clean) return;
          const key = clean.toLowerCase();
          const prev = freqMap.get(key);
          if (prev) {
            prev.count += 1;
          } else {
            freqMap.set(key, { label: clean, count: 1 });
          }
        });
      }
    });

    const dbSkills = Array.from(freqMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((item) => item.label);

    if (dbSkills.length > 0) return dbSkills;

    return [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Python",
      "UI/UX Design",
      "Video Editing",
      "Hardware Repairing",
      "Digital Marketing",
    ];
  }, [profiles]);

  // ৪. প্রাইভেসি-সচেতন ফিল্টারিং ও স্মার্ট সর্টিং
  const filteredTalents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const locQ = selectedLocation.trim().toLowerCase();
    const skillQ = selectedSkill.trim().toLowerCase();

    const filtered = profiles.filter((p) => {
      if (!p.full_name?.trim()) return false;

      const vis: IndividualVisibility = {
        ...DEFAULT_INDIVIDUAL_VISIBILITY,
        ...(p.public_visibility || {}),
      };

      const visibleSkills =
        vis.skills && Array.isArray(p.skills) ? p.skills : [];
      const visibleLocation = vis.address
        ? [p.city, p.state, p.country].filter(Boolean).join(", ")
        : "";
      const canShowCareer = Boolean(
        vis.career_preferences && p.career_preferences,
      );
      const hasVisibleExperience =
        vis.experience &&
        Array.isArray(p.experience) &&
        p.experience.some((e) => e.company?.trim() || e.designation?.trim());

      if (onlyVerified && !p.is_verified) return false;
      if (selectedSector !== "All" && p.sector?.trim() !== selectedSector) {
        return false;
      }
      if (experienceLevel === "experienced" && !hasVisibleExperience) {
        return false;
      }
      if (experienceLevel === "fresher" && hasVisibleExperience) {
        return false;
      }
      if (
        onlyOpenToJob &&
        (!canShowCareer || !p.career_preferences?.lookingForJob)
      ) {
        return false;
      }
      if (
        onlyFreelance &&
        (!canShowCareer || !p.career_preferences?.availableForFreelance)
      ) {
        return false;
      }
      if (locQ && !visibleLocation.toLowerCase().includes(locQ)) {
        return false;
      }
      if (
        skillQ &&
        !visibleSkills.some((s) => s.trim().toLowerCase() === skillQ)
      ) {
        return false;
      }

      if (q) {
        const matchName = p.full_name.toLowerCase().includes(q);
        const matchId = p.kagaz_id?.toLowerCase().includes(q);
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchSector = p.sector?.toLowerCase().includes(q);
        const matchSkill = visibleSkills.some((s) =>
          s.toLowerCase().includes(q),
        );
        const matchLoc = visibleLocation.toLowerCase().includes(q);
        const matchCompany =
          hasVisibleExperience &&
          p.experience!.some(
            (e) =>
              e.company?.toLowerCase().includes(q) ||
              e.designation?.toLowerCase().includes(q),
          );

        if (
          !matchName &&
          !matchId &&
          !matchTitle &&
          !matchSector &&
          !matchSkill &&
          !matchLoc &&
          !matchCompany
        ) {
          return false;
        }
      }

      return true;
    });

    if (sortBy === "recommended") {
      return [...filtered].sort(
        (a, b) => getProfileRichnessScore(b) - getProfileRichnessScore(a),
      );
    }
    return filtered;
  }, [
    profiles,
    searchQuery,
    selectedSector,
    selectedSkill,
    experienceLevel,
    selectedLocation,
    onlyVerified,
    onlyOpenToJob,
    onlyFreelance,
    sortBy,
  ]);

  const displayedTalents = filteredTalents.slice(0, visibleCount);

  const activeFilterCount =
    (selectedSector !== "All" ? 1 : 0) +
    (selectedSkill.trim() ? 1 : 0) +
    (experienceLevel !== "all" ? 1 : 0) +
    (selectedLocation.trim() ? 1 : 0) +
    (onlyVerified ? 1 : 0) +
    (onlyOpenToJob ? 1 : 0) +
    (onlyFreelance ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedSector("All");
    setSelectedSkill("");
    setExperienceLevel("all");
    setSelectedLocation("");
    setOnlyVerified(false);
    setOnlyOpenToJob(false);
    setOnlyFreelance(false);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FDFCFB] text-neutral-900">
      {/* ১. হিরো হেডার */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4 sm:pt-8 sm:pb-6">
          <div className="max-w-2xl space-y-1.5">
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
              ● SutraNet Talent Directory
            </span>
            <h1 className="text-xl sm:text-3xl font-serif font-bold tracking-tight text-neutral-950 leading-snug">
              Discover Verified Professionals &amp; Talent
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Search individuals by name, SutraNet ID, skills, company, or
              city—backed by authentic digital identity records.
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
                placeholder="Search by name, SutraNet ID, skill, company, or role..."
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
          <TalentFilters
            availableSectors={availableSectors}
            selectedSector={selectedSector}
            onSelectSector={(sector) => {
              setSelectedSector(sector);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            popularSkills={popularSkills}
            selectedSkill={selectedSkill}
            onSelectSkill={(skill) => {
              setSelectedSkill(skill);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            experienceLevel={experienceLevel}
            onChangeExperienceLevel={(level) => {
              setExperienceLevel(level);
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
            onlyOpenToJob={onlyOpenToJob}
            onToggleOpenToJob={(val) => {
              setOnlyOpenToJob(val);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            onlyFreelance={onlyFreelance}
            onToggleFreelance={(val) => {
              setOnlyFreelance(val);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            activeFilterCount={activeFilterCount}
            hasSearchQuery={Boolean(searchQuery.trim())}
            onResetAll={resetAllFilters}
            mobileOpen={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
            totalResults={filteredTalents.length}
          />

          {/* ডানপাশের রেজাল্ট গ্রিড */}
          <div className="lg:col-span-9 space-y-4 min-w-0">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>
                Showing{" "}
                <strong className="text-neutral-900">
                  {displayedTalents.length}
                </strong>{" "}
                of{" "}
                <strong className="text-neutral-900">
                  {filteredTalents.length}
                </strong>{" "}
                professionals
              </span>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2.5 bg-white border border-neutral-200 rounded-xs">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                  Loading Verified Talent...
                </p>
              </div>
            ) : displayedTalents.length === 0 ? (
              <div className="py-14 sm:py-16 px-4 text-center bg-white border border-neutral-300 rounded-xs space-y-3">
                <p className="text-base font-serif font-bold text-neutral-900">
                  No matching professionals found
                </p>
                <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Try clearing some filters or searching with a broader skill,
                  city, or SutraNet ID.
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
                  {displayedTalents.map((person) => (
                    <TalentCard key={person.id} person={person} />
                  ))}
                </div>

                {visibleCount < filteredTalents.length && (
                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                      }
                      className="w-full sm:w-auto px-6 py-2.5 border border-neutral-900 bg-white text-neutral-950 hover:bg-neutral-950 hover:text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      Load More Professionals (
                      {filteredTalents.length - visibleCount} remaining)
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

function FindTalentWrapper() {
  const searchParams = useSearchParams();
  return <FindTalentContent key={searchParams.get("q") || "all"} />;
}

export default function FindTalentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#FDFCFB]">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
        </div>
      }
    >
      <FindTalentWrapper />
    </Suspense>
  );
}
