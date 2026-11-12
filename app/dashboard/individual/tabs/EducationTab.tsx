// app/dashboard/individual/tabs/EducationTab.tsx
"use client";

import { Plus, GraduationCap, School, Building2 } from "lucide-react";
import EducationCard from "./_components/EducationCard";
import { EducationItem as ServiceEducationItem } from "@/lib/individualService";

export type EducationType = "school" | "college" | "institute";

export interface EducationItem {
  id: string;
  type: EducationType;
  institutionName: string;
  universityName?: string;
  degreeOrStandard: string;
  session: string;
  gradeOrScore?: string;
  status?: "pursuing" | "completed";
}

interface TabProps {
  isEditing?: boolean;
  educationList: ServiceEducationItem[];
  onChange: (newList: ServiceEducationItem[]) => void;
}

export const SCHOOL_STANDARDS = [
  "8th Pass",
  "10th (Secondary)",
  "12th (Higher Secondary)",
];

export default function EducationTab({
  isEditing = false,
  educationList = [],
  onChange,
}: TabProps) {
  const uiItems: EducationItem[] = educationList.map((item, idx) => {
    const type: EducationType =
      (item.type as EducationType) ||
      (SCHOOL_STANDARDS.includes(item.degree) ? "school" : "college");

    const session =
      item.start_year && item.end_year
        ? `${item.start_year} - ${item.end_year}`
        : item.end_year || item.start_year || "";

    return {
      id: item.id || `edu-${idx}`,
      type,
      institutionName: item.institution ?? "",
      universityName: item.university ?? "",
      degreeOrStandard: item.degree ?? "",
      session,
      gradeOrScore: item.grade ?? "",
      status:
        (item.status as "pursuing" | "completed") ||
        (type === "college" ? "pursuing" : "completed"),
    };
  });

  const syncToParent = (updatedUiList: EducationItem[]) => {
    const serviceList: ServiceEducationItem[] = updatedUiList.map((ui) => {
      let start_year = "";
      let end_year = "";

      if (ui.session.includes("-")) {
        const parts = ui.session.split("-");
        start_year = parts[0] || "";
        end_year = parts[1] || "";
      } else {
        end_year = ui.session;
      }

      const isValidUUID =
        ui.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          ui.id,
        );

      return {
        id: isValidUUID ? ui.id : undefined,
        type: ui.type,
        degree: ui.degreeOrStandard,
        institution: ui.institutionName,
        university: ui.universityName,
        start_year,
        end_year,
        grade: ui.gradeOrScore || "",
        status: ui.status || "completed",
      };
    });

    onChange(serviceList);
  };

  const handleAddEducation = (selectedType: EducationType = "college") => {
    const newItem: EducationItem = {
      id: `new-${Date.now()}`,
      type: selectedType,
      institutionName: "",
      universityName: "",
      degreeOrStandard: selectedType === "school" ? SCHOOL_STANDARDS[1] : "",
      session: "",
      gradeOrScore: "",
      status: selectedType === "college" ? "pursuing" : undefined,
    };
    syncToParent([...uiItems, newItem]);
  };

  const handleRemoveEducation = (id: string) => {
    const filtered = uiItems.filter((item) => item.id !== id);
    syncToParent(filtered);
  };

  const handleUpdateItem = (
    id: string,
    field: keyof EducationItem,
    value: string,
  ) => {
    const updated = uiItems.map((item) => {
      if (item.id !== id) return item;
      if (field === "type") {
        const newType = value as EducationType;
        return {
          ...item,
          type: newType,
          degreeOrStandard: newType === "school" ? SCHOOL_STANDARDS[1] : "",
          universityName:
            newType === "college" ? item.universityName || "" : "",
          status: newType === "college" ? item.status || "pursuing" : undefined,
        };
      }
      return { ...item, [field]: value };
    });
    syncToParent(updated);
  };

  const getIcon = (type: EducationType) => {
    if (type === "school") return School;
    if (type === "institute") return Building2;
    return GraduationCap;
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* এডিট মোডে দ্রুত আইটেম অ্যাড করার কন্ট্রোল বার */}
      {isEditing && (
        <div className="flex items-center justify-end gap-1.5 flex-wrap pb-1">
          <button
            type="button"
            onClick={() => handleAddEducation("school")}
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3 w-3" /> School
          </button>
          <button
            type="button"
            onClick={() => handleAddEducation("college")}
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3 w-3" /> College
          </button>
          <button
            type="button"
            onClick={() => handleAddEducation("institute")}
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Institute
          </button>
        </div>
      )}

      {!isEditing ? (
        /* READ ONLY VIEW */
        <div className="space-y-3">
          {uiItems.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-300 bg-neutral-50/40 rounded-xs text-center space-y-1.5">
              <GraduationCap className="h-6 w-6 text-neutral-400 mx-auto" />
              <p className="text-xs font-mono text-neutral-600">
                No education details added yet.
              </p>
              <span className="text-[11px] text-neutral-400 block font-sans">
                Click Edit Details above to add your school, college, or
                institute records.
              </span>
            </div>
          ) : (
            uiItems.map((item) => {
              const Icon = getIcon(item.type);
              const isCollege = item.type === "college";

              return (
                <div
                  key={item.id}
                  className="p-4 border border-neutral-200/80 bg-neutral-50/60 rounded-xs flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="p-2 bg-white border border-neutral-200 rounded text-neutral-800 shrink-0 shadow-2xs">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                          {item.type}
                        </span>
                        {item.gradeOrScore && (
                          <span className="text-[9.5px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded-xs border border-neutral-200">
                            {item.gradeOrScore}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-mono font-bold text-neutral-950 truncate">
                        {item.degreeOrStandard || "Not Specified"}
                      </h4>
                      <p className="text-xs text-neutral-700 truncate font-sans">
                        {item.institutionName || "Institute Name Not Added"}
                      </p>
                      {isCollege && item.universityName && (
                        <p className="text-[11px] font-mono text-neutral-500 truncate">
                          University: {item.universityName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                      Year / Session
                    </span>
                    <span className="text-xs font-mono font-medium text-neutral-800 block">
                      {item.session || "N/A"}
                    </span>
                    {isCollege && item.status && (
                      <span
                        className={`inline-block text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-xs mt-1 border ${
                          item.status === "completed"
                            ? "bg-neutral-100 text-neutral-700 border-neutral-300"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {item.status === "completed" ? "Completed" : "Pursuing"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* EDIT FORM */
        <div className="space-y-4">
          {uiItems.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-300 bg-neutral-50/40 rounded-xs text-center space-y-3">
              <GraduationCap className="h-6 w-6 text-neutral-400 mx-auto" />
              <p className="text-xs font-mono text-neutral-600">
                No education added. Choose an option to start:
              </p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddEducation("school")}
                  className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs"
                >
                  + Add School
                </button>
                <button
                  type="button"
                  onClick={() => handleAddEducation("college")}
                  className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs"
                >
                  + Add College
                </button>
              </div>
            </div>
          ) : (
            uiItems.map((item, index) => (
              <EducationCard
                key={item.id}
                item={item}
                index={index}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveEducation}
              />
            ))
          )}

          {uiItems.length > 0 && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAddEducation("school")}
                className="py-2.5 border border-dashed border-neutral-300 text-xs font-mono uppercase text-neutral-600 hover:border-neutral-950 hover:text-neutral-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-50/20"
              >
                <Plus className="h-3.5 w-3.5" /> + Add School
              </button>
              <button
                type="button"
                onClick={() => handleAddEducation("college")}
                className="py-2.5 border border-dashed border-neutral-300 text-xs font-mono uppercase text-neutral-600 hover:border-neutral-950 hover:text-neutral-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-50/20"
              >
                <Plus className="h-3.5 w-3.5" /> + Add College
              </button>
              <button
                type="button"
                onClick={() => handleAddEducation("institute")}
                className="py-2.5 border border-dashed border-neutral-300 text-xs font-mono uppercase text-neutral-600 hover:border-neutral-950 hover:text-neutral-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-50/20"
              >
                <Plus className="h-3.5 w-3.5" /> + Add Institute
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
