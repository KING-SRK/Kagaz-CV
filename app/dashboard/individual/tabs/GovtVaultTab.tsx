// app/dashboard/individual/tabs/GovtVaultTab.tsx
"use client";

import { useState } from "react";
import { ShieldCheck, Lock, Trash2, Eye, EyeOff, Plus } from "lucide-react";

export interface VaultData {
  id?: string;
  docType: string;
  docNumber: string;
}

interface TabProps {
  isEditing?: boolean;
  vaultList: VaultData[];
  onChange: (data: VaultData[]) => void;
}

// 🎨 লোকাল ইমেজ পাথ
const ID_LOGOS: Record<string, { path: string; alt: string }> = {
  Aadhaar: {
    path: "/ids/aadhaar.png",
    alt: "Aadhaar Card",
  },
  "PAN Card": {
    path: "/ids/pan.png",
    alt: "Income Tax PAN Card",
  },
  "Voter ID": {
    path: "/ids/voter.png",
    alt: "Voter Identity Card",
  },
  "Ration Card": {
    path: "/ids/ration.png",
    alt: "Digital Ration Card",
  },
  "Driving License": {
    path: "/ids/license.png",
    alt: "Driving License",
  },
  Passport: {
    path: "/ids/passport.png",
    alt: "Indian Passport",
  },
};

function IdBrandIcon({
  type,
  className = "h-8 w-8",
}: {
  type: string;
  className?: string;
}) {
  const iconData = ID_LOGOS[type];

  if (!iconData) {
    return <ShieldCheck className={`${className} text-neutral-400`} />;
  }

  return (
    <img
      src={iconData.path}
      alt={iconData.alt}
      loading="lazy"
      className={`${className} object-contain`}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

export const ID_OPTIONS = [
  "Aadhaar",
  "PAN Card",
  "Voter ID",
  "Ration Card",
  "Driving License",
  "Passport",
];

export default function GovtVaultTab({
  isEditing = false,
  vaultList = [],
  onChange,
}: TabProps) {
  const [visibleIds, setVisibleIds] = useState<Record<number, boolean>>({});

  const toggleVisibility = (index: number) => {
    setVisibleIds((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getMaskedDisplay = (val: string) => {
    if (!val) return "";
    if (val.length <= 4) return "••••";
    return `•••• •••• ${val.slice(-4)}`;
  };

  const handleAddId = () => {
    const newItem: VaultData = {
      id: `vault-${Date.now()}`,
      docType: "PAN Card",
      docNumber: "",
    };
    onChange([...vaultList, newItem]);
  };

  const handleRemoveId = (indexToRemove: number) => {
    onChange(vaultList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateId = (
    indexToUpdate: number,
    field: keyof VaultData,
    value: string,
  ) => {
    onChange(
      vaultList.map((item, idx) =>
        idx === indexToUpdate ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* হেডার */}
      <div className="flex items-center justify-end border-b border-neutral-100 pb-3">
        {isEditing && (
          <button
            type="button"
            onClick={handleAddId}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 transition-colors cursor-pointer border border-neutral-300 rounded-xs"
          >
            <Plus className="h-3 w-3" />
            <span>Add ID</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        /* ==================== VIEW MODE (READ ONLY) ==================== */
        <div className="space-y-3">
          {vaultList.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-300 bg-neutral-50/40 rounded-xs text-center space-y-2">
              <ShieldCheck className="h-6 w-6 text-neutral-400 mx-auto" />
              <p className="text-xs font-mono text-neutral-700 font-medium">
                No ID document added
              </p>
              <p className="text-[11px] text-neutral-500 max-w-sm mx-auto font-sans">
                This section is completely optional. You can still use your
                SutraNet card and share your portfolio freely without it.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vaultList.map((item, index) => {
                const isVisible = Boolean(visibleIds[index]);
                return (
                  <div
                    key={item.id || index}
                    className="p-3.5 border border-neutral-200/80 bg-neutral-50/60 rounded-xs flex items-center justify-between gap-3 shadow-2xs hover:bg-neutral-50 transition-colors"
                  >
                    {/* বাঁদিকের আইকন ও নাম */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 bg-white border border-neutral-200 rounded-md flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                        <IdBrandIcon
                          type={item.docType}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-mono font-bold text-neutral-900 truncate">
                          {item.docType || "ID Document"}
                        </h4>
                      </div>
                    </div>

                    {/* ডানদিকের আইডি নম্বর ও Show/Hide */}
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-xs font-mono font-medium text-neutral-900">
                        {isVisible
                          ? item.docNumber
                          : getMaskedDisplay(item.docNumber)}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleVisibility(index)}
                        className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                        title={isVisible ? "Hide number" : "Show number"}
                      >
                        {isVisible ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-xs flex items-start gap-2.5 text-[11px] font-mono text-neutral-500 leading-relaxed">
            <Lock className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <span>
              Your ID numbers are securely stored in your private vault and are
              never exposed on your public profile link.
            </span>
          </div>
        </div>
      ) : (
        /* ==================== EDIT MODE (CLEAN & SIMPLE) ==================== */
        <div className="space-y-3">
          {vaultList.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-300 bg-neutral-50/40 rounded-xs text-center space-y-3">
              <ShieldCheck className="h-6 w-6 text-neutral-400 mx-auto" />
              <div className="space-y-0.5">
                <p className="text-xs font-mono text-neutral-700 font-medium">
                  No IDs linked to your account.
                </p>
                <span className="text-[11px] text-neutral-400 block font-sans">
                  Click the button below to add your government identity cards.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddId}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-white bg-neutral-950 hover:bg-neutral-800 px-3.5 py-2 transition-colors cursor-pointer rounded-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add First ID</span>
              </button>
            </div>
          ) : (
            vaultList.map((item, index) => (
              <div
                key={item.id || index}
                className="p-3 border border-neutral-200/90 bg-neutral-50/50 rounded-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
              >
                {/* বাঁদিকের অংশ: আইকন + ড্রপডাউন সিলেক্টর */}
                <div className="flex items-center gap-3 min-w-50">
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded p-1 flex items-center justify-center shrink-0 shadow-2xs">
                    <IdBrandIcon
                      type={item.docType}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[9.5px] font-mono uppercase text-neutral-400 mb-0.5">
                      Document Type
                    </label>
                    <select
                      value={item.docType}
                      onChange={(e) =>
                        handleUpdateId(index, "docType", e.target.value)
                      }
                      className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 cursor-pointer rounded-xs"
                    >
                      {ID_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ডানদিকের অংশ: আইডি নম্বর ইনপুট + ডিলিট বাটন */}
                <div className="flex items-center gap-2 flex-1 sm:max-w-md">
                  <div className="flex-1">
                    <label className="block text-[9.5px] font-mono uppercase text-neutral-400 mb-0.5">
                      Document Number
                    </label>
                    <input
                      type="text"
                      value={item.docNumber}
                      placeholder={`Enter ${item.docType} number`}
                      onChange={(e) =>
                        handleUpdateId(index, "docNumber", e.target.value)
                      }
                      className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 rounded-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveId(index)}
                    className="text-neutral-400 hover:text-red-600 transition-colors p-2 mt-3 cursor-pointer shrink-0"
                    title="Remove ID"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
