"use client";

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

export default function ExperienceTab({
  isEditing,
  experienceList = [],
  onChange,
}: Props) {
  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: Date.now().toString(),
      company: "",
      designation: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      isCurrent: false,
      responsibilities: "",
    };
    onChange([...experienceList, newItem]);
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

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    if (experienceList.length === 0) {
      return (
        <div className="p-8 border border-dashed border-neutral-200 rounded-xs text-center space-y-1">
          <Briefcase className="h-6 w-6 text-neutral-300 mx-auto" />
          <p className="text-xs font-mono text-neutral-500">
            No employment history added yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {experienceList.map((exp) => (
          <div
            key={exp.id}
            className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-sm font-serif font-bold text-neutral-950">
                  {exp.designation || "Role Not Specified"}
                </h3>
                <p className="text-xs font-mono text-neutral-600 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                  <span>{exp.company || "Company Name"}</span>
                  <span className="px-1.5 py-0.2 bg-white border border-neutral-200 text-[10px] rounded-xs">
                    {exp.employmentType}
                  </span>
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1 bg-white px-2.5 py-1 border border-neutral-200/70 rounded-xs self-start">
                <Calendar className="h-3 w-3 text-neutral-400" />
                <span>
                  {exp.startDate || "Start"} —{" "}
                  {exp.isCurrent ? "Present" : exp.endDate || "End"}
                </span>
              </div>
            </div>

            {exp.responsibilities && (
              <p className="text-xs text-neutral-700 leading-relaxed pt-1 border-t border-neutral-200/50">
                {exp.responsibilities}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-neutral-500 font-bold">
          Work Experience ({experienceList.length})
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 text-[11px] font-mono uppercase rounded-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {experienceList.map((exp, idx) => (
        <div
          key={exp.id}
          className="p-4 bg-neutral-50/50 border border-neutral-200 rounded-xs space-y-3 relative"
        >
          <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
              Experience #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(exp.id)}
              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
              title="Remove"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
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
                placeholder="e.g. Grow Tech"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
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
                placeholder="e.g. Full-Stack Web Developer"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
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
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
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
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
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
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 disabled:bg-neutral-100 disabled:text-neutral-400"
              />
              <label className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.isCurrent}
                  onChange={(e) =>
                    handleUpdate(exp.id, "isCurrent", e.target.checked)
                  }
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
              placeholder="Describe your role, achievements & daily responsibilities..."
              className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
