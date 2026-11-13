// app/dashboard/individual/tabs/CareerPreferencesTab.tsx
"use client";

import {
  Briefcase,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { FormInput } from "@/components/ui/FormFields";

export interface CareerPreferences {
  lookingForJob: boolean;
  availableForFreelance: boolean;
  preferredRoles: string[];
  preferredEmploymentTypes: string[];
  preferredWorkModes: string[];
  preferredLocations: string;
  noticePeriod: string;
  expectedSalary?: string;
  showSalaryPublicly?: boolean;
}

interface Props {
  isEditing: boolean;
  preferences?: CareerPreferences;
  onChange: (updated: CareerPreferences) => void;
}

const EMPLOYMENT_OPTIONS = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
];

const WORK_MODE_OPTIONS = ["On-site", "Hybrid", "Remote"];

const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "15 Days",
  "1 Month",
  "2 Months",
  "3 Months",
];

export default function CareerPreferencesTab({
  isEditing,
  preferences,
  onChange,
}: Props) {
  const prefs: CareerPreferences = {
    lookingForJob: Boolean(preferences?.lookingForJob),
    availableForFreelance: Boolean(preferences?.availableForFreelance),
    preferredRoles: preferences?.preferredRoles || [],
    preferredEmploymentTypes: preferences?.preferredEmploymentTypes || [],
    preferredWorkModes: preferences?.preferredWorkModes || [],
    preferredLocations: preferences?.preferredLocations || "",
    noticePeriod: preferences?.noticePeriod || "Immediate",
    expectedSalary: preferences?.expectedSalary || "",
    showSalaryPublicly: Boolean(preferences?.showSalaryPublicly),
  };

  const updateField = <K extends keyof CareerPreferences>(
    field: K,
    value: CareerPreferences[K],
  ) => {
    onChange({
      ...prefs,
      [field]: value,
    });
  };

  const toggleMultiOption = (
    field: "preferredEmploymentTypes" | "preferredWorkModes",
    option: string,
  ) => {
    const current = prefs[field];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    updateField(field, updated);
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-5">
        {/* হেডার ও লাইভ স্ট্যাটাস ব্যাজ */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
            Career & Opportunity Preferences
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-xs border ${
                prefs.lookingForJob
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-neutral-100 text-neutral-500 border-neutral-200"
              }`}
            >
              {prefs.lookingForJob ? (
                <>
                  <CheckCircle2 className="h-3 w-3" /> Open to Work
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" /> Not Looking for Job
                </>
              )}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-xs border ${
                prefs.availableForFreelance
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-neutral-100 text-neutral-500 border-neutral-200"
              }`}
            >
              {prefs.availableForFreelance ? (
                <>
                  <Sparkles className="h-3 w-3" /> Available for Freelance
                </>
              ) : (
                "No Freelance"
              )}
            </span>
          </div>
        </div>

        {/* মূল তথ্য কার্ড */}
        <div className="p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5">
          {/* রো ১: Preferred Job Roles */}
          <div className="p-3 bg-white border border-neutral-200/80 rounded-xs">
            <span className="text-[9.5px] font-mono uppercase text-neutral-400 block mb-1.5">
              Preferred Job Roles / Target Positions
            </span>
            {prefs.preferredRoles.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {prefs.preferredRoles.map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-0.5 bg-neutral-900 text-white text-[11px] font-mono rounded-xs"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-neutral-400">Not Set</p>
            )}
          </div>

          {/* রো ২: Employment Type & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-3 bg-white border border-neutral-200/80 rounded-xs">
              <span className="text-[9.5px] uppercase text-neutral-400 block mb-1.5">
                Preferred Employment Type
              </span>
              {prefs.preferredEmploymentTypes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {prefs.preferredEmploymentTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10.5px] rounded-xs"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400">Not Set</p>
              )}
            </div>

            <div className="p-3 bg-white border border-neutral-200/80 rounded-xs">
              <span className="text-[9.5px] uppercase text-neutral-400 block mb-1.5">
                Preferred Work Mode
              </span>
              {prefs.preferredWorkModes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {prefs.preferredWorkModes.map((mode) => (
                    <span
                      key={mode}
                      className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10.5px] rounded-xs"
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400">Not Set</p>
              )}
            </div>
          </div>

          {/* রো ৩: Preferred Location, Notice Period & Expected Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
              <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                <MapPin className="h-3 w-3" /> Preferred Work Location
              </span>
              <p
                className={`font-medium truncate ${
                  prefs.preferredLocations
                    ? "text-neutral-900"
                    : "text-neutral-400"
                }`}
              >
                {prefs.preferredLocations || "Not Set"}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
              <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                <Clock className="h-3 w-3" /> Notice Period / Availability
              </span>
              <p className="font-medium text-neutral-900 truncate">
                {prefs.noticePeriod || "Immediate"}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  Expected Compensation
                </span>
                <p
                  className={`font-medium truncate ${
                    prefs.expectedSalary
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {prefs.expectedSalary || "Not Set"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] uppercase rounded-xs border shrink-0 ${
                  prefs.showSalaryPublicly
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {prefs.showSalaryPublicly ? (
                  <>
                    <Eye className="h-2.5 w-2.5" /> Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-2.5 w-2.5" /> Private
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-5">
      <div>
        <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
          Career & Opportunity Preferences
        </span>
        <span className="text-[11px] font-sans text-neutral-500">
          Let companies and recruiters know if you are open to full-time roles
          or freelance projects.
        </span>
      </div>

      <div className="p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-4">
        {/* রো ১: Looking for Employment & Available for Freelance টগল */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Looking for Employment
            </label>
            <select
              value={prefs.lookingForJob ? "Yes" : "No"}
              onChange={(e) =>
                updateField("lookingForJob", e.target.value === "Yes")
              }
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
            >
              <option value="No">No (Not Actively Looking)</option>
              <option value="Yes">Yes (Open to Work)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Available for Freelance Work
            </label>
            <select
              value={prefs.availableForFreelance ? "Yes" : "No"}
              onChange={(e) =>
                updateField("availableForFreelance", e.target.value === "Yes")
              }
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
            >
              <option value="No">No</option>
              <option value="Yes">Yes (Open for Freelance Projects)</option>
            </select>
          </div>
        </div>

        {/* রো ২: Preferred Job Roles (Comma Separated) */}
        <FormInput
          label="Preferred Job Roles (Comma separated)"
          value={prefs.preferredRoles.join(", ")}
          onChange={(val) =>
            updateField(
              "preferredRoles",
              val
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean),
            )
          }
          placeholder="Enter your preferred job roles"
        />

        {/* রো ৩: Preferred Employment Type (Multi-select Pills) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase text-neutral-500">
            Preferred Employment Type (Click to select)
          </label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_OPTIONS.map((opt) => {
              const selected = prefs.preferredEmploymentTypes.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    toggleMultiOption("preferredEmploymentTypes", opt)
                  }
                  className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-colors cursor-pointer ${
                    selected
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {selected ? `✓ ${opt}` : opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* রো ৪: Preferred Work Mode (Multi-select Pills) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase text-neutral-500">
            Preferred Work Mode (Click to select)
          </label>
          <div className="flex flex-wrap gap-2">
            {WORK_MODE_OPTIONS.map((mode) => {
              const selected = prefs.preferredWorkModes.includes(mode);
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => toggleMultiOption("preferredWorkModes", mode)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-colors cursor-pointer ${
                    selected
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {selected ? `✓ ${mode}` : mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* রো ৫: Preferred Location, Notice Period & Expected Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
          <FormInput
            label="Preferred Work Location"
            value={prefs.preferredLocations}
            onChange={(val) => updateField("preferredLocations", val)}
            placeholder="Enter your preferred cities or states"
          />

          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Notice Period / Availability
            </label>
            <select
              value={prefs.noticePeriod}
              onChange={(e) => updateField("noticePeriod", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
            >
              {NOTICE_PERIOD_OPTIONS.map((np) => (
                <option key={np} value={np}>
                  {np}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <FormInput
              label="Expected Salary (Optional)"
              value={prefs.expectedSalary || ""}
              onChange={(val) => updateField("expectedSalary", val)}
              placeholder="Enter your expected compensation"
            />
            <button
              type="button"
              onClick={() =>
                updateField("showSalaryPublicly", !prefs.showSalaryPublicly)
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs border cursor-pointer ${
                prefs.showSalaryPublicly
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {prefs.showSalaryPublicly ? (
                <>
                  <Eye className="h-3 w-3" /> Salary Visible Publicly
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3" /> Salary Kept Private
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
