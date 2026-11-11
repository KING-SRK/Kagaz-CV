// app/dashboard/individual/tabs/SkillsTab.tsx
"use client";

import { useState } from "react";
import { Plus, X, Briefcase, Tag } from "lucide-react";
import { WORK_SECTORS } from "../data/sectors";

interface TabProps {
  isEditing?: boolean;
  skills: string[];
  onChange: (skills: string[]) => void;
  sector?: string;
  roleTitle?: string;
  onSectorChange?: (sector: string) => void;
  onRoleTitleChange?: (role: string) => void;
}

export default function SkillsTab({
  isEditing = false,
  skills = [],
  onChange,
  sector = "",
  roleTitle = "",
  onSectorChange,
  onRoleTitleChange,
}: TabProps) {
  // স্কিল টাইপ করার জন্য লোকাল ইনপুট স্টেট
  const [skillInput, setSkillInput] = useState<string>("");

  // নতুন স্কিল যোগ করার ফাংশন
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const currentSectorLabel =
    WORK_SECTORS.find((s) => s.id === sector)?.label ||
    "Work Category Not Selected";

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">

      {!isEditing ? (
        /* ==================== VIEW MODE (READ ONLY) ==================== */
        <div className="space-y-4">
          {/* কাজ ও ক্যাটাগরি কার্ড */}
          <div className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex items-center gap-3">
            <div className="p-2.5 bg-white border border-neutral-200 rounded text-neutral-800 shrink-0 shadow-2xs">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block tracking-wider">
                {sector ? currentSectorLabel : "Category Not Set"}
              </span>
              <h2 className="text-sm font-serif font-bold text-neutral-950 truncate">
                {roleTitle || "Job Role Not Set"}
              </h2>
            </div>
          </div>

          {/* স্কিল লিস্ট */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">
              Skills ({skills.length})
            </span>
            {skills.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 italic">
                No skills added yet. Switch to edit mode to add your skills.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-neutral-100 border border-neutral-200/90 text-neutral-900 text-xs font-mono rounded-xs shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================== EDIT MODE ==================== */
        <div className="space-y-4">
          {/* ১. কাজের ক্ষেত্র ও রোল */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Work Category
              </label>
              <select
                value={sector}
                onChange={(e) => onSectorChange?.(e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white cursor-pointer"
              >
                <option value="">-- Select Work Category --</option>
                {WORK_SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Your Job Title / Role
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => onRoleTitleChange?.(e.target.value)}
                placeholder="e.g. Lead Developer / UI Designer"
                className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
              />
            </div>
          </div>

          {/* ২. স্কিল লেখার ইনপুট ও বাটন */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Add Skills (Type & Press Enter)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Next.js, TypeScript, Tailwind CSS, Supabase..."
                  className="w-full border border-neutral-200 bg-neutral-50/30 pl-9 pr-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* ৩. যুক্ত করা স্কিল ট্যাগগুলো */}
          <div className="border border-neutral-200/80 bg-neutral-50/40 p-3.5 rounded-xs space-y-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
              Added Skills ({skills.length}) — Click &apos;×&apos; to remove
            </span>
            {skills.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 italic py-1">
                No skills added yet. Type a skill above and click Add.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-300/80 text-neutral-800 text-xs font-mono rounded-xs shadow-2xs hover:border-neutral-400 transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      title={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
