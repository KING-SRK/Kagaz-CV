// app/dashboard/organization/tabs/OrgOfferingsTab.tsx
"use client";

import { Package, Wrench, Plus, Trash2, ExternalLink, Tag } from "lucide-react";
import { OrgOfferingItem } from "@/lib/organizationService";

interface Props {
  isEditing: boolean;
  offerings: OrgOfferingItem[];
  onChange: (updated: OrgOfferingItem[]) => void;
}

export default function OrgOfferingsTab({
  isEditing,
  offerings = [],
  onChange,
}: Props) {
  const handleAdd = (type: "Product" | "Service") => {
    const newItem: OrgOfferingItem = {
      id: Date.now().toString(),
      type,
      name: "",
      category: "",
      description: "",
      price: "",
      pricingType: "Fixed",
      availability: "Available",
      link: "",
    };
    onChange([...offerings, newItem]);
  };

  const handleUpdate = (
    id: string,
    field: keyof OrgOfferingItem,
    value: string,
  ) => {
    onChange(
      offerings.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    onChange(offerings.filter((item) => item.id !== id));
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    if (offerings.length === 0) {
      return (
        <div className="p-8 border border-dashed border-neutral-200 rounded-xs text-center space-y-1">
          <Package className="h-6 w-6 text-neutral-300 mx-auto" />
          <p className="text-xs font-mono text-neutral-500">
            No products or services listed yet.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {offerings.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs border ${
                    item.type === "Product"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {item.type === "Product" ? (
                    <Package className="h-2.5 w-2.5" />
                  ) : (
                    <Wrench className="h-2.5 w-2.5" />
                  )}
                  {item.type}
                </span>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-xs ${
                    item.availability === "Available"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {item.availability}
                </span>
              </div>

              <h3 className="text-sm font-serif font-bold text-neutral-950 pt-0.5">
                {item.name || "Untitled Offering"}
              </h3>

              {item.category && (
                <p className="text-[10.5px] font-mono text-neutral-500 flex items-center gap-1">
                  <Tag className="h-3 w-3 text-neutral-400" /> {item.category}
                </p>
              )}

              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {item.description || "No description provided."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-neutral-200/70">
              <div className="text-xs font-mono">
                {item.pricingType === "Quotation-based" ? (
                  <span className="text-neutral-600 font-semibold">
                    Custom Quote
                  </span>
                ) : (
                  <span className="font-bold text-neutral-950">
                    {item.pricingType === "Starting From" ? "From " : ""}
                    {item.price ? `₹${item.price}` : "Price on Request"}
                  </span>
                )}
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 hover:underline"
                >
                  <span>Enquire</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono uppercase text-neutral-500 font-bold">
          Products & Services Catalog ({offerings.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAdd("Product")}
            className="inline-flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Product
          </button>
          <button
            type="button"
            onClick={() => handleAdd("Service")}
            className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Service
          </button>
        </div>
      </div>

      {offerings.map((item, idx) => (
        <div
          key={item.id}
          className="p-4 bg-neutral-50/50 border border-neutral-200 rounded-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
            <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
              #{idx + 1} • {item.type}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Type
              </label>
              <select
                value={item.type}
                onChange={(e) =>
                  handleUpdate(
                    item.id,
                    "type",
                    e.target.value as "Product" | "Service",
                  )
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              >
                <option value="Product">Product</option>
                <option value="Service">Service</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Offering Name *
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                placeholder="e.g. Full-Stack Website / Custom PC"
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Category
              </label>
              <input
                type="text"
                value={item.category}
                onChange={(e) =>
                  handleUpdate(item.id, "category", e.target.value)
                }
                placeholder="e.g. Web Development / Hardware"
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Pricing Type
              </label>
              <select
                value={item.pricingType}
                onChange={(e) =>
                  handleUpdate(item.id, "pricingType", e.target.value)
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              >
                <option value="Fixed">Fixed Price</option>
                <option value="Starting From">Starting From</option>
                <option value="Quotation-based">Quotation-based</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Price (₹ INR)
              </label>
              <input
                type="text"
                value={item.price}
                disabled={item.pricingType === "Quotation-based"}
                onChange={(e) => handleUpdate(item.id, "price", e.target.value)}
                placeholder="e.g. 4999"
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono disabled:bg-neutral-100"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Availability
              </label>
              <select
                value={item.availability}
                onChange={(e) =>
                  handleUpdate(item.id, "availability", e.target.value)
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  handleUpdate(item.id, "description", e.target.value)
                }
                placeholder="Features, specs or service details..."
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Enquiry / Order Link (Optional)
              </label>
              <input
                type="url"
                value={item.link || ""}
                onChange={(e) => handleUpdate(item.id, "link", e.target.value)}
                placeholder="https://..."
                className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
