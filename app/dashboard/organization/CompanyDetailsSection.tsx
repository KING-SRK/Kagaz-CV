// app/dashboard/organization/CompanyDetailsSection.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  PhoneCall,
  MapPin,
  Package,
  ShieldCheck,
  Clock,
  ChevronRight,
  Sparkles,
  Pencil,
  X,
  Check,
  Loader2,
  Users,
  Briefcase,
  Award,
  FolderKanban,
  FileText,
} from "lucide-react";

import {
  getCompanyProfile,
  saveCompanyProfile,
  FullCompanyProfile,
} from "@/lib/organizationService";

// আমরা পরের ধাপে একে একে এই ট্যাব কম্পোনেন্টগুলো বানাবো
import OrgBasicTab from "./tabs/OrgBasicTab";
import OrgContactTab from "./tabs/OrgContactTab";
import OrgLocationTab from "./tabs/OrgLocationTab";
import OrgOfferingsTab from "./tabs/OrgOfferingsTab";
import OrgLegalTab from "./tabs/OrgLegalTab";
import OrgTeamTab from "./tabs/OrgTeamTab";
import OrgCareersTab from "./tabs/OrgCareersTab";
import OrgAchievementsTab from "./tabs/OrgAchievementsTab";
import OrgOperationsTab from "./tabs/OrgOperationsTab";
import OrgPortfolioTab from "./tabs/OrgPortfolioTab";
import OrgDocumentsTab from "./tabs/OrgDocumentsTab";

