// app/dashboard/organization/tabs/OrgAchievementsTab.tsx
"use client";

import { useEffect } from "react";
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  Building,
  Hash,
} from "lucide-react";
import { OrgAchievementItem } from "@/lib/organizationService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import {
  ACHIEVEMENT_CATEGORIES,
  formatOtherDisplay,
} from "@/constants/orgOptions";

interface Props {
  isEditing: boolean;
  achievements: OrgAchievementItem[];
  onChange: (newAchievements: OrgAchievementItem[]) => void;
}

const createDefaultAchievement = (): OrgAchievementItem => ({
  id: Date.now().toString(),
  title: "",
  category: "",
  issuer: "",
  date: "",
  description: "",
  certificationId: "",
  verificationUrl: "",
  isVerified: false,
});

export default function OrgAchievementsTab({
  isEditing,
  achievements = [],
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing && achievements.length === 0) {
      onChange([createDefaultAchievement()]);
    }
  }, [isEditing, achievements.length, onChange]);

  const addAchievement = () => {
    onChange([...achievements, createDefaultAchievement()]);
  };

  const updateAchievement = (
    id: string,
    field: keyof OrgAchievementItem,
    val: string,
  ) => {
    onChange(
      achievements.map((item) =>
        item.id === id ? { ...item, [field]: val } : item,
      ),
    );
  };

  const removeAchievement = (id: string) => {
    onChange(achievements.filter((item) => item.id !== id));
  };

  const displayItems =
    achievements.length > 0 ? achievements : [createDefaultAchievement()];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
            <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="truncate">
              Achievements & Certifications ({displayItems.length})
            </span>
          </span>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {displayItems.map((item, idx) => {
            const categoryLabel = formatOtherDisplay(item.category);

            return (
              <div
                key={item.id}
                className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3 sm:space-y-3.5"
              >
                {/* কার্ড হেডার */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2 sm:pb-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                      Credential #{idx + 1}
                    </span>

                    {item.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase rounded-xs shrink-0">
                        <CheckCircle2 className="h-3 w-3 shrink-0" /> Verified
                        Claim
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-mono uppercase rounded-xs shrink-0">
                        <ShieldAlert className="h-3 w-3 shrink-0" />{" "}
                        Self-Declared
                      </span>
                    )}
                  </div>

                  {item.verificationUrl ? (
                    <a
                      href={item.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-[10px] sm:text-[10.5px] font-mono uppercase text-neutral-900 rounded-xs shrink-0 transition-colors"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                      Verification URL: Not Set
                    </span>
                  )}
                </div>

                {/* রো ১: Award Name, Category, Awarding Organisation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Award / Certification Name
                    </span>
                    <p
                      className={`font-medium truncate ${
                        item.title ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {item.title || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Recognition Type
                    </span>
                    <p
                      className={`font-medium truncate ${
                        categoryLabel ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {categoryLabel || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                      <Building className="h-3 w-3 shrink-0" /> Awarding
                      Organisation
                    </span>
                    <p
                      className={`font-medium truncate ${
                        item.issuer ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {item.issuer || "Not Set"}
                    </p>
                  </div>
                </div>

                {/* রো ২: Award Date & Certification ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                      <Calendar className="h-3 w-3 shrink-0" /> Award / Issue
                      Date
                    </span>
                    <p
                      className={`font-medium truncate ${
                        item.date ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {item.date || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                      <Hash className="h-3 w-3 shrink-0" /> Certification ID
                    </span>
                    <p
                      className={`font-medium truncate ${
                        item.certificationId
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }`}
                    >
                      {item.certificationId || "Not Set"}
                    </p>
                  </div>
                </div>

                {/* রো ৩: Achievement Description */}
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs text-xs">
                  <span className="text-[9.5px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Achievement Description
                  </span>
                  <p
                    className={`leading-relaxed wrap-break-word ${
                      item.description
                        ? "text-neutral-700"
                        : "text-neutral-400 font-mono"
                    }`}
                  >
                    {item.description || "Not Set"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      {/* হেডার ও নতুন অ্যাওয়ার্ড যোগ করার বাটন */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
            Achievements & Certifications ({displayItems.length})
          </span>
          <span className="text-[11px] font-sans text-neutral-500">
            Add ISO certifications, startup recognitions, awards, or memberships
            with verification URLs.
          </span>
        </div>
        <button
          type="button"
          onClick={addAchievement}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Credential
        </button>
      </div>

      {/* ভেরিফিকেশন পলিসি নোট */}
      <div className="p-3 bg-neutral-100/80 border border-neutral-200 rounded-xs flex items-start gap-2.5 text-[11px] font-sans text-neutral-700">
        <ShieldAlert className="h-4 w-4 text-neutral-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          All newly added awards and certifications appear as{" "}
          <strong>Self-Declared</strong> until SutraNet verifies the credential
          ID and official verification URL.
        </p>
      </div>

      {/* প্রতিটি অ্যাওয়ার্ড ফর্ম কার্ড */}
      <div className="space-y-3.5 sm:space-y-4">
        {displayItems.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5"
          >
            {/* কার্ড হেডার */}
            <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
              <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                Credential #{idx + 1}
              </span>

              {displayItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAchievement(item.id)}
                  title="Remove Credential"
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* রো ১: Award Name, Category, Awarding Organisation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <FormInput
                label="Award / Certification Name"
                value={item.title}
                onChange={(val) => updateAchievement(item.id, "title", val)}
                placeholder="Enter your award or certification name"
              />

              <FormSelectWithOther
                label="Recognition Category"
                value={item.category || ""}
                options={ACHIEVEMENT_CATEGORIES}
                placeholder="Select category"
                otherPlaceholder="Enter custom recognition type"
                onChange={(val) => updateAchievement(item.id, "category", val)}
              />

              <FormInput
                label="Awarding Organisation"
                value={item.issuer}
                onChange={(val) => updateAchievement(item.id, "issuer", val)}
                placeholder="Enter awarding organisation name"
              />
            </div>

            {/* রো ২: Award Date, Certification ID & Certificate Verification URL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormInput
                label="Award Date"
                type="date"
                value={item.date}
                onChange={(val) => updateAchievement(item.id, "date", val)}
              />

              <FormInput
                label="Certification ID"
                value={item.certificationId || ""}
                onChange={(val) =>
                  updateAchievement(item.id, "certificationId", val)
                }
                placeholder="Enter certification or credential ID"
              />

              <FormInput
                label="Certificate Verification URL"
                type="url"
                value={item.verificationUrl || ""}
                onChange={(val) =>
                  updateAchievement(item.id, "verificationUrl", val)
                }
                placeholder="Enter official certificate verification URL"
              />
            </div>

            {/* রো ৩: Achievement Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Achievement Description
              </label>
              <textarea
                rows={2}
                value={item.description || ""}
                onChange={(e) =>
                  updateAchievement(item.id, "description", e.target.value)
                }
                placeholder="Enter details about this achievement or certification"
                className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
