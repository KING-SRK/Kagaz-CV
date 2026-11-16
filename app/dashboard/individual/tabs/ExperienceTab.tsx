// app/dashboard/individual/tabs/ExperienceTab.tsx
"use client";

import { useEffect } from "react";
import { Building2, Calendar, Plus, Trash2, Briefcase } from "lucide-react";

export interface ExperienceItem {
  id: string;
  company: string;
  designation: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
}

interface Props {
  isEditing: boolean;
  experienceList: ExperienceItem[];
  onChange: (list: ExperienceItem[]) => void;
}

const createDefaultExperience = (): ExperienceItem => ({
  id: Date.now().toString(),
  company: "",
  designation: "",
  employmentType: "Full-time",
  startDate: "",
  endDate: "",
  isCurrent: false,
  responsibilities: "",
});

export default function ExperienceTab({
  isEditing,
  experienceList = [],
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing && experienceList.length === 0) {
      onChange([createDefaultExperience()]);
    }
  }, [isEditing, experienceList.length, onChange]);

  const handleAdd = () => {
    onChange([...experienceList, createDefaultExperience()]);
  };

  const handleUpdate = (
    id: string,
    field: keyof ExperienceItem,
    value: string | boolean,
  ) => {
    const updated = experienceList.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    onChange(experienceList.filter((item) => item.id !== id));
  };

  const displayList =
    experienceList.length > 0 ? experienceList : [createDefaultExperience()];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
            <Briefcase className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              Work History & Experience ({displayList.length})
            </span>
          </span>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {displayList.map((exp, idx) => (
            <div
              key={exp.id}
              className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3 sm:space-y-3.5"
            >
              {/* কার্ড হেডার */}
              <div className="flex items-center justify-between gap-2 border-b border-neutral-200/80 pb-2 sm:pb-2.5">
                <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                  Experience #{idx + 1}
                </span>
                <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs shrink-0">
                  {exp.employmentType || "Full-time"}
                </span>
              </div>

              {/* রো ১: Designation, Company & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Designation / Role
                  </span>
                  <p
                    className={`font-medium truncate ${
                      exp.designation ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {exp.designation || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                  <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                    <Building2 className="h-3 w-3 shrink-0" /> Company /
                    Organization
                  </span>
                  <p
                    className={`font-medium truncate ${
                      exp.company ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {exp.company || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                  <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                    <Calendar className="h-3 w-3 shrink-0" /> Employment
                    Duration
                  </span>
                  <p
                    className={`font-medium truncate ${
                      exp.startDate || exp.isCurrent
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    }`}
                  >
                    {exp.startDate || "Start"} —{" "}
                    {exp.isCurrent ? "Present" : exp.endDate || "End"}
                  </p>
                </div>
              </div>

              {/* রো ২: Key Responsibilities */}
              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs text-xs">
                <span className="text-[9.5px] font-mono uppercase text-neutral-400 block mb-0.5">
                  Key Responsibilities & Achievements
                </span>
                <p
                  className={`leading-relaxed wrap-break-word ${
                    exp.responsibilities
                      ? "text-neutral-700"
                      : "text-neutral-400 font-mono"
                  }`}
                >
                  {exp.responsibilities || "Not Set"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] sm:text-xs font-mono uppercase text-neutral-500 font-bold min-w-0 truncate">
          Work Experience ({displayList.length})
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {displayList.map((exp, idx) => (
        <div
          key={exp.id}
          className="p-3 sm:p-4 bg-neutral-50/50 border border-neutral-200 rounded-xs space-y-3 relative"
        >
          <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
              Experience #{idx + 1}
            </span>
            {displayList.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(exp.id)}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) =>
                  handleUpdate(exp.id, "company", e.target.value)
                }
                placeholder="Enter company or organization name"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Designation / Role
              </label>
              <input
                type="text"
                value={exp.designation}
                onChange={(e) =>
                  handleUpdate(exp.id, "designation", e.target.value)
                }
                placeholder="Enter your designation or professional role"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Employment Type
              </label>
              <select
                value={exp.employmentType}
                onChange={(e) =>
                  handleUpdate(exp.id, "employmentType", e.target.value)
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Co-Founder / Owner">Co-Founder / Owner</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Joining Date
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  handleUpdate(exp.id, "startDate", e.target.value)
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Leaving Date
              </label>
              <input
                type="month"
                value={exp.endDate}
                disabled={exp.isCurrent}
                onChange={(e) =>
                  handleUpdate(exp.id, "endDate", e.target.value)
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 disabled:bg-neutral-100 disabled:text-neutral-400 rounded-xs"
              />
              <label className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.isCurrent}
                  onChange={(e) =>
                    handleUpdate(exp.id, "isCurrent", e.target.checked)
                  }
                  className="shrink-0"
                />
                <span>Currently working here</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Key Responsibilities
            </label>
            <textarea
              rows={2}
              value={exp.responsibilities}
              onChange={(e) =>
                handleUpdate(exp.id, "responsibilities", e.target.value)
              }
              placeholder="Enter your key responsibilities, achievements and role scope"
              className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
