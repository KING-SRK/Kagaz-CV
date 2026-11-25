// app/dashboard/individual/ProfileDetailsSection.tsx
"use client";

import { useEffect, useState, useRef } from "react";
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
  Building2,
  FolderGit2,
  Award,
  Target,
} from "lucide-react";

import FamilyTab from "./tabs/FamilyTab";
import AboutTab from "./tabs/AboutTab";
import LocationTab from "./tabs/LocationTab";
import EducationTab from "./tabs/EducationTab";
import SkillsTab from "./tabs/SkillsTab";
import GovtVaultTab from "./tabs/GovtVaultTab";
import CareerPreferencesTab from "./tabs/CareerPreferencesTab";
import ExperienceTab, { ExperienceItem } from "./tabs/ExperienceTab";
import ProjectsTab, { ProjectItem } from "./tabs/ProjectsTab";
import CredentialsTab, {
  CertificationItem,
  AchievementItem,
  ReferenceItem,
} from "./tabs/CredentialsTab";

import { SocialLink } from "./tabs/_components/DynamicSocialLinks";

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

export interface ExtendedIndividualProfile extends FullIndividualProfile {
  interests?: string[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  references_list?: ReferenceItem[];
}

export default function ProfileDetailsSection() {
  const [activeTab, setActiveTab] = useState<string>("about");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  const contentAreaRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<ExtendedIndividualProfile>({
    id: "",
    kagaz_id: "",
    role: "individual",
    full_name: "",
    title: "",
    sector: "",
    skills: [],
    interests: [],
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
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    references_list: [],
  });

  const [draft, setDraft] = useState<ExtendedIndividualProfile>(profile);

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
        setProfile(data as ExtendedIndividualProfile);
        setDraft(data as ExtendedIndividualProfile);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const sections = [
    {
      id: "about",
      shortTitle: "Personal",
      title: "Personal Details",
      desc: "Summary, birth details, languages & social links.",
      icon: User,
    },
    {
      id: "family",
      shortTitle: "Family",
      title: "Family Details",
      desc: "Parents, siblings & emergency contact info.",
      icon: Users,
    },
    {
      id: "location",
      shortTitle: "Address",
      title: "Address & Map",
      desc: "Residential address & Google Maps GPS location.",
      icon: MapPin,
    },
    {
      id: "education",
      shortTitle: "Education",
      title: "Education",
      desc: "Degrees, institutions, session years & status.",
      icon: GraduationCap,
    },
    {
      id: "credentials",
      shortTitle: "Honors",
      title: "Honors & References",
      desc: "Certifications, achievements & professional refs.",
      icon: Award,
    },
    {
      id: "skills",
      shortTitle: "Skills",
      title: "Skills & Interests",
      desc: "Work sector, core skills & personal hobbies.",
      icon: Briefcase,
    },
    {
      id: "projects",
      shortTitle: "Projects",
      title: "Projects & Portfolio",
      desc: "Showcase live projects, tech stack & images.",
      icon: FolderGit2,
    },
    {
      id: "experience",
      shortTitle: "Work",
      title: "Work History",
      desc: "Employment history, companies & responsibilities.",
      icon: Building2,
    },
    {
      id: "preferences",
      shortTitle: "Careers",
      title: "Career Preferences",
      desc: "Open to work, freelance availability, preferred role & location.",
      icon: Target,
    },
    {
      id: "vault",
      shortTitle: "Govt IDs",
      title: "Government Authorized Documents",
      desc: "Official IDs & important personal documents.",
      icon: ShieldCheck,
    },
  ];

  const handleTabChange = (newTabId: string) => {
    setActiveTab(newTabId);
    setDraft(profile);
    setIsEditing(false);

    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      contentAreaRef.current
    ) {
      const yOffset = -120;
      const y =
        contentAreaRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
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
    if (!userId) return;
    setSaving(true);

    try {
      const primaryLoc = draft.profile_locations?.[0] || {};

      const coreUpdates: Partial<ExtendedIndividualProfile> = {
        avatar_url: draft.avatar_url || "",
        full_name: draft.full_name || "",
        title: draft.title || "",
        phone: draft.phone || "",
        sector: draft.sector || "",
        bio: draft.bio || "",
        dob: draft.dob || "",
        gender: draft.gender || "",
        blood_group: draft.blood_group || "",
        nationality: draft.nationality || "",
        languages: draft.languages || "",
        skills: Array.isArray(draft.skills) ? draft.skills : [],
        interests: Array.isArray(draft.interests) ? draft.interests : [],
        social_links: draft.social_links || [],
        experience: draft.experience || [],
        projects: draft.projects || [],
        certifications: draft.certifications || [],
        achievements: draft.achievements || [],
        references_list: draft.references_list || [],
        career_preferences: draft.career_preferences,
        address_line: primaryLoc.address_line || "",
        city: primaryLoc.city || "",
        state: primaryLoc.state || "",
        pincode: primaryLoc.pincode || "",
        country: primaryLoc.country || "India",
        family: draft.profile_family || [],
      };

      await updateCoreProfile(userId, coreUpdates);

      if (draft.profile_education) {
        await saveEducation(userId, draft.profile_education);
      }

      if (draft.profile_vault && draft.profile_vault.length > 0) {
        await saveGovtVault(userId, draft.profile_vault);
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
      <div className="border border-neutral-200/80 bg-white p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-2 rounded-xs">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
        <span className="text-xs font-mono text-neutral-500">
          Loading SutraNet profile details...
        </span>
      </div>
    );
  }

  const activeSection = sections.find((s) => s.id === activeTab);

  const renderActionButtons = (isMobile = false) => {
    if (!isEditing) {
      return (
        <button
          type="button"
          onClick={handleStartEdit}
          className={`${
            isMobile ? "w-full justify-center py-2.5" : "px-4 py-2"
          } inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-2xs`}
        >
          <Pencil className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
          <span>Edit {isMobile ? activeSection?.shortTitle : "Details"}</span>
        </button>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${isMobile ? "w-full" : ""}`}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className={`${
            isMobile ? "flex-1 justify-center py-2.5" : "px-3.5 py-2"
          } inline-flex items-center gap-1.5 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50`}
        >
          <X className="h-3.5 w-3.5 shrink-0" />
          <span>Cancel</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`${
            isMobile ? "flex-1 justify-center py-2.5" : "px-4 py-2"
          } inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50`}
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          ) : (
            <Check className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{saving ? "Saving..." : "Save"}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="border border-neutral-200/80 bg-white shadow-xs select-none rounded-xs">
      {/* ১. সেকশন হেডার */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-100 p-4 sm:p-6 md:sticky md:top-20 z-20 bg-white">
        <div className="min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 shrink-0" /> Profile Details
          </span>
          <h2 className="text-lg sm:text-xl font-serif text-neutral-950 mt-0.5 sm:mt-1 truncate">
            Personal, Career & Portfolio Information
          </h2>
        </div>

        {/* 💻 শুধুমাত্র ডেস্কটপে হেডারের ডানদিকে বাটন থাকবে */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {renderActionButtons(false)}
        </div>
      </div>

      {/* 📱 ২. মোবাইল ও ট্যাবলেট স্টিকি কমপ্যাক্ট হরাইজন্টাল ট্যাব বার (< md) */}
      <div className="md:hidden sticky top-16 z-10 border-b border-neutral-200/80 bg-neutral-50/90 backdrop-blur-xs px-3 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 w-max">
          {sections.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xs text-[11px] font-mono uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-neutral-950 text-white border-neutral-950 font-bold shadow-2xs"
                    : "bg-white text-neutral-600 border-neutral-200/90 hover:border-neutral-400"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? "text-emerald-400" : "text-neutral-500"
                  }`}
                />
                <span>{item.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 💻 ৩. ডেস্কটপ সাইডবার + ডানদিকের কনটেন্ট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:min-h-110">
        {/* ডেস্কটপ বাম সাইডবার */}
        <div className="hidden md:block md:col-span-4 border-r border-neutral-100 bg-neutral-50/40 p-3 space-y-1.5">
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

        {/* ৪. ডানদিকের মূল কনটেন্ট এরিয়া */}
        <div
          ref={contentAreaRef}
          className="md:col-span-8 p-4 sm:p-6 md:p-8 flex flex-col justify-between md:sticky md:top-44 self-start w-full min-w-0"
        >
          {/* 📱 মোবাইলে ট্যাব বারের ঠিক নিচে ফুল-উইডথ ক্লিন Edit / Save অ্যাকশন বার */}
          <div className="md:hidden pb-4 mb-4 border-b border-neutral-100">
            {renderActionButtons(true)}
          </div>

          <div className="min-h-70 sm:min-h-80 w-full min-w-0">
            {activeTab === "about" && (
              <AboutTab
                isEditing={isEditing}
                data={{
                  avatarUrl: isEditing ? draft.avatar_url : profile.avatar_url,
                  fullName: isEditing ? draft.full_name : profile.full_name,
                  headline: isEditing ? draft.title : profile.title,
                  phone: isEditing ? draft.phone : profile.phone,
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
                    ...(updated.phone !== undefined && {
                      phone: updated.phone,
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
                  setDraft((prev) => ({ ...prev, skills: newSkills }))
                }
                interests={
                  isEditing ? draft.interests || [] : profile.interests || []
                }
                onInterestsChange={(newInterests: string[]) =>
                  setDraft((prev) => ({ ...prev, interests: newInterests }))
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

            {activeTab === "preferences" && (
              <CareerPreferencesTab
                isEditing={isEditing}
                preferences={
                  isEditing
                    ? draft.career_preferences
                    : profile.career_preferences
                }
                onChange={(updatedPrefs) =>
                  setDraft((prev) => ({
                    ...prev,
                    career_preferences: updatedPrefs,
                  }))
                }
              />
            )}

            {activeTab === "experience" && (
              <ExperienceTab
                isEditing={isEditing}
                experienceList={
                  isEditing ? draft.experience || [] : profile.experience || []
                }
                onChange={(newList: ExperienceItem[]) =>
                  setDraft((prev) => ({ ...prev, experience: newList }))
                }
              />
            )}

            {activeTab === "projects" && (
              <ProjectsTab
                isEditing={isEditing}
                projectsList={
                  isEditing ? draft.projects || [] : profile.projects || []
                }
                onChange={(newList: ProjectItem[]) =>
                  setDraft((prev) => ({ ...prev, projects: newList }))
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

            {activeTab === "credentials" && (
              <CredentialsTab
                isEditing={isEditing}
                certifications={
                  isEditing
                    ? draft.certifications || []
                    : profile.certifications || []
                }
                achievements={
                  isEditing
                    ? draft.achievements || []
                    : profile.achievements || []
                }
                references={
                  isEditing
                    ? draft.references_list || []
                    : profile.references_list || []
                }
                onChange={(updated: {
                  certifications?: CertificationItem[];
                  achievements?: AchievementItem[];
                  references?: ReferenceItem[];
                }) =>
                  setDraft((prev) => ({
                    ...prev,
                    ...(updated.certifications && {
                      certifications: updated.certifications,
                    }),
                    ...(updated.achievements && {
                      achievements: updated.achievements,
                    }),
                    ...(updated.references && {
                      references_list: updated.references,
                    }),
                  }))
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
