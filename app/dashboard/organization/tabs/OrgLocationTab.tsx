// app/dashboard/organization/tabs/OrgLocationTab.tsx
"use client";

import { useEffect } from "react";
import { MapPin, Plus, Trash2, ExternalLink, Navigation } from "lucide-react";
import { OrgBranchItem } from "@/lib/organizationService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import {
  LOCATION_TYPES,
  COUNTRIES,
  INDIAN_STATES,
  STATE_DISTRICTS,
  formatOtherDisplay,
} from "@/constants/orgOptions";

interface Props {
  isEditing: boolean;
  branches: OrgBranchItem[];
  onChange: (newBranches: OrgBranchItem[]) => void;
}

const createDefaultBranch = (isFirst: boolean): OrgBranchItem => ({
  id: Date.now().toString(),
  locationType: isFirst ? "Head Office" : "Branch Office",
  country: "",
  state: "",
  district: "",
  city: "",
  area: "",
  street: "",
  buildingNo: "",
  pincode: "",
  mapUrl: "",
});

export default function OrgLocationTab({
  isEditing,
  branches = [],
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing && branches.length === 0) {
      onChange([createDefaultBranch(true)]);
    }
  }, [isEditing, branches.length, onChange]);

  const addBranch = () => {
    onChange([...branches, createDefaultBranch(branches.length === 0)]);
  };

  const updateBranch = (
    id: string,
    field: keyof OrgBranchItem,
    val: string,
  ) => {
    onChange(
      branches.map((b) => {
        if (b.id !== id) return b;
        if (field === "country") {
          return {
            ...b,
            country: val,
            state: "",
            district: "",
          };
        }
        if (field === "state") {
          return {
            ...b,
            state: val,
            district: "",
          };
        }
        return { ...b, [field]: val };
      }),
    );
  };

  const removeBranch = (id: string) => {
    onChange(branches.filter((b) => b.id !== id));
  };

  const displayBranches =
    branches.length > 0 ? branches : [createDefaultBranch(true)];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Business Locations & Branches ({displayBranches.length})
          </span>
        </div>

        {displayBranches.map((b, idx) => {
          const locTypeLabel = formatOtherDisplay(b.locationType);
          const countryLabel = formatOtherDisplay(b.country);
          const stateLabel = formatOtherDisplay(b.state);
          const districtLabel = formatOtherDisplay(b.district);

          return (
            <div
              key={b.id}
              className="p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5"
            >
              {/* কার্ড হেডার */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                    Location #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono uppercase rounded-xs">
                    {locTypeLabel || "Head Office"}
                  </span>
                </div>

                {b.mapUrl ? (
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-[10.5px] font-mono uppercase text-neutral-900 rounded-xs transition-colors"
                  >
                    <Navigation className="h-3 w-3 text-blue-600" />
                    <span>View on Google Maps</span>
                    <ExternalLink className="h-2.5 w-2.5 text-neutral-400" />
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-400">
                    Map Link: Not Set
                  </span>
                )}
              </div>

              {/* রো ১: Location Type, Country, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Location Type
                  </span>
                  <p className="font-medium text-neutral-900 truncate">
                    {locTypeLabel || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Country
                  </span>
                  <p
                    className={`font-medium truncate ${
                      countryLabel ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {countryLabel || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    State / Province
                  </span>
                  <p
                    className={`font-medium truncate ${
                      stateLabel ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {stateLabel || "Not Set"}
                  </p>
                </div>
              </div>

              {/* রো ২: District, City, Area / Locality, PIN Code */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    District
                  </span>
                  <p
                    className={`font-medium truncate ${
                      districtLabel ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {districtLabel || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    City / Town
                  </span>
                  <p
                    className={`font-medium truncate ${
                      b.city ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {b.city || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Area / Locality
                  </span>
                  <p
                    className={`font-medium truncate ${
                      b.area ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {b.area || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    PIN / ZIP Code
                  </span>
                  <p
                    className={`font-medium truncate ${
                      b.pincode ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {b.pincode || "Not Set"}
                  </p>
                </div>
              </div>

              {/* রো ৩: Building / Shop Number & Street Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Building / Shop Number
                  </span>
                  <p
                    className={`font-medium truncate ${
                      b.buildingNo ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {b.buildingNo || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Street Address
                  </span>
                  <p
                    className={`font-medium truncate ${
                      b.street ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {b.street || "Not Set"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-5">
      {/* হেডার ও নতুন ব্রাঞ্চ যোগ করার বাটন */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
            Business Addresses & Branches ({displayBranches.length})
          </span>
          <span className="text-[11px] font-sans text-neutral-500">
            Add your primary shop/head office and any additional branch
            locations.
          </span>
        </div>
        <button
          type="button"
          onClick={addBranch}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Add Branch
        </button>
      </div>

      {/* প্রতিটি লোকেশন কার্ড */}
      <div className="space-y-4">
        {displayBranches.map((b, idx) => {
          const isIndia = b.country === "India";
          const districtOptions =
            isIndia && b.state && STATE_DISTRICTS[b.state]
              ? STATE_DISTRICTS[b.state]
              : [];

          return (
            <div
              key={b.id}
              className="p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5"
            >
              {/* কার্ড হেডার */}
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                  Location #{idx + 1}
                </span>

                {displayBranches.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBranch(b.id)}
                    title="Remove Location"
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* রো ১: Location Type, Country, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                <FormSelectWithOther
                  label="Location Type"
                  value={b.locationType}
                  options={LOCATION_TYPES}
                  placeholder="Select location type"
                  otherPlaceholder="Enter your location type"
                  onChange={(val) => updateBranch(b.id, "locationType", val)}
                />

                <FormSelectWithOther
                  label="Country"
                  value={b.country}
                  options={COUNTRIES}
                  placeholder="Select country"
                  otherPlaceholder="Enter your country"
                  onChange={(val) => updateBranch(b.id, "country", val)}
                />

                {isIndia ? (
                  <FormSelectWithOther
                    label="State"
                    value={b.state}
                    options={INDIAN_STATES}
                    placeholder="Select state"
                    otherPlaceholder="Enter your state"
                    onChange={(val) => updateBranch(b.id, "state", val)}
                  />
                ) : (
                  <FormInput
                    label="State / Province"
                    value={b.state}
                    onChange={(val) => updateBranch(b.id, "state", val)}
                    placeholder="Enter your state or province"
                  />
                )}
              </div>

              {/* রো ২: District, City, Area / Locality, PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                {districtOptions.length > 0 ? (
                  <FormSelectWithOther
                    label="District"
                    value={b.district}
                    options={districtOptions}
                    placeholder="Select district"
                    otherPlaceholder="Enter your district"
                    onChange={(val) => updateBranch(b.id, "district", val)}
                  />
                ) : (
                  <FormInput
                    label="District"
                    value={b.district}
                    onChange={(val) => updateBranch(b.id, "district", val)}
                    placeholder="Enter your district"
                  />
                )}

                <FormInput
                  label="City"
                  value={b.city}
                  onChange={(val) => updateBranch(b.id, "city", val)}
                  placeholder="Enter your city"
                />

                <FormInput
                  label="Area / Locality"
                  value={b.area}
                  onChange={(val) => updateBranch(b.id, "area", val)}
                  placeholder="Enter your area or locality"
                />

                <FormInput
                  label="PIN Code"
                  value={b.pincode}
                  onChange={(val) => updateBranch(b.id, "pincode", val)}
                  placeholder="Enter your PIN code"
                />
              </div>

              {/* রো ৩: Building / Shop Number & Street Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Building / Shop Number"
                  value={b.buildingNo}
                  onChange={(val) => updateBranch(b.id, "buildingNo", val)}
                  placeholder="Enter your building or shop number"
                />

                <FormInput
                  label="Street Address"
                  value={b.street}
                  onChange={(val) => updateBranch(b.id, "street", val)}
                  placeholder="Enter your street address"
                />
              </div>

              {/* রো ৪: Google Maps Location URL */}
              <FormInput
                label="Google Maps Location URL"
                type="url"
                value={b.mapUrl}
                onChange={(val) => updateBranch(b.id, "mapUrl", val)}
                placeholder="Enter your Google Maps location URL"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
