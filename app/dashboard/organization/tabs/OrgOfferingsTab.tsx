// app/dashboard/organization/tabs/OrgOfferingsTab.tsx
"use client";

import { useEffect } from "react";
import {
  Package,
  Wrench,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { OrgOfferingItem } from "@/lib/organizationService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import {
  OFFERING_TYPES,
  OFFERING_CATEGORIES,
  PRICING_TYPES,
  AVAILABILITY_STATUS,
  formatOtherDisplay,
} from "@/constants/orgOptions";

interface Props {
  isEditing: boolean;
  offerings: OrgOfferingItem[];
  onChange: (newOfferings: OrgOfferingItem[]) => void;
}

const createDefaultOffering = (): OrgOfferingItem => ({
  id: Date.now().toString(),
  type: "Product",
  name: "",
  category: "",
  description: "",
  price: "",
  pricingType: "Fixed",
  availability: "Available",
  link: "",
});

export default function OrgOfferingsTab({
  isEditing,
  offerings = [],
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing && offerings.length === 0) {
      onChange([createDefaultOffering()]);
    }
  }, [isEditing, offerings.length, onChange]);

  const addOffering = () => {
    onChange([...offerings, createDefaultOffering()]);
  };

  const updateOffering = (
    id: string,
    field: keyof OrgOfferingItem,
    val: string,
  ) => {
    onChange(
      offerings.map((item) =>
        item.id === id ? { ...item, [field]: val } : item,
      ),
    );
  };

  const removeOffering = (id: string) => {
    onChange(offerings.filter((item) => item.id !== id));
  };

  const displayOfferings =
    offerings.length > 0 ? offerings : [createDefaultOffering()];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
            <Package className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              Products & Services Catalog ({displayOfferings.length})
            </span>
          </span>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {displayOfferings.map((item, idx) => {
            const categoryLabel = formatOtherDisplay(item.category);
            const isAvailable = item.availability !== "Unavailable";

            return (
              <div
                key={item.id}
                className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3 sm:space-y-3.5"
              >
                {/* কার্ড হেডার */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2 sm:pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                      Offering #{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs shrink-0 ${
                        item.type === "Service"
                          ? "bg-blue-950 text-white"
                          : "bg-neutral-900 text-white"
                      }`}
                    >
                      {item.type === "Service" ? (
                        <Wrench className="h-2.5 w-2.5 shrink-0" />
                      ) : (
                        <Package className="h-2.5 w-2.5 shrink-0" />
                      )}
                      {item.type || "Product"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs border shrink-0 ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 shrink-0" />{" "}
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 shrink-0" /> Unavailable
                        </>
                      )}
                    </span>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-[10px] font-mono uppercase text-neutral-900 rounded-xs shrink-0"
                      >
                        <span>Enquire / Link</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                {/* গ্রিড ফিল্ডস */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Product / Service Name
                    </span>
                    <p
                      className={`font-medium truncate ${
                        item.name ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {item.name || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Category
                    </span>
                    <p
                      className={`font-medium truncate ${
                        categoryLabel ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {categoryLabel || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Pricing Type
                    </span>
                    <p className="font-medium text-neutral-900 truncate">
                      {item.pricingType || "Fixed"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Price
                    </span>
                    <p
                      className={`font-medium truncate ${
                        item.price ? "text-emerald-700" : "text-neutral-400"
                      }`}
                    >
                      {item.pricingType === "Quotation-based"
                        ? "On Request"
                        : item.price
                          ? `₹ ${item.price}`
                          : "Not Set"}
                    </p>
                  </div>
                </div>

                {/* বিবরণ (Description) */}
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs text-xs">
                  <span className="text-[9.5px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Description
                  </span>
                  <p
                    className={`leading-relaxed wrap-break-word ${
                      item.description
                        ? "text-neutral-700"
                        : "text-neutral-400 font-mono"
                    }`}
                  >
                    {item.description || "Not Set"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      {/* হেডার ও নতুন প্রোডাক্ট/সার্ভিস যোগ করার বাটন */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
            Products & Services Catalog ({displayOfferings.length})
          </span>
          <span className="text-[11px] font-sans text-neutral-500">
            Showcase the products you sell or services your business provides.
          </span>
        </div>
        <button
          type="button"
          onClick={addOffering}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Offering
        </button>
      </div>

      {/* প্রতিটি অফারিং ফর্ম কার্ড */}
      <div className="space-y-3.5 sm:space-y-4">
        {displayOfferings.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5"
          >
            {/* কার্ড হেডার */}
            <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
              <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                Offering #{idx + 1}
              </span>

              {displayOfferings.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOffering(item.id)}
                  title="Remove Offering"
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* রো ১: Offering Type, Product/Service Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Offering Type
                </label>
                <select
                  value={item.type}
                  onChange={(e) =>
                    updateOffering(
                      item.id,
                      "type",
                      e.target.value as "Product" | "Service",
                    )
                  }
                  className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
                >
                  {OFFERING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Product / Service Name"
                value={item.name}
                onChange={(val) => updateOffering(item.id, "name", val)}
                placeholder="Enter your product or service name"
              />

              <FormSelectWithOther
                label="Category"
                value={item.category}
                options={OFFERING_CATEGORIES}
                placeholder="Select category"
                otherPlaceholder="Enter your category"
                onChange={(val) => updateOffering(item.id, "category", val)}
              />
            </div>

            {/* রো ২: Pricing Type, Price, Availability & Enquiry Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Pricing Type
                </label>
                <select
                  value={item.pricingType}
                  onChange={(e) =>
                    updateOffering(item.id, "pricingType", e.target.value)
                  }
                  className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
                >
                  {PRICING_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Price (Optional)"
                type="text"
                value={item.pricingType === "Quotation-based" ? "" : item.price}
                onChange={(val) => updateOffering(item.id, "price", val)}
                placeholder={
                  item.pricingType === "Quotation-based"
                    ? "Quotation-based"
                    : "Enter your price"
                }
              />

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Availability
                </label>
                <select
                  value={item.availability}
                  onChange={(e) =>
                    updateOffering(item.id, "availability", e.target.value)
                  }
                  className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
                >
                  {AVAILABILITY_STATUS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Website / Enquiry Link (Optional)"
                type="url"
                value={item.link || ""}
                onChange={(val) => updateOffering(item.id, "link", val)}
                placeholder="Enter your product or enquiry URL"
              />
            </div>

            {/* রো ৩: Detailed Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Detailed Description
              </label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) =>
                  updateOffering(item.id, "description", e.target.value)
                }
                placeholder="Enter your detailed product or service description"
                className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
