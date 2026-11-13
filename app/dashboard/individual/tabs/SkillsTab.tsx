// app/dashboard/individual/tabs/SkillsTab.tsx
"use client";

import { useState } from "react";
import { Plus, X, Briefcase, Tag, Heart } from "lucide-react";
import { WORK_SECTORS } from "../data/sectors";

interface TabProps {
  isEditing?: boolean;
  skills: string[];
  onChange: (skills: string[]) => void;
  interests?: string[];
  onInterestsChange?: (interests: string[]) => void;
  sector?: string;
  roleTitle?: string;
  onSectorChange?: (sector: string) => void;
  onRoleTitleChange?: (role: string) => void;
}

export default function SkillsTab({
  isEditing = false,
  skills = [],
  onChange,
  interests = [],
  onInterestsChange,
  sector = "",
  roleTitle = "",
  onSectorChange,
  onRoleTitleChange,
}: TabProps) {
  const [skillInput, setSkillInput] = useState<string>("");
  const [interestInput, setInterestInput] = useState<string>("");

  // --- Skill Handlers ---
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  // --- Interest Handlers ---
  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      onInterestsChange?.([...interests, trimmed]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (itemToRemove: string) => {
    onInterestsChange?.(interests.filter((i) => i !== itemToRemove));
  };

  const currentSectorLabel =
    WORK_SECTORS.find((s) => s.id === sector)?.label ||
    "Work Category Not Selected";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {!isEditing ? (
        /* ==================== VIEW MODE ==================== */
        <div className="space-y-5">
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
                No skills added yet.
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

          {/* ইন্টারেস্ট ও হবি লিস্ট */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1">
              <Heart className="h-3 w-3 text-rose-500" /> Interests & Hobbies (
              {interests.length})
            </span>
            {interests.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 italic">
                No interests or hobbies added yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {interests.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-rose-50/50 border border-rose-200/70 text-neutral-800 text-xs font-mono rounded-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================== EDIT MODE ==================== */
        <div className="space-y-5">
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
                placeholder="Enter your job title or professional role"
                className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
              />
            </div>
          </div>

          {/* ২. স্কিল যোগ করা */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-mono uppercase text-neutral-500">
              Add Core Skills (Press Enter)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Enter a skill and press Enter (e.g. React, Python)"
                  className="w-full border border-neutral-200 bg-neutral-50/30 pl-9 pr-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono uppercase rounded-xs cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="border border-neutral-200/80 bg-neutral-50/40 p-3 rounded-xs flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <span className="text-xs font-mono text-neutral-400 italic">
                  No skills added yet.
                </span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-300/80 text-neutral-800 text-xs font-mono rounded-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-neutral-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* ৩. ইন্টারেস্ট ও হবি যোগ করা */}
          <div className="space-y-2.5 pt-3 border-t border-neutral-200/70">
            <label className="block text-[11px] font-mono uppercase text-neutral-500">
              Professional Interests & Hobbies
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Heart className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  placeholder="Enter an interest or hobby and press Enter"
                  className="w-full border border-neutral-200 bg-neutral-50/30 pl-9 pr-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono uppercase rounded-xs cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="border border-neutral-200/80 bg-neutral-50/40 p-3 rounded-xs flex flex-wrap gap-2">
              {interests.length === 0 ? (
                <span className="text-xs font-mono text-neutral-400 italic">
                  No interests added yet.
                </span>
              ) : (
                interests.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-300/80 text-neutral-800 text-xs font-mono rounded-xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(item)}
                      className="text-neutral-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
