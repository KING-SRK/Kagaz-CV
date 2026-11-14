// app/dashboard/individual/tabs/FamilyTab.tsx
"use client";

import { useEffect } from "react";
import { Users, Plus, Trash2, HeartHandshake } from "lucide-react";
import { FamilyItem } from "@/lib/individualService";

interface TabProps {
  isEditing?: boolean;
  familyList: FamilyItem[];
  onChange: (newList: FamilyItem[]) => void;
}

const createDefaultMember = (): FamilyItem => ({
  id: `fam-${Date.now()}`,
  relation: "Father",
  name: "",
  occupation: "",
  contact: "",
});

export default function FamilyTab({
  isEditing = false,
  familyList = [],
  onChange,
}: TabProps) {
  // ⚡ এডিট মোডে গেলে এবং লিস্ট খালি থাকলে অটোমেটিক ১টি মেম্বার কার্ড ওপেন থাকবে
  useEffect(() => {
    if (isEditing && familyList.length === 0) {
      onChange([createDefaultMember()]);
    }
  }, [isEditing, familyList.length, onChange]);

  const displayList =
    familyList.length > 0 ? familyList : [createDefaultMember()];

  const addMember = () => {
    onChange([...displayList, createDefaultMember()]);
  };

  const removeMember = (indexToRemove: number) => {
    onChange(displayList.filter((_, idx) => idx !== indexToRemove));
  };

  const updateMember = (
    indexToUpdate: number,
    field: keyof FamilyItem,
    value: string,
  ) => {
    onChange(
      displayList.map((m, idx) =>
        idx === indexToUpdate ? { ...m, [field]: value } : m,
      ),
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* হেডার ও মেম্বার যুক্ত করার বাটন */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-emerald-600" />
          Family & Emergency Contacts ({displayList.length})
        </span>

        {isEditing && (
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 transition-colors cursor-pointer rounded-xs"
          >
            <Plus className="h-3 w-3" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        /* ==================== VIEW MODE ==================== */
        <div className="space-y-4">
          {displayList.map((member, index) => (
            <div
              key={member.id || index}
              className="p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3"
            >
              {/* কার্ড হেডার */}
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
                <span className="text-[11px] font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-neutral-500" />
                  Member #{index + 1}
                </span>
                <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 uppercase rounded-xs">
                  {member.relation || "Father"}
                </span>
              </div>

              {/* ফিল্ডসমূহ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Full Name
                  </span>
                  <p
                    className={`font-medium truncate ${
                      member.name ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {member.name || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Occupation
                  </span>
                  <p
                    className={`font-medium truncate ${
                      member.occupation
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    }`}
                  >
                    {member.occupation || "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Phone / Contact
                  </span>
                  <p
                    className={`font-medium truncate ${
                      member.contact ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {member.contact || "Not Set"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ==================== EDIT MODE ==================== */
        <div className="space-y-4">
          {displayList.map((member, index) => (
            <div
              key={member.id || index}
              className="p-4 border border-neutral-200/90 bg-neutral-50/40 rounded-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
                  Member #{index + 1}
                </span>
                {displayList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Relationship
                  </label>
                  <select
                    value={member.relation}
                    onChange={(e) =>
                      updateMember(index, "relation", e.target.value)
                    }
                    className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 cursor-pointer"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Relative">Relative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={member.name || ""}
                    placeholder="Enter family member's full name"
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                    className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Occupation (Optional)
                  </label>
                  <input
                    type="text"
                    value={member.occupation || ""}
                    placeholder="Enter occupation or profession"
                    onChange={(e) =>
                      updateMember(index, "occupation", e.target.value)
                    }
                    className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Phone / Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={member.contact || ""}
                    placeholder="Enter contact phone number"
                    onChange={(e) =>
                      updateMember(index, "contact", e.target.value)
                    }
                    className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMember}
            className="w-full py-2.5 border border-dashed border-neutral-300 text-xs font-mono uppercase text-neutral-600 hover:border-neutral-950 hover:text-neutral-950 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-neutral-50/20 rounded-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Another Member</span>
          </button>
        </div>
      )}
    </div>
  );
}
