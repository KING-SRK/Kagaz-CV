// app/find-enterprise/components/EnterpriseFilters.tsx
"use client";

import {
  ShieldCheck,
  Briefcase,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  X,
  Building2,
  Layers,
  Wrench,
} from "lucide-react";

interface EnterpriseFiltersProps {
  availableIndustries: string[];
  selectedIndustry: string;
  onSelectIndustry: (industry: string) => void;
  availableBusinessTypes: string[];
  selectedBusinessType: string;
  onSelectBusinessType: (type: string) => void;
  popularServices: string[];
  selectedService: string;
  onSelectService: (service: string) => void;
  selectedLocation: string;
  onChangeLocation: (loc: string) => void;
  onlyVerified: boolean;
  onToggleVerified: (val: boolean) => void;
  onlyHiring: boolean;
  onToggleHiring: (val: boolean) => void;
  activeFilterCount: number;
  hasSearchQuery: boolean;
  onResetAll: () => void;
  // মোবাইল ড্রয়ার প্রপস
  mobileOpen: boolean;
  onCloseMobile: () => void;
  totalResults: number;
}

export default function EnterpriseFilters({
  availableIndustries,
  selectedIndustry,
  onSelectIndustry,
  availableBusinessTypes,
  selectedBusinessType,
  onSelectBusinessType,
  popularServices,
  selectedService,
  onSelectService,
  selectedLocation,
  onChangeLocation,
  onlyVerified,
  onToggleVerified,
  onlyHiring,
  onToggleHiring,
  activeFilterCount,
  hasSearchQuery,
  onResetAll,
  mobileOpen,
  onCloseMobile,
  totalResults,
}: EnterpriseFiltersProps) {
  const filterControls = (
    <div className="space-y-4 sm:space-y-5">
      {/* ১. Verification & Hiring Status */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
          Trust &amp; Hiring Status
        </p>

        <label className="flex items-center gap-2.5 p-2.5 sm:p-2 border border-neutral-200 bg-neutral-50/70 rounded-xs cursor-pointer hover:border-neutral-400 active:bg-neutral-100 transition-colors">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => onToggleVerified(e.target.checked)}
            className="h-4 w-4 sm:h-3.5 sm:w-3.5 accent-neutral-950 rounded-xs cursor-pointer shrink-0"
          />
          <span className="text-xs font-medium text-neutral-800 flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Verified Entities Only</span>
          </span>
        </label>

        <label className="flex items-center gap-2.5 p-2.5 sm:p-2 border border-neutral-200 bg-neutral-50/70 rounded-xs cursor-pointer hover:border-neutral-400 active:bg-neutral-100 transition-colors">
          <input
            type="checkbox"
            checked={onlyHiring}
            onChange={(e) => onToggleHiring(e.target.checked)}
            className="h-4 w-4 sm:h-3.5 sm:w-3.5 accent-neutral-950 rounded-xs cursor-pointer shrink-0"
          />
          <span className="text-xs font-medium text-neutral-800 flex items-center gap-1.5 min-w-0">
            <Briefcase className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Actively Hiring (Open Jobs)</span>
          </span>
        </label>
      </div>

      {/* ২. Industry / Category (Select Dropdown) */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-200">
        <label className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
          <Layers className="h-3 w-3 shrink-0" />
          <span>Industry / Sector</span>
        </label>
        <select
          value={selectedIndustry}
          onChange={(e) => onSelectIndustry(e.target.value)}
          className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-xs font-mono border border-neutral-300 bg-white text-neutral-900 rounded-xs focus:outline-none focus:border-neutral-950 cursor-pointer"
        >
          {availableIndustries.map((ind) => (
            <option key={ind} value={ind}>
              {ind === "All" ? "All Industries" : ind}
            </option>
          ))}
        </select>
      </div>

      {/* ৩. Entity / Business Type (Select Dropdown) */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-200">
        <label className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
          <Building2 className="h-3 w-3 shrink-0" />
          <span>Entity Type</span>
        </label>
        <select
          value={selectedBusinessType}
          onChange={(e) => onSelectBusinessType(e.target.value)}
          className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-xs font-mono border border-neutral-300 bg-white text-neutral-900 rounded-xs focus:outline-none focus:border-neutral-950 cursor-pointer"
        >
          {availableBusinessTypes.map((type) => (
            <option key={type} value={type}>
              {type === "All" ? "All Entity Types" : type}
            </option>
          ))}
        </select>
      </div>

      {/* ৪. Service / Offering Filter (Select Dropdown) */}
      {popularServices.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-neutral-200">
          <label className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            <Wrench className="h-3 w-3 shrink-0" />
            <span>Service / Solution</span>
          </label>
          <select
            value={selectedService}
            onChange={(e) => onSelectService(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-xs font-mono border border-neutral-300 bg-white text-neutral-900 rounded-xs focus:outline-none focus:border-neutral-950 cursor-pointer"
          >
            <option value="">All Services</option>
            {popularServices.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ৫. City / Location Filter */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-200">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
          City / Location
        </label>
        <div className="relative">
          <MapPin className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
          <input
            type="text"
            placeholder="e.g. Barrackpore, Kolkata"
            value={selectedLocation}
            onChange={(e) => onChangeLocation(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs border border-neutral-300 bg-white rounded-xs focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Reset Button */}
      {(activeFilterCount > 0 || hasSearchQuery) && (
        <div className="pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onResetAll}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 sm:py-2 border border-neutral-300 bg-white text-xs font-mono uppercase text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 rounded-xs cursor-pointer transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 💻 ডেস্কটপ স্টিকি ফিল্টার সাইডবার */}
      <aside className="hidden lg:block lg:col-span-3 bg-white border border-neutral-300 p-5 pr-3.5 rounded-xs shadow-2xs sticky top-41 max-h-[calc(100vh-11.5rem)] overflow-y-auto scrollbar-thin [scrollbar-color:#d4d4d4_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
            <span>Filter Enterprise</span>
          </h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {filterControls}
      </aside>

      {/* 📱 মোবাইল ফিল্টার স্লাইড-আউট ড্রয়ার (< lg) */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[86vw] max-w-xs bg-white h-full flex flex-col shadow-2xl border-l border-neutral-300"
          >
            {/* ড্রয়ার হেডার */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-200 bg-neutral-50 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-950">
                  Filter Enterprise
                </h3>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-neutral-900 text-white text-[10px] font-mono rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close filters"
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-xs cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* স্ক্রলযোগ্য ফিল্টার কন্ট্রোলস */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin [scrollbar-color:#d4d4d4_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300">
              {filterControls}
            </div>

            {/* ফিক্সড নিচের অ্যাকশন বাটন */}
            <div className="p-3.5 border-t border-neutral-200 bg-neutral-50 shrink-0">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-2.5 bg-neutral-950 text-white text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 active:bg-neutral-900 transition-colors cursor-pointer"
              >
                Show {totalResults} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