export default function CompanyDetailsSection() {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [profileId, setProfileId] = useState<string>("");

  const [company, setCompany] = useState<FullCompanyProfile>({
    profile_id: "",
    kagaz_id: "",
    company_name: "",
    logo_url: "",
    cover_url: "",
    business_type: "",
    industry: "",
    business_category: "",
    short_description: "",
    detailed_description: "",
    est_year: "",
    business_size: "",
    website: "",
    is_verified: false,
    contacts: [],
    branches: [],
    offerings: [],
    legal_info: { showGstin: false },
    team_members: [],
    achievements: [],
    operations: {
      openingDays: "Monday - Saturday",
      openingTime: "10:00",
      closingTime: "20:00",
      status: "Open",
      homeDelivery: false,
      onlineOrders: false,
      paymentMethods: ["UPI", "Cash"],
      serviceArea: "",
    },
    social_links: [],
    portfolio: [],
  });

  const [draft, setDraft] = useState<FullCompanyProfile>(company);

  useEffect(() => {
    async function loadCompany() {
      const activeId = localStorage.getItem("kagaz_active_id");
      if (!activeId) {
        setLoading(false);
        return;
      }

      const { data, error } = await getCompanyProfile(activeId);
      if (data && !error) {
        setProfileId(data.profile_id);
        setCompany(data);
        setDraft(data);
      }
      setLoading(false);
    }

    loadCompany();
  }, []);

  // ১২টি সেকশনকে ৫টি ক্লিন ও স্মার্ট ট্যাবে সাজানো হয়েছে
  const sections = [
    {
      id: "basic",
      title: "Basic Company Information",
      desc: "Company name, logo, business type, industry & social links.",
      icon: Building2,
    },
    {
      id: "contact",
      title: "Contact Information",
      desc: "Official emails, phone numbers, WhatsApp & department contacts.",
      icon: PhoneCall,
    },
    {
      id: "location",
      title: "Business Locations",
      desc: "Head office, branches, retail stores & Google Maps links.",
      icon: MapPin,
    },
    {
      id: "offerings",
      title: "Products & Services",
      desc: "Catalog of products, services, pricing & availability.",
      icon: Package,
    },
    {
      id: "legal",
      title: "Legal & Government Registration",
      desc: "GSTIN, PAN, CIN, Udyam, Trade/FSSAI licences & compliance.",
      icon: ShieldCheck,
    },
    {
      id: "team",
      title: "Company Team & Management",
      desc: "Founders, leadership team & verified SutraNet members.",
      icon: Users,
    },
    {
      id: "careers",
      title: "Careers & Job Vacancies",
      desc: "Job openings, job applications & interviews.",
      icon: Briefcase,
    },
    {
      id: "achievements",
      title: "Achievements & Certifications",
      desc: "Awards, certifications & recognitions.",
      icon: Award,
    },
    {
      id: "operations",
      title: "Business Operations",
      desc: "Opening hours, home delivery, online orders & payment methods.",
      icon: Clock,
    },
    {
      id: "portfolio",
      title: "Company Portfolio & Gallery",
      desc: "Showcase of company products & services.",
      icon: FolderKanban,
    },
    {
      id: "documents",
      title: "Company Profile Documents",
      desc: "Company profile, visiting card, business introduction & catalogue.",
      icon: FileText,
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setDraft(company);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);

    try {
      const res = await saveCompanyProfile(profileId, draft);
      if (res.success) {
        setCompany({ ...draft });
        setIsEditing(false);

        // ⚡ ওপরের স্মার্ট কার্ড রিয়েলটাইমে আপডেট করার ইভেন্ট
        window.dispatchEvent(
          new CustomEvent("company-updated", { detail: draft }),
        );
      }
    } catch (err) {
      console.error("Failed to save company details:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-neutral-200/80 bg-white p-12 text-center flex flex-col items-center justify-center gap-2 rounded-xs">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
        <span className="text-xs font-mono text-neutral-500">
          Loading organization workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200/80 bg-white shadow-xs select-none rounded-xs">
      {/* ১. সেকশন হেডার */}
      <div className="sticky top-16 z-20 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 p-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Organization Profile
          </span>
          <h2 className="text-xl font-serif text-neutral-950 mt-1">
            Business Identity, Offerings & Operations
          </h2>
        </div>

        {/* এডিট / সেভ বাটন */}
        <div className="flex items-center gap-3">
          {/* এডিট / সেভ বাটন (Careers ট্যাবে এটি হাইড থাকবে কারণ Careers-এর নিজস্ব ফর্ম আছে) */}
          {activeTab !== "careers" && activeTab !== "documents" && (
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setDraft(company);
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-neutral-300" />
                  <span>Edit Business Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(company);
                      setIsEditing(false);
                    }}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer shadow-xs"
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
          )}
        </div>
      </div>

      {/* ২. বাঁদিকের সাইডবার ও ডানদিকের কনটেন্ট */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-110">
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

        {/* ৩. ডানদিকের মূল ট্যাব এরিয়া */}
        <div className="md:col-span-8 p-6 sm:p-8 md:sticky md:top-40 self-start">
          {activeTab === "basic" && (
            <OrgBasicTab
              isEditing={isEditing}
              data={isEditing ? draft : company}
              onChange={(updated) =>
                setDraft((prev) => ({ ...prev, ...updated }))
              }
            />
          )}

          {activeTab === "contact" && (
            <OrgContactTab
              isEditing={isEditing}
              contacts={isEditing ? draft.contacts : company.contacts}
              website={isEditing ? draft.website : company.website}
              onChange={(updated) =>
                setDraft((prev) => ({ ...prev, ...updated }))
              }
            />
          )}

          {activeTab === "location" && (
            <OrgLocationTab
              isEditing={isEditing}
              branches={isEditing ? draft.branches : company.branches}
              onChange={(newBranches) =>
                setDraft((prev) => ({ ...prev, branches: newBranches }))
              }
            />
          )}

          {activeTab === "offerings" && (
            <OrgOfferingsTab
              isEditing={isEditing}
              offerings={isEditing ? draft.offerings : company.offerings}
              onChange={(newOfferings) =>
                setDraft((prev) => ({ ...prev, offerings: newOfferings }))
              }
            />
          )}

          {activeTab === "legal" && (
            <OrgLegalTab
              isEditing={isEditing}
              legalInfo={isEditing ? draft.legal_info : company.legal_info}
              onChange={(newLegal) =>
                setDraft((prev) => ({ ...prev, legal_info: newLegal }))
              }
            />
          )}

          {activeTab === "team" && (
            <OrgTeamTab
              isEditing={isEditing}
              teamMembers={
                isEditing ? draft.team_members : company.team_members
              }
              onChange={(newTeam) =>
                setDraft((prev) => ({ ...prev, team_members: newTeam }))
              }
            />
          )}

          {activeTab === "careers" && (
            <OrgCareersTab companyId={profileId} kagazId={company.kagaz_id} />
          )}

          {activeTab === "achievements" && (
            <OrgAchievementsTab
              isEditing={isEditing}
              achievements={
                isEditing ? draft.achievements : company.achievements
              }
              onChange={(newAchievements) =>
                setDraft((prev) => ({
                  ...prev,
                  achievements: newAchievements,
                }))
              }
            />
          )}

          {activeTab === "operations" && (
            <OrgOperationsTab
              isEditing={isEditing}
              operations={isEditing ? draft.operations : company.operations}
              onChange={(newOps) =>
                setDraft((prev) => ({ ...prev, operations: newOps }))
              }
            />
          )}

          {activeTab === "portfolio" && (
            <OrgPortfolioTab
              isEditing={isEditing}
              portfolio={isEditing ? draft.portfolio : company.portfolio}
              onChange={(newPortfolio) =>
                setDraft((prev) => ({ ...prev, portfolio: newPortfolio }))
              }
            />
          )}

          {activeTab === "documents" && (
            <OrgDocumentsTab company={isEditing ? draft : company} />
          )}
        </div>
      </div>
    </div>
  );
}
