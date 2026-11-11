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
  languages: string;
  bio: string;
}

interface Props {
  data: PersonalInfoData;
  isEditing: boolean;
  onChange: (field: keyof PersonalInfoData, value: string) => void;
}

export default function PersonalInfoFields({
  data,
  isEditing,
  onChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const activeId = localStorage.getItem("kagaz_active_id") || "user";

      // 🧹 data.avatarUrl পাঠিয়ে দিলে আগের ছবিটি অটো ডিলিট হয়ে নতুনটি বসবে
      const { url, error } = await uploadAvatar(activeId, file, data.avatarUrl);
      if (error) {
        console.error("Avatar upload failed:", error);
        return;
      }

      if (url) {
        onChange("avatarUrl", url);
      }
    } catch (err) {
      console.error("Error handling avatar upload:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 🗑️ Remove বাটনে ক্লিক করলে স্টোরেজ থেকে পার্মানেন্টলি ডিলিট হবে
  const handleRemoveAvatar = async () => {
    if (data.avatarUrl) {
      await deleteAvatarFromStorage(data.avatarUrl);
    }
    onChange("avatarUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {/* 📸 নাম, হেডলাইন এবং বাঁদিকের কম্প্যাক্ট অবতার */}
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

        {/* বেসিক ইনফো গ্রিড (DOB, Gender, Blood, Nationality) */}
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

        {/* জানা ভাষা */}
        <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
          <div className="flex items-center gap-1 text-neutral-400 mb-1.5">
            <Languages className="h-3 w-3" />
            <span className="text-[9px] font-mono uppercase">Languages</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.languages ? (
              data.languages.split(",").map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-800 text-[10.5px] font-mono rounded-xs"
                >
                  {lang.trim()}
                </span>
              ))
            ) : (
              <span className="text-xs font-mono text-neutral-400">
                Not Set
              </span>
            )}
          </div>
        </div>

        {/* বায়ো */}
        <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs text-xs text-neutral-700 leading-relaxed font-sans">
          {data.bio || "No bio added yet."}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4">
      {/* 📸 এডিট মোডে ছবির প্রিভিউ ও আপলোড কন্ট্রোল */}
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
              title="Upload Photo"
            >
              <Camera className="w-4 h-4" />
            </label>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
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
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploading && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
            </button>
            {data.avatarUrl && !uploading && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-[10.5px] font-mono uppercase px-2 py-1 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* নাম ও হেডলাইন ইনপুট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="e.g. Joy Thayal"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Work Title / Headline
          </label>
          <input
            type="text"
            value={data.headline}
            onChange={(e) => onChange("headline", e.target.value)}
            placeholder="e.g. Web Developer"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
      </div>

      {/* জন্মতারিখ, লিঙ্গ ও রক্তের গ্রুপ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={data.dob}
            onChange={(e) => onChange("dob", e.target.value)}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Gender
          </label>
          <select
            value={data.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white cursor-pointer"
          >
            <option value="">Select Gender</option>
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
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white cursor-pointer"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* ন্যাশনালিটি ও ভাষা */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Nationality
          </label>
          <input
            type="text"
            value={data.nationality}
            onChange={(e) => onChange("nationality", e.target.value)}
            placeholder="e.g. Indian"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Languages Known (Comma Separated)
          </label>
          <input
            type="text"
            value={data.languages}
            onChange={(e) => onChange("languages", e.target.value)}
            placeholder="e.g. Bengali, English, Hindi"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
      </div>

      {/* বায়ো */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
          About You (Bio)
        </label>
        <textarea
          rows={3}
          value={data.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Write a short summary about yourself..."
          className="w-full border border-neutral-200 bg-neutral-50/30 p-3 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white resize-none"
        />
      </div>
    </div>
  );
}
