// app/dashboard/_components/profile/tabs/components/PersonalInfoFields.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import {
  User,
  Calendar,
  Droplet,
  Globe2,
  Languages,
  Camera,
  Trash2,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { uploadAvatar, deleteAvatarFromStorage } from "@/lib/individualService";

export interface PersonalInfoData {
  avatarUrl?: string;
  fullName: string;
  headline: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  languages: string; // JSON string অথবা কমা-সেপারেটেড হিসেবে ব্যাকওয়ার্ড কম্প্যাটিবল থাকবে
  bio: string;
}

interface LanguageItem {
  name: string;
  read: boolean;
  write: boolean;
  speak: boolean;
}

interface Props {
  data: PersonalInfoData;
  isEditing: boolean;
  onChange: (field: keyof PersonalInfoData, value: string) => void;
}

// পুরনো কমা-সেপারেটেড বা নতুন JSON স্ট্রিং পার্স করার হেল্পার
function parseLanguages(raw: string): LanguageItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // যদি পুরনো "Bengali, English" ফরম্যাটে থাকে
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, read: true, write: true, speak: true }));
  }
  return [];
}

export default function PersonalInfoFields({
  data,
  isEditing,
  onChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [newLangName, setNewLangName] = useState<string>("");

  const langList = parseLanguages(data.languages);

  const updateLanguagesList = (updated: LanguageItem[]) => {
    onChange("languages", JSON.stringify(updated));
  };

  const handleAddLanguage = () => {
    const trimmed = newLangName.trim();
    if (!trimmed) return;
    if (!langList.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
      updateLanguagesList([
        ...langList,
        { name: trimmed, read: true, write: true, speak: true },
      ]);
    }
    setNewLangName("");
  };

  const toggleLangSkill = (idx: number, skill: "read" | "write" | "speak") => {
    const updated = langList.map((item, i) =>
      i === idx ? { ...item, [skill]: !item[skill] } : item,
    );
    updateLanguagesList(updated);
  };

  const removeLanguage = (idx: number) => {
    updateLanguagesList(langList.filter((_, i) => i !== idx));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const activeId = localStorage.getItem("kagaz_active_id") || "user";
      const { url, error } = await uploadAvatar(activeId, file, data.avatarUrl);
      if (!error && url) {
        onChange("avatarUrl", url);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (data.avatarUrl) {
      await deleteAvatarFromStorage(data.avatarUrl);
    }
    onChange("avatarUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {/* প্রোফাইল কার্ড */}
        <div className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-300 bg-white flex items-center justify-center shrink-0 shadow-2xs">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.fullName || "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-neutral-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-serif font-bold text-neutral-950 truncate">
              {data.fullName || "Name Not Set"}
            </h2>
            <p className="text-xs font-mono text-neutral-500 truncate">
              {data.headline || "Headline Not Set"}
            </p>
          </div>
        </div>

        {/* বেসিক ইনফো গ্রিড */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <div className="flex items-center gap-1 text-neutral-400 mb-0.5">
              <Calendar className="h-3 w-3" />
              <span className="text-[9px] uppercase">Birth Date</span>
            </div>
            <p className="font-medium text-neutral-900">
              {data.dob || "Not Set"}
            </p>
          </div>

          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <div className="flex items-center gap-1 text-neutral-400 mb-0.5">
              <User className="h-3 w-3" />
              <span className="text-[9px] uppercase">Gender</span>
            </div>
            <p className="font-medium text-neutral-900">
              {data.gender || "Not Set"}
            </p>
          </div>

          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <div className="flex items-center gap-1 text-red-500/80 mb-0.5">
              <Droplet className="h-3 w-3" />
              <span className="text-[9px] uppercase">Blood Group</span>
            </div>
            <p className="font-medium text-neutral-900">
              {data.bloodGroup || "Not Set"}
            </p>
          </div>

          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <div className="flex items-center gap-1 text-neutral-400 mb-0.5">
              <Globe2 className="h-3 w-3" />
              <span className="text-[9px] uppercase">Nationality</span>
            </div>
            <p className="font-medium text-neutral-900 truncate">
              {data.nationality || "Not Set"}
            </p>
          </div>
        </div>

        {/* জানা ভাষা ও দক্ষতা (Proficiency) */}
        <div className="p-3 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
          <div className="flex items-center gap-1 text-neutral-400 mb-2">
            <Languages className="h-3.5 w-3.5" />
            <span className="text-[9px] font-mono uppercase">
              Languages & Proficiency
            </span>
          </div>
          {langList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {langList.map((lang, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xs text-xs font-mono"
                >
                  <span className="font-semibold text-neutral-900">
                    {lang.name}
                  </span>
                  <div className="flex items-center gap-1 text-[9.5px]">
                    {lang.read && (
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xs">
                        Read
                      </span>
                    )}
                    {lang.write && (
                      <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xs">
                        Write
                      </span>
                    )}
                    {lang.speak && (
                      <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xs">
                        Speak
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs font-mono text-neutral-400">Not Set</span>
          )}
        </div>

        {/* প্রফেশনাল সামারি / বায়ো */}
        <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs text-xs text-neutral-700 leading-relaxed font-sans">
          <span className="text-[9px] font-mono uppercase text-neutral-400 block mb-1">
            Professional Summary / About
          </span>
          {data.bio || "No summary added yet."}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4">
      {/* প্রোফাইল ফটো আপলোড */}
      <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-neutral-300 bg-white flex items-center justify-center shrink-0 shadow-2xs group">
          {uploading ? (
            <div className="flex items-center justify-center w-full h-full bg-neutral-950/20">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-900" />
            </div>
          ) : data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-7 h-7 text-neutral-400" />
          )}

          {!uploading && (
            <label
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-neutral-950/45 hover:bg-neutral-950/65 transition-colors flex items-center justify-center cursor-pointer text-white"
            >
              <Camera className="w-4 h-4" />
            </label>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
            Profile Photo
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xs cursor-pointer"
            >
              {uploading && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
            </button>
            {data.avatarUrl && !uploading && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-[10.5px] font-mono uppercase px-2 py-1 text-red-600 hover:bg-red-50 rounded-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* নাম ও হেডলাইন */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={data.fullName}
            placeholder="Enter your full name"
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Work Title / Headline
          </label>
          <input
            type="text"
            value={data.headline}
            placeholder="Enter your work title or headline"
            onChange={(e) => onChange("headline", e.target.value)}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
      </div>

      {/* জন্মতারিখ, লিঙ্গ, রক্তের গ্রুপ ও ন্যাশনালিটি */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={data.dob}
            onChange={(e) => onChange("dob", e.target.value)}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-2.5 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Gender
          </label>
          <select
            value={data.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-2.5 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Blood Group
          </label>
          <select
            value={data.bloodGroup}
            onChange={(e) => onChange("bloodGroup", e.target.value)}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-2.5 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Nationality
          </label>
          <input
            type="text"
            value={data.nationality}
            onChange={(e) => onChange("nationality", e.target.value)}
            placeholder="e.g. Indian"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-2.5 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
      </div>

      {/* ভাষা ও প্রোফিসিয়েন্সি (Read / Write / Speak) */}
      <div className="p-3 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-2.5">
        <label className="block text-[11px] font-mono uppercase text-neutral-600 font-bold">
          Languages & Proficiency
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newLangName}
            onChange={(e) => setNewLangName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLanguage();
              }
            }}
            placeholder="e.g. Bengali, English, Hindi..."
            className="flex-1 border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono outline-none focus:border-neutral-950"
          />
          <button
            type="button"
            onClick={handleAddLanguage}
            className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs cursor-pointer flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>

        <div className="space-y-1.5">
          {langList.map((lang, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-xs text-xs font-mono"
            >
              <span className="font-semibold text-neutral-900">
                {lang.name}
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={lang.read}
                    onChange={() => toggleLangSkill(idx, "read")}
                  />
                  <span>Read</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={lang.write}
                    onChange={() => toggleLangSkill(idx, "write")}
                  />
                  <span>Write</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={lang.speak}
                    onChange={() => toggleLangSkill(idx, "speak")}
                  />
                  <span>Speak</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeLanguage(idx)}
                  className="text-neutral-400 hover:text-red-600 ml-1 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* প্রফেশনাল সামারি / বায়ো */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
          Professional Summary / Career Objective
        </label>
        <textarea
          rows={3}
          value={data.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Write your professional introduction, career objective & summary..."
          className="w-full border border-neutral-200 bg-neutral-50/30 p-3 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white resize-none"
        />
      </div>
    </div>
  );
}
