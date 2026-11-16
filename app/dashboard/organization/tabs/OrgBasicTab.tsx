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
      <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
        <div className="p-3 sm:p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xs border border-neutral-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
            {data.logo_url ? (
              <img
                src={data.logo_url}
                alt={data.company_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-neutral-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-950 truncate">
                {data.company_name || "Organization Name Not Set"}
              </h3>
              {data.kagaz_id && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono rounded-xs shrink-0">
                  <Hash className="h-2.5 w-2.5" /> {data.kagaz_id}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs font-mono text-neutral-600 truncate mt-0.5">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-xs font-mono">
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs min-w-0">
            <span className="text-[9px] uppercase text-neutral-400 block mb-0.5 truncate">
              Business Category
            </span>
            <p className="font-medium text-neutral-900 truncate">
              {displayCategory || "Not Set"}
            </p>
          </div>
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs min-w-0">
            <span className="text-[9px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
              <Calendar className="h-3 w-3 shrink-0" /> Est. Year
            </span>
            <p className="font-medium text-neutral-900 truncate">
              {data.est_year || "Not Set"}
            </p>
          </div>
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs min-w-0">
            <span className="text-[9px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
              <Users className="h-3 w-3 shrink-0" /> Business Size
            </span>
            <p className="font-medium text-neutral-900 truncate">
              {data.business_size || "Not Set"}
            </p>
          </div>
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs min-w-0">
            <span className="text-[9px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
              <Globe className="h-3 w-3 shrink-0" /> Website
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

        <div className="p-3 sm:p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1">
          <span className="text-[9.5px] font-mono uppercase text-neutral-400 block">
            Detailed Description
          </span>
          <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line wrap-break-word">
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
                  <LinkIcon className="h-3 w-3 text-neutral-500 shrink-0" />
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
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xs overflow-hidden border border-neutral-300 bg-white flex items-center justify-center shrink-0">
            {uploadingLogo ? (
              <Loader2 className="w-5 h-5 animate-spin text-neutral-800" />
            ) : data.logo_url ? (
              <img
                src={data.logo_url}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400" />
            )}
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 bg-neutral-950/45 hover:bg-neutral-950/65 flex items-center justify-center text-white cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block truncate">
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
              className="mt-1.5 px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-[10.5px] font-mono uppercase rounded-xs cursor-pointer transition-colors"
            >
              {uploadingLogo ? "Uploading..." : "Upload Logo"}
            </button>
          </div>
        </div>

        <div className="px-3 py-2 bg-white border border-neutral-200 rounded-xs self-start sm:self-auto w-full sm:w-auto">
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
          placeholder="Enter your company or business name"
        />
        <FormInput
          label="Short Description"
          required
          value={data.short_description}
          onChange={(val) => onChange({ short_description: val })}
          placeholder="Enter your short business tagline or summary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
        <FormSelectWithOther
          label="Business Type"
          required
          value={data.business_type}
          options={BUSINESS_TYPES}
          placeholder="Select business type"
          otherPlaceholder="Enter your business type"
          onChange={(val) => onChange({ business_type: val })}
        />

        <FormSelectWithOther
          label="Industry"
          required
          value={data.industry}
          options={INDUSTRIES}
          placeholder="Select industry"
          otherPlaceholder="Enter your industry"
          onChange={handleIndustryChange}
        />

        <FormSelectWithOther
          label="Business Category"
          required
          disabled={!data.industry}
          value={data.business_category}
          options={availableCategories}
          placeholder={
            data.industry ? "Select category" : "Select industry first"
          }
          otherPlaceholder="Enter your business category"
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
          placeholder="Enter your detailed company overview, mission & expertise"
          className="w-full border border-neutral-200 bg-neutral-50/30 p-3 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white resize-none rounded-xs"
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
          placeholder="Enter your establishment year"
        />

        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Business Size (Optional)
          </label>
          <select
            value={data.business_size}
            onChange={(e) => onChange({ business_size: e.target.value })}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white rounded-xs cursor-pointer"
          >
            <option value="">Select business size</option>
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
          placeholder="Enter your official website URL"
        />
      </div>

      <div className="p-3 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase text-neutral-600 font-bold">
            Social & Digital Links
          </span>
          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Link
          </button>
        </div>

        {(data.social_links || []).map((link) => (
          <div
            key={link.id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 sm:p-0 bg-white sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xs"
          >
            <select
              value={link.platform}
              onChange={(e) =>
                updateSocialLink(link.id, "platform", e.target.value)
              }
              className="w-full sm:w-44 border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
              <option value="X">X</option>
              <option value="WhatsApp Business">WhatsApp Business</option>
              <option value="Google Business">Google Business</option>
              <option value="Online Store">Online Store</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="url"
                value={link.url}
                onChange={(e) =>
                  updateSocialLink(link.id, "url", e.target.value)
                }
                placeholder="Enter your social or profile URL"
                className="flex-1 min-w-0 border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <button
                type="button"
                onClick={() => removeSocialLink(link.id)}
                className="text-red-500 hover:text-red-700 p-2 sm:p-1 cursor-pointer shrink-0 border sm:border-0 border-neutral-200 rounded-xs"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
