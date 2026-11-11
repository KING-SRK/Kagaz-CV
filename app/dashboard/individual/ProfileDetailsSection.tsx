// app/dashboard/individual/ProfileDetailsSection.tsx
"use client";

import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Pencil,
  X,
  Check,
  Users,
  Loader2,
} from "lucide-react";

import FamilyTab from "./tabs/FamilyTab";
import AboutTab from "./tabs/AboutTab";
import LocationTab from "./tabs/LocationTab";
import EducationTab from "./tabs/EducationTab";
import SkillsTab from "./tabs/SkillsTab";
import GovtVaultTab from "./tabs/GovtVaultTab";
import { SocialLink } from "./tabs/components/DynamicSocialLinks";

import {
  getIndividualProfile,
  updateCoreProfile,
  saveEducation,
  saveGovtVault,
  FullIndividualProfile,
  EducationItem,
  FamilyItem,
  LocationItem,
} from "@/lib/individualService";

export default function ProfileDetailsSection() {
  const [activeTab, setActiveTab] = useState<string>("about");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  // সেন্ট্রাল প্রোফাইল স্টেট
  const [profile, setProfile] = useState<FullIndividualProfile>({
    id: "",
    kagaz_id: "",
    role: "individual",
    full_name: "",
    title: "",
    sector: "",
    skills: [],
    email: "",
    phone: "",
    avatar_url: "",
    bio: "",
    dob: "",
    gender: "",
    blood_group: "",
    nationality: "",
    languages: "",
    card_theme: "duo_split",
    is_verified: false,
    profile_education: [],
    profile_family: [],
    profile_locations: [],
    profile_vault: [],
    social_links: [],
  });

  // ড্রাফট স্টেট
  const [draft, setDraft] = useState<FullIndividualProfile>(profile);

  useEffect(() => {
    async function loadData() {
      const activeId = localStorage.getItem("kagaz_active_id");
      if (!activeId) {
        setLoading(false);
        return;
      }
      setUserId(activeId);

      const { data, error } = await getIndividualProfile(activeId);
      if (data && !error) {
        setProfile(data);
        setDraft(data);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // বাঁদিকের মেনু সেকশনসমূহ (টাইটেল ও নির্দিষ্ট বিবরণসহ)
  const sections = [
    {
      id: "about",
      title: "Personal Details",
      desc: "Bio, birth details, blood group & contact info.",
      icon: User,
    },
    {
      id: "skills",
      title: "Skills & Work",
      desc: "Work sector, role headline & core expertise.",
      icon: Briefcase,
    },
    {
      id: "education",
      title: "Education",
      desc: "Degrees, institutions, session years & status.",
      icon: GraduationCap,
    },
    {
      id: "location",
      title: "Address & Map",
      desc: "Residential address & Google Maps GPS location.",
      icon: MapPin,
    },
    {
      id: "family",
      title: "Family Details",
      desc: "Parents, siblings & emergency contact info.",
      icon: Users,
    },
    {
      id: "vault",
      title: "Government IDs",
      desc: "Official IDs & documents for identity verification.",
      icon: ShieldCheck,
    },
  ];

  // ট্যাব পরিবর্তনের সময় ড্রাফট রিসেট এবং এডিট মোড বন্ধ করা (অপশন ১)
  const handleTabChange = (newTabId: string) => {
    setActiveTab(newTabId);
    setDraft(profile);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("No userId found in localStorage!");
      return;
    }
    setSaving(true);

    try {
      const primaryLoc = draft.profile_locations?.[0] || {};

      const coreUpdates: Partial<FullIndividualProfile> = {
        avatar_url: draft.avatar_url || "",
        full_name: draft.full_name || "",
        title: draft.title || "",
        sector: draft.sector || "",
        bio: draft.bio || "",
        dob: draft.dob || "",
        gender: draft.gender || "",
        blood_group: draft.blood_group || "",
        nationality: draft.nationality || "",
        languages: draft.languages || "",
        skills: Array.isArray(draft.skills) ? draft.skills : [],
        social_links: draft.social_links || [],

        address_line: primaryLoc.address_line || "",
        city: primaryLoc.city || "",
        state: primaryLoc.state || "",
        pincode: primaryLoc.pincode || "",
        country: primaryLoc.country || "India",

        family: draft.profile_family || [],
      };

      const coreRes = await updateCoreProfile(userId, coreUpdates);
      if (coreRes?.error) {
        console.error("Core Profile Save Error:", coreRes.error);
      }

      if (draft.profile_education) {
        const eduRes = await saveEducation(userId, draft.profile_education);
        if (eduRes?.error) console.error("Education Save Error:", eduRes.error);
      }

      if (draft.profile_vault && draft.profile_vault.length > 0) {
        const vaultRes = await saveGovtVault(userId, draft.profile_vault);
        if (vaultRes?.error) console.error("Vault Save Error:", vaultRes.error);
      }

      setProfile({ ...draft });
      setIsEditing(false);

      window.dispatchEvent(
        new CustomEvent("profile-updated", { detail: draft }),
      );
    } catch (err) {
      console.error("Unexpected Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-neutral-200/80 bg-white p-12 text-center flex flex-col items-center justify-center gap-2 rounded-xs">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
        <span className="text-xs font-mono text-neutral-500">
          Loading SutraNet profile details...
        </span>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200/80 bg-white shadow-xs select-none rounded-xs">
      {/* ১. সেকশন হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 p-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Profile Details
          </span>
          <h2 className="text-xl font-serif text-neutral-950 mt-1">
            Personal & Work Information
          </h2>
        </div>

        {/* এডিট / সেভ কন্ট্রোল */}
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-neutral-300" />
              <span>Edit Details</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-1.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-110">
        {/* ২. বাঁদিকের সাইডবার ট্যাব লিস্ট */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-neutral-100 bg-neutral-50/40 p-3 space-y-1.5">
          {sections.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-start justify-between p-3.5 text-left transition-colors duration-150 rounded-xs cursor-pointer outline-none border ${
                  isActive
                    ? "bg-white text-neutral-950 shadow-xs border-neutral-200/80"
                    : "bg-transparent border-transparent text-neutral-500 hover:bg-neutral-100/60 hover:text-neutral-900"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2 rounded shrink-0 mt-0.5 ${
                      isActive
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-200/60 text-neutral-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`text-xs font-mono uppercase tracking-wider block ${
                        isActive ? "font-bold text-neutral-950" : "font-medium"
                      }`}
                    >
                      {item.title}
                    </span>
                    <p className="text-[11px] font-sans text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 mt-1 transition-transform ${
                    isActive
                      ? "translate-x-0.5 text-neutral-950"
                      : "text-neutral-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ৩. ডানদিকের মূল কনটেন্ট এরিয়া */}
        <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
          <div className="min-h-80">
            {activeTab === "about" && (
              <AboutTab
                isEditing={isEditing}
                data={{
                  avatarUrl: isEditing ? draft.avatar_url : profile.avatar_url,
                  fullName: isEditing ? draft.full_name : profile.full_name,
                  headline: isEditing ? draft.title : profile.title,
                  dob: isEditing ? draft.dob : profile.dob,
                  gender: isEditing ? draft.gender : profile.gender,
                  bloodGroup: isEditing
                    ? draft.blood_group
                    : profile.blood_group,
                  nationality: isEditing
                    ? draft.nationality
                    : profile.nationality,
                  languages: isEditing ? draft.languages : profile.languages,
                  bio: isEditing ? draft.bio : profile.bio,
                  socialLinks: isEditing
                    ? draft.social_links || []
                    : profile.social_links || [],
                }}
                onChange={(updated) =>
                  setDraft((prev) => ({
                    ...prev,
                    ...(updated.avatarUrl !== undefined && {
                      avatar_url: updated.avatarUrl,
                    }),
                    ...(updated.fullName !== undefined && {
                      full_name: updated.fullName,
                    }),
                    ...(updated.headline !== undefined && {
                      title: updated.headline,
                    }),
                    ...(updated.dob !== undefined && { dob: updated.dob }),
                    ...(updated.gender !== undefined && {
                      gender: updated.gender,
                    }),
                    ...(updated.bloodGroup !== undefined && {
                      blood_group: updated.bloodGroup,
                    }),
                    ...(updated.nationality !== undefined && {
                      nationality: updated.nationality,
                    }),
                    ...(updated.languages !== undefined && {
                      languages: updated.languages,
                    }),
                    ...(updated.bio !== undefined && { bio: updated.bio }),
                    ...(updated.socialLinks !== undefined && {
                      social_links: updated.socialLinks as SocialLink[],
                    }),
                  }))
                }
              />
            )}

            {activeTab === "skills" && (
              <SkillsTab
                isEditing={isEditing}
                skills={isEditing ? draft.skills || [] : profile.skills || []}
                onChange={(newSkills: string[]) =>
                  setDraft((prev) => ({
                    ...prev,
                    skills: newSkills,
                  }))
                }
                sector={isEditing ? draft.sector : profile.sector}
                onSectorChange={(sector: string) =>
                  setDraft((prev) => ({ ...prev, sector }))
                }
                roleTitle={isEditing ? draft.title : profile.title}
                onRoleTitleChange={(title: string) =>
                  setDraft((prev) => ({ ...prev, title }))
                }
              />
            )}

            {activeTab === "education" && (
              <EducationTab
                isEditing={isEditing}
                educationList={
                  isEditing
                    ? draft.profile_education
                    : profile.profile_education
                }
                onChange={(newList: EducationItem[]) =>
                  setDraft((prev) => ({ ...prev, profile_education: newList }))
                }
              />
            )}

            {activeTab === "location" && (
              <LocationTab
                isEditing={isEditing}
                locations={
                  isEditing
                    ? draft.profile_locations
                    : profile.profile_locations
                }
                onChange={(newLocations: LocationItem[]) =>
                  setDraft((prev) => ({
                    ...prev,
                    profile_locations: newLocations,
                  }))
                }
              />
            )}

            {activeTab === "family" && (
              <FamilyTab
                isEditing={isEditing}
                familyList={
                  isEditing ? draft.profile_family : profile.profile_family
                }
                onChange={(newList: FamilyItem[]) =>
                  setDraft((prev) => ({ ...prev, profile_family: newList }))
                }
              />
            )}

            {activeTab === "vault" && (
              <GovtVaultTab
                isEditing={isEditing}
                vaultList={
                  (isEditing
                    ? draft.profile_vault
                    : profile.profile_vault
                  )?.map((v) => ({
                    id: v.id,
                    docType: v.doc_type,
                    docNumber: v.doc_number,
                  })) || []
                }
                onChange={(newList) =>
                  setDraft((prev) => ({
                    ...prev,
                    profile_vault: newList.map((item) => ({
                      id: item.id,
                      doc_type: item.docType,
                      doc_number: item.docNumber,
                    })),
                  }))
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
