// app/dashboard/organization/tabs/OrgBasicTab.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import {
  Building2,
  Globe,
  Calendar,
  Users,
  Camera,
  Loader2,
  Plus,
  Trash2,
  Link as LinkIcon,
  Hash,
} from "lucide-react";
import { FullCompanyProfile } from "@/lib/organizationService";
import { uploadAvatar } from "@/lib/individualService";
import {
  BUSINESS_TYPES,
  INDUSTRY_CATEGORIES,
  INDUSTRIES,
  BUSINESS_SIZES,
  formatOtherDisplay,
} from "@/constants/orgOptions";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";

interface Props {
  isEditing: boolean;
  data: FullCompanyProfile;
  onChange: (updated: Partial<FullCompanyProfile>) => void;
}

export default function OrgBasicTab({ isEditing, data, onChange }: Props) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const activeId = localStorage.getItem("kagaz_active_id") || "org";
      const { url, error } = await uploadAvatar(activeId, file, data.logo_url);
      if (!error && url) onChange({ logo_url: url });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const isOtherIndustry =
    data.industry === "Other" ||
    (data.industry !== "" && !INDUSTRIES.includes(data.industry));

  const availableCategories = isOtherIndustry
    ? ["Other"]
    : data.industry
      ? INDUSTRY_CATEGORIES[data.industry] || ["Other"]
      : [];

  const handleIndustryChange = (val: string) => {
    onChange({
      industry: val,
      business_category: val === "Other" ? "Other" : "",
    });
  };

  // সোশ্যাল লিংক হ্যান্ডলার
  const addSocialLink = () => {
    onChange({
      social_links: [
        ...(data.social_links || []),
        { id: Date.now().toString(), platform: "LinkedIn", url: "" },
      ],
    });
  };

  const updateSocialLink = (
    id: string,
    field: "platform" | "url",
    val: string,
  ) => {
    onChange({
      social_links: (data.social_links || []).map((item) =>
        item.id === id ? { ...item, [field]: val } : item,
      ),
    });
  };

  const removeSocialLink = (id: string) => {
    onChange({
      social_links: (data.social_links || []).filter((item) => item.id !== id),
    });
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    const displayType = formatOtherDisplay(data.business_type);
    const displayIndustry = formatOtherDisplay(data.industry);
    const displayCategory = formatOtherDisplay(data.business_category);

    return (
      <div className="space-y-5">
        <div className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-xs border border-neutral-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
            {data.logo_url ? (
              <img
                src={data.logo_url}
                alt={data.company_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="h-7 w-7 text-neutral-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-serif font-bold text-neutral-950 truncate">
                {data.company_name || "Organization Name Not Set"}
              </h3>
              {data.kagaz_id && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono rounded-xs shrink-0">
                  <Hash className="h-2.5 w-2.5" /> {data.kagaz_id}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-neutral-600 truncate mt-0.5">
              {data.short_description || "No short description added yet"}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {displayType && (
                <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs">
                  {displayType}
                </span>
              )}
              {displayIndustry && (
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-700 rounded-xs">
                  {displayIndustry}
                </span>
              )}
              {displayCategory && (
                <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-[10px] font-mono text-blue-700 rounded-xs">
                  {displayCategory}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <span className="text-[9px] uppercase text-neutral-400 block mb-0.5">
              Business Category
            </span>
            <p className="font-medium text-neutral-900 truncate">
              {displayCategory || "Not Set"}
            </p>
          </div>
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <span className="text-[9px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
              <Calendar className="h-3 w-3" /> Est. Year
            </span>
            <p className="font-medium text-neutral-900">
              {data.est_year || "Not Set"}
            </p>
          </div>
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <span className="text-[9px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
              <Users className="h-3 w-3" /> Business Size
            </span>
            <p className="font-medium text-neutral-900 truncate">
              {data.business_size || "Not Set"}
            </p>
          </div>
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <span className="text-[9px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
              <Globe className="h-3 w-3" /> Website
            </span>
            {data.website ? (
              <a
                href={data.website}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline truncate block"
              >
                Visit Site
              </a>
            ) : (
              <p className="font-medium text-neutral-400">Not Set</p>
            )}
          </div>
        </div>

        <div className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1">
          <span className="text-[9.5px] font-mono uppercase text-neutral-400 block">
            Detailed Description
          </span>
          <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
            {data.detailed_description || "No detailed description added yet."}
          </p>
        </div>

        {(data.social_links || []).length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">
              Digital & Social Presence
            </span>
            <div className="flex flex-wrap gap-2">
              {data.social_links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-mono text-neutral-800 rounded-xs"
                >
                  <LinkIcon className="h-3 w-3 text-neutral-500" />
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4">
      <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-xs overflow-hidden border border-neutral-300 bg-white flex items-center justify-center shrink-0">
            {uploadingLogo ? (
              <Loader2 className="w-5 h-5 animate-spin text-neutral-800" />
            ) : data.logo_url ? (
              <img
                src={data.logo_url}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-7 h-7 text-neutral-400" />
            )}
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 bg-neutral-950/45 hover:bg-neutral-950/65 flex items-center justify-center text-white cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">
              Business Logo (Recommended)
            </span>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="mt-1.5 px-3 py-1 bg-neutral-900 text-white text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
            >
              {uploadingLogo ? "Uploading..." : "Upload Logo"}
            </button>
          </div>
        </div>

        <div className="px-3 py-2 bg-white border border-neutral-200 rounded-xs">
          <span className="text-[9px] font-mono uppercase text-neutral-400 block">
            Company Profile ID *
          </span>
          <span className="text-xs font-mono font-bold text-neutral-900">
            {data.kagaz_id || "AUTO-GENERATED"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormInput
          label="Company / Business Name"
          required
          value={data.company_name}
          onChange={(val) => onChange({ company_name: val })}
          placeholder="e.g. Grow Tech"
        />
        <FormInput
          label="Short Description"
          required
          value={data.short_description}
          onChange={(val) => onChange({ short_description: val })}
          placeholder="e.g. Software Development & Computer Services"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
        <FormSelectWithOther
          label="Business Type"
          required
          value={data.business_type}
          options={BUSINESS_TYPES}
          placeholder="-- Select Business Type --"
          otherPlaceholder="Specify Business Type..."
          onChange={(val) => onChange({ business_type: val })}
        />

        <FormSelectWithOther
          label="Industry"
          required
          value={data.industry}
          options={INDUSTRIES}
          placeholder="-- Select Industry --"
          otherPlaceholder="Specify Industry..."
          onChange={handleIndustryChange}
        />

        <FormSelectWithOther
          label="Business Category"
          required
          disabled={!data.industry}
          value={data.business_category}
          options={availableCategories}
          placeholder={
            data.industry ? "-- Select Category --" : "Select Industry First"
          }
          otherPlaceholder="Specify Category..."
          onChange={(val) => onChange({ business_category: val })}
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
          Detailed Description (Optional)
        </label>
        <textarea
          rows={3}
          value={data.detailed_description}
          onChange={(e) => onChange({ detailed_description: e.target.value })}
          placeholder="Write about your company's mission, story & core expertise..."
          className="w-full border border-neutral-200 bg-neutral-50/30 p-3 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormInput
          label="Establishment Year (Optional)"
          type="number"
          min="1800"
          max={new Date().getFullYear()}
          value={data.est_year}
          onChange={(val) => onChange({ est_year: val })}
          placeholder="e.g. 2025"
        />

        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Business Size (Optional)
          </label>
          <select
            value={data.business_size}
            onChange={(e) => onChange({ business_size: e.target.value })}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          >
            <option value="">-- Select Size --</option>
            {BUSINESS_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Company Website (Optional)"
          type="url"
          value={data.website}
          onChange={(val) => onChange({ website: val })}
          placeholder="https://yourcompany.com"
        />
      </div>

      <div className="p-3 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-neutral-600 font-bold">
            Social & Digital Links
          </span>
          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Link
          </button>
        </div>

        {(data.social_links || []).map((link) => (
          <div key={link.id} className="flex items-center gap-2">
            <select
              value={link.platform}
              onChange={(e) =>
                updateSocialLink(link.id, "platform", e.target.value)
              }
              className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
              <option value="WhatsApp Business">WhatsApp Business</option>
              <option value="Google Business">Google Business</option>
              <option value="Online Store">Online Store</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => removeSocialLink(link.id)}
              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
