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
} from "lucide-react";
import { FullCompanyProfile } from "@/lib/organizationService";
import { uploadAvatar } from "@/lib/individualService";

interface Props {
  isEditing: boolean;
  data: FullCompanyProfile;
  onChange: (updated: Partial<FullCompanyProfile>) => void;
}

const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company",
  "Public Limited Company",
  "One Person Company (OPC)",
  "Startup",
  "Freelancer / Independent Business",
  "Local Shop / Retail Business",
  "Non-Profit Organisation",
  "Other",
];

const INDUSTRIES = [
  "Information Technology & Software",
  "Computer Sales, Repair & Electronics",
  "Education & Training",
  "Healthcare & Clinic",
  "Retail & E-commerce",
  "Food & Restaurant",
  "Manufacturing",
  "Construction & Real Estate",
  "Finance & Consulting",
  "Transportation & Logistics",
  "Media & Entertainment",
  "Professional Services",
  "Beauty & Fashion",
  "Other",
];

const BUSINESS_SIZES = [
  "1-5 Employees (Micro / Solo)",
  "6-20 Employees (Small Team)",
  "21-50 Employees (Growing)",
  "51-200 Employees (Medium)",
  "200+ Employees (Enterprise)",
];

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
      if (!error && url) {
        onChange({ logo_url: url });
      }
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // সোশ্যাল লিংক হ্যান্ডলার
  const addSocialLink = () => {
    const current = data.social_links || [];
    onChange({
      social_links: [
        ...current,
        { id: Date.now().toString(), platform: "Website", url: "" },
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
    return (
      <div className="space-y-5">
        {/* কোম্পানির হেডার কার্ড */}
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
            <h3 className="text-base font-serif font-bold text-neutral-950 truncate">
              {data.company_name || "Organization Name Not Set"}
            </h3>
            <p className="text-xs font-mono text-neutral-600 truncate">
              {data.short_description || "No tagline added yet"}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {data.business_type && (
                <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs">
                  {data.business_type}
                </span>
              )}
              {data.industry && (
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-700 rounded-xs">
                  {data.industry}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ৪টি বেসিক তথ্য কার্ড */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200/70 rounded-xs">
            <span className="text-[9px] uppercase text-neutral-400 block mb-0.5">
              Category
            </span>
            <p className="font-medium text-neutral-900 truncate">
              {data.business_category || "Not Set"}
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
              <Users className="h-3 w-3" /> Team Size
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

        {/* বিস্তারিত বিবরণ */}
        <div className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1">
          <span className="text-[9.5px] font-mono uppercase text-neutral-400 block">
            About Organization
          </span>
          <p className="text-xs text-neutral-700 leading-relaxed">
            {data.detailed_description || "No detailed description added yet."}
          </p>
        </div>

        {/* ডিজিটাল ও সোশ্যাল লিংক */}
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
      {/* লোগো আপলোড */}
      <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs flex items-center gap-4">
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
            Business Logo
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

      {/* নাম ও ট্যাগলাইন */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Company / Business Name *
          </label>
          <input
            type="text"
            value={data.company_name}
            onChange={(e) => onChange({ company_name: e.target.value })}
            placeholder="e.g. Grow Tech"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Short Tagline / One-liner *
          </label>
          <input
            type="text"
            value={data.short_description}
            onChange={(e) => onChange({ short_description: e.target.value })}
            placeholder="e.g. Software Development & Computer Services"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
      </div>

      {/* বিজনেস টাইপ ও ইন্ডাস্ট্রি */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Business Type
          </label>
          <select
            value={data.business_type}
            onChange={(e) => onChange({ business_type: e.target.value })}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          >
            <option value="">-- Select Business Type --</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Industry
          </label>
          <select
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          >
            <option value="">-- Select Industry --</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* সাব-ক্যাটাগরি, প্রতিষ্ঠার সাল ও টিম সাইজ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Sub-Category
          </label>
          <input
            type="text"
            value={data.business_category}
            onChange={(e) => onChange({ business_category: e.target.value })}
            placeholder="e.g. Web & App Agency"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Establishment Year
          </label>
          <input
            type="text"
            value={data.est_year}
            onChange={(e) => onChange({ est_year: e.target.value })}
            placeholder="e.g. 2025"
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Business Size
          </label>
          <select
            value={data.business_size}
            onChange={(e) => onChange({ business_size: e.target.value })}
            className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
          >
            <option value="">Select Size</option>
            {BUSINESS_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ওয়েবসাইট ও বিস্তারিত বিবরণ */}
      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
          Official Website URL
        </label>
        <input
          type="url"
          value={data.website}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://yourcompany.com"
          className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
          Detailed Description / About Company
        </label>
        <textarea
          rows={3}
          value={data.detailed_description}
          onChange={(e) => onChange({ detailed_description: e.target.value })}
          placeholder="Write about your company's mission, story & core expertise..."
          className="w-full border border-neutral-200 bg-neutral-50/30 p-3 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white resize-none"
        />
      </div>

      {/* সোশ্যাল ও ডিজিটাল লিংক */}
      <div className="p-3 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-neutral-600 font-bold">
            Social & Digital Links (Instagram, LinkedIn, Google Business, etc.)
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
