// app/dashboard/individual/tabs/FamilyTab.tsx
"use client";

import { Users, Plus, Trash2, HeartHandshake } from "lucide-react";
import { FamilyItem } from "@/lib/individualService";

interface TabProps {
  isEditing?: boolean;
  familyList: FamilyItem[];
  onChange: (newList: FamilyItem[]) => void;
}

export default function FamilyTab({
  isEditing = false,
  familyList = [],
  onChange,
}: TabProps) {
  const addMember = () => {
    const newMember: FamilyItem = {
      id: `fam-${Date.now()}`,
      relation: "Father",
      name: "",
      occupation: "",
      contact: "",
    };
    onChange([...familyList, newMember]);
  };

  const removeMember = (indexToRemove: number) => {
    onChange(familyList.filter((_, idx) => idx !== indexToRemove));
  };

  const updateMember = (
    indexToUpdate: number,
    field: keyof FamilyItem,
    value: string,
  ) => {
    onChange(
      familyList.map((m, idx) =>
        idx === indexToUpdate ? { ...m, [field]: value } : m,
      ),
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* এডিট মোডে মেম্বার যুক্ত করার বাটন */}
      {isEditing && (
        <div className="flex justify-end pb-1">
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 transition-colors cursor-pointer border border-neutral-300 rounded-xs"
          >
            <Plus className="h-3 w-3" />
            <span>Add Member</span>
          </button>
        </div>
      )}

      {!isEditing ? (
        /* READ ONLY VIEW */
        <div className="space-y-3">
          {familyList.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-300 bg-neutral-50/40 rounded-xs text-center space-y-1.5">
              <Users className="h-6 w-6 text-neutral-400 mx-auto" />
              <p className="text-xs font-mono text-neutral-700 font-medium">
                No family details added yet.
              </p>
              <span className="text-[11px] text-neutral-400 block font-sans">
                Click Edit Details above to add family members or emergency
                contacts.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {familyList.map((member, index) => (
                <div
                  key={member.id || index}
                  className="p-3.5 border border-neutral-200/80 bg-neutral-50/60 rounded-xs flex items-start gap-3"
                >
                  <div className="p-2 bg-white border border-neutral-200 rounded text-neutral-700 shrink-0">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="text-[9.5px] font-mono uppercase text-neutral-400 font-semibold block">
                      {member.relation}
                    </span>
                    <h4 className="text-xs font-mono font-bold text-neutral-950 truncate">
                      {member.name || "Name Not Set"}
                    </h4>
                    {member.occupation && (
                      <p className="text-[11px] font-mono text-neutral-600 truncate">
                        {member.occupation}
                      </p>
                    )}
                    {member.contact && (
                      <span className="text-[10px] font-mono text-neutral-500 block pt-0.5">
                        Contact: {member.contact}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* EDIT MODE */
        <div className="space-y-4">
          {familyList.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-300 bg-neutral-50/40 rounded-xs text-center space-y-3">
              <Users className="h-6 w-6 text-neutral-400 mx-auto" />
              <div className="space-y-0.5">
                <p className="text-xs font-mono text-neutral-700 font-medium">
                  No family members added.
                </p>
                <span className="text-[11px] text-neutral-400 block font-sans">
                  Click the button below to add your first member.
                </span>
              </div>
              <button
                type="button"
                onClick={addMember}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-white bg-neutral-900 hover:bg-neutral-800 px-3.5 py-2 transition-colors cursor-pointer rounded-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Family Member</span>
              </button>
            </div>
          ) : (
            familyList.map((member, index) => (
              <div
                key={member.id || index}
                className="p-4 border border-neutral-200/90 bg-neutral-50/40 rounded-xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
                    Member #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
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
                      placeholder="e.g. Member Name"
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
                      placeholder="e.g. Teacher, Engineer, Homemaker"
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
                      placeholder="e.g. +91 98765 43210"
                      onChange={(e) =>
                        updateMember(index, "contact", e.target.value)
                      }
                      className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {familyList.length > 0 && (
            <button
              type="button"
              onClick={addMember}
              className="w-full py-2.5 border border-dashed border-neutral-300 text-xs font-mono uppercase text-neutral-600 hover:border-neutral-950 hover:text-neutral-950 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-neutral-50/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Another Member</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
