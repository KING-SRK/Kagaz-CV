// app/dashboard/individual/components/IndividualPrivacyModal.tsx
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

export interface IndividualVisibility {
  phone: boolean;
  email: boolean;
  address: boolean;
  bio: boolean;
  dob: boolean;
  gender: boolean;
  blood_group: boolean;
  nationality: boolean;
  languages: boolean;
  skills: boolean;
  interests: boolean;
  education: boolean;
  experience: boolean;
  projects: boolean;
  certifications: boolean;
  achievements: boolean;
  references_list: boolean;
  family: boolean;
  social_links: boolean;
  career_preferences: boolean;
}

export const DEFAULT_INDIVIDUAL_VISIBILITY: IndividualVisibility = {
  phone: true,
  email: true,
  address: true,
  bio: true,
  dob: false,
  gender: false,
  blood_group: false,
  nationality: true,
  languages: true,
  skills: true,
  interests: true,
  education: true,
  experience: true,
  projects: true,
  certifications: true,
  achievements: true,
  references_list: false,
  family: false,
  social_links: true,
  career_preferences: false,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
}

const VISIBILITY_GROUPS: {
  groupTitle: string;
  items: { key: keyof IndividualVisibility; label: string; desc: string }[];
}[] = [
  {
    groupTitle: "Contact & Location",
    items: [
      {
        key: "phone",
        label: "Phone Number",
        desc: "Direct call / contact number",
      },
      {
        key: "email",
        label: "Email Address",
        desc: "Official or personal email",
      },
      {
        key: "address",
        label: "Location & Address",
        desc: "City, State, Pincode & Country",
      },
      {
        key: "social_links",
        label: "Social & Web Links",
        desc: "LinkedIn, GitHub, Portfolio URLs",
      },
    ],
  },
  {
    groupTitle: "Personal Details",
    items: [
      { key: "bio", label: "About / Bio", desc: "Your personal summary" },
      {
        key: "dob",
        label: "Date of Birth",
        desc: "Birth date on public profile",
      },
      { key: "gender", label: "Gender", desc: "Gender identity" },
      {
        key: "blood_group",
        label: "Blood Group",
        desc: "Emergency blood group info",
      },
      {
        key: "nationality",
        label: "Nationality",
        desc: "Country of citizenship",
      },
      {
        key: "languages",
        label: "Languages Known",
        desc: "Spoken & written languages",
      },
      {
        key: "family",
        label: "Family Details",
        desc: "Family members information",
      },
    ],
  },
  {
    groupTitle: "Professional & Academic",
    items: [
      {
        key: "skills",
        label: "Skills",
        desc: "Technical & professional skills",
      },
      {
        key: "experience",
        label: "Work Experience",
        desc: "Past and current job roles",
      },
      {
        key: "education",
        label: "Education",
        desc: "School, college & degrees",
      },
      {
        key: "projects",
        label: "Projects",
        desc: "Personal or client projects",
      },
      {
        key: "certifications",
        label: "Certifications",
        desc: "Courses & verified certificates",
      },
      {
        key: "achievements",
        label: "Achievements",
        desc: "Awards & milestones",
      },
      {
        key: "interests",
        label: "Interests & Hobbies",
        desc: "Personal interests",
      },
      {
        key: "references_list",
        label: "References",
        desc: "Professional references",
      },
      {
        key: "career_preferences",
        label: "Career Preferences",
        desc: "Job status, notice period & roles",
      },
    ],
  },
];

