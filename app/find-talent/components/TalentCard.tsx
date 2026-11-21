// app/find-talent/components/TalentCard.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  User,
  ArrowUpRight,
  Briefcase,
  Sparkles,
  Building2,
  FolderGit2,
  GraduationCap,
} from "lucide-react";
import {
  DEFAULT_INDIVIDUAL_VISIBILITY,
  IndividualVisibility,
} from "@/app/dashboard/individual/components/IndividualPrivacyModal";
import { TalentProfile } from "../types";

export default function TalentCard({ person }: { person: TalentProfile }) {
  const vis: IndividualVisibility = {
    ...DEFAULT_INDIVIDUAL_VISIBILITY,
    ...(person.public_visibility || {}),
  };

  const locationText = vis.address
    ? [person.city, person.state].filter(Boolean).join(", ")
    : "";

  const visibleBio = vis.bio && person.bio ? person.bio.trim() : "";

  const visibleSkills =
    vis.skills && Array.isArray(person.skills)
      ? person.skills.filter((s) => s.trim())
      : [];

  // বর্তমান বা সর্বশেষ কাজের অভিজ্ঞতা বের করা
  const latestExp =
    vis.experience && Array.isArray(person.experience)
      ? person.experience.find(
          (e) => e.isCurrent && (e.designation || e.company),
        ) || person.experience.find((e) => e.designation || e.company)
      : undefined;

  // সর্বশেষ শিক্ষাগত যোগ্যতা (যদি কোনো কাজ না থাকে তবে ফলব্যাক হিসেবে)
  const latestEdu =
    !latestExp &&
    vis.education &&
    Array.isArray(person.profile_education) &&
    person.profile_education.length > 0
      ? person.profile_education[0]
      : undefined;

  // প্রোজেক্টস হাইলাইট
  const validProjects =
    vis.projects && Array.isArray(person.projects)
      ? person.projects.filter((p) => p.title?.trim())
      : [];

  const showJobBadge =
    vis.career_preferences && person.career_preferences?.lookingForJob;
  const showFreelanceBadge =
    vis.career_preferences && person.career_preferences?.availableForFreelance;

  return (
    <div className="bg-white border border-neutral-300 hover:border-neutral-950 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group min-w-0">
      <div>
        {/* ১. ক্লিন টপ আইডি স্ট্রিপ */}
        <div className="px-3.5 sm:px-4 py-2 bg-neutral-50 border-b border-neutral-200/80 flex items-center justify-between gap-2">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-neutral-500 truncate">
            ● SutraNet ID
          </span>
          <span className="px-2 py-0.5 bg-white border border-neutral-300 text-[10px] font-mono font-bold text-neutral-900 rounded-xs shrink-0">
            {person.kagaz_id}
          </span>
        </div>

        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5">
          {/* ২. রেসপন্সিভ প্রোফাইল ফটো + নাম ও পদবি */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="h-14 w-14 sm:h-18 sm:w-18 rounded-full border-2 border-neutral-200 group-hover:border-neutral-900 bg-neutral-100 shadow-xs overflow-hidden flex items-center justify-center shrink-0 transition-colors">
              {person.avatar_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={person.avatar_url}
                  alt={person.full_name || "Avatar"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-serif font-bold text-neutral-950 leading-snug truncate">
                  {person.full_name}
                </h2>
                {person.is_verified && (
                  <ShieldCheck
                    className="h-4 w-4 text-emerald-600 shrink-0"
                    aria-label="Verified Identity"
                  />
                )}
              </div>

              <p className="text-xs font-medium text-neutral-800 line-clamp-1">
                {person.title || person.sector || "SutraNet Member"}
              </p>

              {(person.sector || locationText) && (
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10.5px] sm:text-[11px] font-mono text-neutral-500">
                  {person.title && person.sector && (
                    <span className="truncate max-w-35 sm:max-w-none">
                      {person.sector}
                    </span>
                  )}
                  {person.title && person.sector && locationText && (
                    <span>•</span>
                  )}
                  {locationText && (
                    <span className="inline-flex items-center gap-1 min-w-0">
                      <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ৩. কাজের বা পড়াশোনার হাইলাইট বক্স */}
          {(latestExp || latestEdu || validProjects.length > 0) && (
            <div className="p-2 sm:p-2.5 bg-neutral-50 border border-neutral-200/90 rounded-xs space-y-1.5 text-[11px]">
              {latestExp && (
                <div className="flex items-center gap-2 text-neutral-800 min-w-0">
                  <Building2 className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  <p className="truncate">
                    <span className="font-semibold">
                      {latestExp.designation || "Working"}
                    </span>
                    {latestExp.company && (
                      <span className="text-neutral-600">
                        {" "}
                        at {latestExp.company}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {latestEdu && (
                <div className="flex items-center gap-2 text-neutral-800 min-w-0">
                  <GraduationCap className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  <p className="truncate">
                    <span className="font-semibold">{latestEdu.degree}</span>
                    {latestEdu.institution && (
                      <span className="text-neutral-600">
                        {" "}
                        • {latestEdu.institution}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {validProjects.length > 0 && (
                <div className="flex items-center gap-2 text-neutral-700 min-w-0">
                  <FolderGit2 className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  <p className="truncate font-mono text-[10.5px]">
                    {validProjects.length}{" "}
                    {validProjects.length === 1 ? "Project" : "Projects"}:{" "}
                    <span className="text-neutral-900 font-medium">
                      {validProjects[0].title}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ৪. সংক্ষিপ্ত Bio */}
          {visibleBio && (
            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
              {visibleBio}
            </p>
          )}

          {/* ৫. Availability ব্যাজ */}
          {(showJobBadge || showFreelanceBadge) && (
            <div className="flex flex-wrap gap-1.5">
              {showJobBadge && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono rounded-xs">
                  <Briefcase className="h-2.5 w-2.5 shrink-0" />
                  <span>Open to Job</span>
                </span>
              )}
              {showFreelanceBadge && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-mono rounded-xs">
                  <Sparkles className="h-2.5 w-2.5 shrink-0" />
                  <span>Freelance</span>
                </span>
              )}
            </div>
          )}

          {/* ৬. Skills ট্যাগস */}
          {visibleSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
              {visibleSkills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-neutral-100 border border-neutral-200/80 text-neutral-800 text-[10.5px] font-mono rounded-xs"
                >
                  {skill}
                </span>
              ))}
              {visibleSkills.length > 3 && (
                <span className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 text-neutral-500 text-[10.5px] font-mono rounded-xs">
                  +{visibleSkills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ৭. ফুটার CTA বাটন */}
      <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-4">
        <Link
          href={`/p/${person.kagaz_id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-900 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors"
        >
          <span>View Public Profile</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
