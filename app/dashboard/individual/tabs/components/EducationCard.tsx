// app/dashboard/_components/profile/tabs/components/EducationCard.tsx
"use client";

import { Trash2 } from "lucide-react";
import {
  EducationItem,
  EducationType,
  SCHOOL_STANDARDS,
} from "../EducationTab";

interface Props {
  item: EducationItem;
  index: number;
  onUpdate: (id: string, field: keyof EducationItem, value: string) => void;
  onRemove: (id: string) => void;
}

export default function EducationCard({
  item,
  index,
  onUpdate,
  onRemove,
}: Props) {
  const isSchool = item.type === "school";
  const isCollege = item.type === "college";

  return (
    <div className="p-4 border border-neutral-200/90 bg-neutral-50/40 rounded-xs space-y-3">
      {/* কার্ড হেডার */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase font-bold text-neutral-700">
            #{index + 1}
          </span>
          <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-neutral-200/60 text-neutral-600 rounded-xs">
            {item.type}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
          title="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* টাইপ ও ডিগ্রি / ক্লাস */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10.5px] font-mono uppercase text-neutral-500 mb-1">
            Type
          </label>
          <select
            value={item.type}
            onChange={(e) =>
              onUpdate(item.id, "type", e.target.value as EducationType)
            }
            className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 cursor-pointer"
          >
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="institute">Institute</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[10.5px] font-mono uppercase text-neutral-500 mb-1">
            {isSchool
              ? "Class / Standard"
              : isCollege
                ? "Degree / Course Name"
                : "Course Name"}
          </label>
          {isSchool ? (
            <select
              value={item.degreeOrStandard}
              onChange={(e) =>
                onUpdate(item.id, "degreeOrStandard", e.target.value)
              }
              className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 cursor-pointer"
            >
              {SCHOOL_STANDARDS.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={item.degreeOrStandard}
              placeholder={
                isCollege
                  ? "e.g. B.Sc, B.Com, B.Tech"
                  : "e.g. Diploma in Hardware Repair"
              }
              onChange={(e) =>
                onUpdate(item.id, "degreeOrStandard", e.target.value)
              }
              className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
            />
          )}
        </div>
      </div>

      {/* প্রতিষ্ঠান ও ইউনিভার্সিটির নাম */}
      <div
        className={`grid grid-cols-1 ${isCollege ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-3`}
      >
        <div>
          <label className="block text-[10.5px] font-mono uppercase text-neutral-500 mb-1">
            {isSchool
              ? "School Name"
              : isCollege
                ? "College Name"
                : "Institute Name"}
          </label>
          <input
            type="text"
            value={item.institutionName}
            placeholder={
              isSchool
                ? "e.g. High School"
                : isCollege
                  ? "e.g. College Name"
                  : "e.g. Training Academy"
            }
            onChange={(e) =>
              onUpdate(item.id, "institutionName", e.target.value)
            }
            className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
          />
        </div>

        {isCollege && (
          <div>
            <label className="block text-[10.5px] font-mono uppercase text-neutral-500 mb-1">
              University Name
            </label>
            <input
              type="text"
              value={item.universityName || ""}
              placeholder="e.g. University Name"
              onChange={(e) =>
                onUpdate(item.id, "universityName", e.target.value)
              }
              className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
            />
          </div>
        )}
      </div>

      {/* স্ট্যাটাস, সেশন ও পার্সেন্টেজ */}
      <div
        className={`grid grid-cols-1 ${isCollege ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-3`}
      >
        {isCollege && (
          <div>
            <label className="block text-[10.5px] font-mono uppercase text-neutral-500 mb-1">
              Status
            </label>
            <select
              value={item.status || "pursuing"}
              onChange={(e) =>
                onUpdate(
                  item.id,
                  "status",
                  e.target.value as "pursuing" | "completed",
                )
              }
              className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 cursor-pointer"
            >
              <option value="pursuing">Currently Studying (Pursuing)</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-[10.5px] font-mono uppercase text-neutral-500 mb-1">
            {isCollege
              ? item.status === "completed"
                ? "Pass Year / Session"
                : "Session / End Year"
              : "Year / Session"}
          </label>
          <input
            type="text"
            value={item.session}
            placeholder={
              isCollege
                ? item.status === "completed"
                  ? "e.g. 2026"
                  : "e.g. 2023 - 2026"
                : "e.g. 2021 - 2023"
            }
            onChange={(e) => onUpdate(item.id, "session", e.target.value)}
            className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-mono uppercase text-neutral-500 mb-1">
            Score / Percentage (Optional)
          </label>
          <input
            type="text"
            value={item.gradeOrScore}
            placeholder="e.g. 80% or A+"
            onChange={(e) => onUpdate(item.id, "gradeOrScore", e.target.value)}
            className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
          />
        </div>
      </div>
    </div>
  );
}