// প্রতিটি ফিল্ডে আসল ডাটা আছে কি না তা চেক করার ফাংশন
function computeFilledFields(
  profile: Record<string, unknown>,
): Record<keyof IndividualVisibility, boolean> {
  const hasText = (v: unknown) => typeof v === "string" && v.trim().length > 0;

  const hasValidArray = (arr: unknown, keyToCheck?: string) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    if (!keyToCheck) {
      return arr.some((item) =>
        typeof item === "string" ? item.trim().length > 0 : Boolean(item),
      );
    }
    return arr.some(
      (item) =>
        item &&
        typeof item === "object" &&
        hasText((item as Record<string, unknown>)[keyToCheck]),
    );
  };

  const hasLanguages = (() => {
    if (!profile.languages) return false;
    try {
      const parsed =
        typeof profile.languages === "string"
          ? JSON.parse(profile.languages)
          : profile.languages;
      if (Array.isArray(parsed)) {
        return parsed.some((l: { name?: string } | string) =>
          typeof l === "string" ? l.trim().length > 0 : hasText(l?.name),
        );
      }
      return hasText(String(profile.languages));
    } catch {
      return hasText(String(profile.languages));
    }
  })();

  const cp = profile.career_preferences as
    | {
        lookingForJob?: boolean;
        availableForFreelance?: boolean;
        noticePeriod?: string;
      }
    | undefined;

  return {
    phone: hasText(profile.phone),
    email: hasText(profile.email),
    address:
      hasText(profile.address_line) ||
      hasText(profile.city) ||
      hasText(profile.state) ||
      hasText(profile.pincode) ||
      hasText(profile.country),
    bio: hasText(profile.bio),
    dob: hasText(profile.dob),
    gender: hasText(profile.gender),
    blood_group: hasText(profile.blood_group),
    nationality: hasText(profile.nationality),
    languages: hasLanguages,
    skills: hasValidArray(profile.skills),
    interests: hasValidArray(profile.interests),
    education: hasValidArray(profile.profile_education, "degree"),
    experience:
      hasValidArray(profile.experience, "company") ||
      hasValidArray(profile.experience, "designation"),
    projects: hasValidArray(profile.projects, "title"),
    certifications:
      hasValidArray(profile.certifications, "title") ||
      hasValidArray(profile.certifications, "name"),
    achievements: hasValidArray(profile.achievements, "title"),
    references_list: hasValidArray(profile.references_list, "name"),
    family: hasValidArray(profile.family, "name"),
    social_links: hasValidArray(profile.social_links, "url"),
    career_preferences: Boolean(
      cp &&
      (cp.lookingForJob ||
        cp.availableForFreelance ||
        hasText(cp.noticePeriod)),
    ),
  };
}

export default function IndividualPrivacyModal({
  isOpen,
  onClose,
  profileId,
}: Props) {
  const [visibility, setVisibility] = useState<IndividualVisibility>(
    DEFAULT_INDIVIDUAL_VISIBILITY,
  );
  const [filledMap, setFilledMap] = useState<
    Record<keyof IndividualVisibility, boolean>
  >(() =>
    Object.keys(DEFAULT_INDIVIDUAL_VISIBILITY).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof IndividualVisibility, boolean>,
    ),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isUuid = (val: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  useEffect(() => {
    if (!isOpen || !profileId) return;

    async function fetchVisibility() {
      setLoading(true);
      setErrorMsg(null);

      const column = isUuid(profileId) ? "id" : "kagaz_id";
      const { data, error } = await supabase
        .from("profiles")
        .select("*, profile_education(id, degree)")
        .eq(column, profileId)
        .maybeSingle();

      if (error) {
        console.error("Fetch visibility error:", error);
        setErrorMsg(error.message);
      } else if (data) {
        const computed = computeFilledFields(data as Record<string, unknown>);
        setFilledMap(computed);

        const merged = {
          ...DEFAULT_INDIVIDUAL_VISIBILITY,
          ...(data.public_visibility || {}),
        };
        (Object.keys(merged) as (keyof IndividualVisibility)[]).forEach((k) => {
          if (!computed[k]) {
            merged[k] = false;
          }
        });
        setVisibility(merged);
      }
      setLoading(false);
    }

    fetchVisibility();
  }, [isOpen, profileId]);

  const handleToggle = (key: keyof IndividualVisibility) => {
    if (!filledMap[key]) return;
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    setSavedSuccess(false);
    setErrorMsg(null);

    const column = isUuid(profileId) ? "id" : "kagaz_id";
    const { data, error } = await supabase
      .from("profiles")
      .update({ public_visibility: visibility })
      .eq(column, profileId)
      .select("id");

    setSaving(false);

    if (error) {
      console.error("Save visibility error:", error);
      setErrorMsg(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setErrorMsg(
        "Update blocked! Check Supabase RLS policy for 'profiles' table.",
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
                Public Profile Privacy
              </h3>
              <p className="text-[10.5px] sm:text-[11px] text-neutral-500 leading-snug">
                Control what visitors see when they scan your QR code
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
                Full Name, Profile Photo, SutraNet ID, Role/Title, Sector
              </strong>{" "}
              &amp; <strong>Verified Badge</strong> are core identity fields and
              cannot be hidden.{" "}
              <span className="text-neutral-500 italic">
                (Govt. Vault IDs are always strictly private.)
              </span>
            </p>
          </div>

          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
            </div>
          ) : (
            VISIBILITY_GROUPS.map((group) => (
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
