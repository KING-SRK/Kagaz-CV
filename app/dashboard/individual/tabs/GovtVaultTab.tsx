// app/dashboard/individual/tabs/GovtVaultTab.tsx
"use client";

import { useState, useEffect } from "react";
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

const createDefaultVaultItem = (): VaultData => ({
  id: `vault-${Date.now()}`,
  docType: "PAN Card",
  docNumber: "",
});

export default function GovtVaultTab({
  isEditing = false,
  vaultList = [],
  onChange,
}: TabProps) {
  const [visibleIds, setVisibleIds] = useState<Record<number, boolean>>({});

  // ⚡ এডিট মোডে গেলে এবং লিস্ট খালি থাকলে অটোমেটিক ১টি ডিফল্ট আইডি কার্ড খুলে থাকবে
  useEffect(() => {
    if (isEditing && vaultList.length === 0) {
      onChange([createDefaultVaultItem()]);
    }
  }, [isEditing, vaultList.length, onChange]);

  const displayList =
    vaultList.length > 0 ? vaultList : [createDefaultVaultItem()];

  const toggleVisibility = (index: number) => {
    setVisibleIds((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getMaskedDisplay = (val: string) => {
    if (!val) return "Not Set";
    if (val.length <= 4) return "••••";
    return `•••• •••• ${val.slice(-4)}`;
  };

  const handleAddId = () => {
    onChange([...displayList, createDefaultVaultItem()]);
  };

  const handleRemoveId = (indexToRemove: number) => {
    onChange(displayList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateId = (
    indexToUpdate: number,
    field: keyof VaultData,
    value: string,
  ) => {
    onChange(
      displayList.map((item, idx) =>
        idx === indexToUpdate ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* হেডার ও Add ID বাটন */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Government & Identity Vault ({displayList.length})
        </span>

        {isEditing && (
          <button
            type="button"
            onClick={handleAddId}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 transition-colors cursor-pointer rounded-xs"
          >
            <Plus className="h-3 w-3" />
            <span>Add ID</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        /* ==================== VIEW MODE (READ ONLY) ==================== */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {displayList.map((item, index) => {
              const isVisible = Boolean(visibleIds[index]);
              const hasNumber = Boolean(item.docNumber?.trim());

              return (
                <div
                  key={item.id || index}
                  className="p-4 border border-neutral-200 bg-neutral-50/60 rounded-xs space-y-3"
                >
                  {/* কার্ড হেডার */}
                  <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
                    <span className="text-[10.5px] font-mono uppercase font-bold text-neutral-600">
                      Identity Document #{index + 1}
                    </span>
                    <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 bg-white border border-neutral-200 text-neutral-500 rounded-xs">
                      Private Vault
                    </span>
                  </div>

                  {/* আইকন, টাইপ এবং মাস্ক করা নম্বর */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 bg-white border border-neutral-200 rounded-xs flex items-center justify-center p-1.5 shrink-0">
                        <IdBrandIcon
                          type={item.docType}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-mono uppercase text-neutral-400 block">
                          Document Type
                        </span>
                        <h4 className="text-xs font-mono font-bold text-neutral-900 truncate">
                          {item.docType || "PAN Card"}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9.5px] font-mono uppercase text-neutral-400 block">
                        Document Number
                      </span>
                      <div className="flex items-center justify-end gap-1.5">
                        <p
                          className={`text-xs font-mono font-medium ${
                            hasNumber ? "text-neutral-900" : "text-neutral-400"
                          }`}
                        >
                          {isVisible && hasNumber
                            ? item.docNumber
                            : getMaskedDisplay(item.docNumber)}
                        </p>
                        {hasNumber && (
                          <button
                            type="button"
                            onClick={() => toggleVisibility(index)}
                            className="text-neutral-400 hover:text-neutral-800 transition-colors p-0.5 cursor-pointer"
                            title={isVisible ? "Hide number" : "Show number"}
                          >
                            {isVisible ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-xs flex items-start gap-2.5 text-[11px] font-mono text-neutral-500 leading-relaxed">
            <Lock className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <span>
              Your ID numbers are securely stored in your private vault and are
              never exposed on your public profile link.
            </span>
          </div>
        </div>
      ) : (
        /* ==================== EDIT MODE ==================== */
        <div className="space-y-3">
          {displayList.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3.5 border border-neutral-200/90 bg-neutral-50/50 rounded-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
            >
              {/* বাঁদিকের অংশ: আইকন + ড্রপডাউন সিলেক্টর */}
              <div className="flex items-center gap-3 min-w-52">
                <div className="w-10 h-10 bg-white border border-neutral-200 rounded p-1 flex items-center justify-center shrink-0">
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
                    placeholder={`Enter your ${item.docType} number`}
                    onChange={(e) =>
                      handleUpdateId(index, "docNumber", e.target.value)
                    }
                    className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 rounded-xs"
                  />
                </div>

                {displayList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveId(index)}
                    className="text-neutral-400 hover:text-red-600 transition-colors p-2 mt-3 cursor-pointer shrink-0"
                    title="Remove ID"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
