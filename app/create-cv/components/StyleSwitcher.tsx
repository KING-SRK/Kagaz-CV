// app/create-cv/components/StyleSwitcher.tsx
"use client";

import { CvTemplateType } from "../types";

interface Props {
  value: CvTemplateType;
  onChange: (template: CvTemplateType) => void;
}

const STYLE_OPTIONS: {
  id: CvTemplateType;
  label: string;
  hint: string;
}[] = [
  { id: "modern", label: "Modern", hint: "Clean sans" },
  { id: "classic", label: "Classic", hint: "Split layout" },
  { id: "mono", label: "Mono", hint: "Code style" },
  { id: "minimal", label: "Minimal", hint: "Airy layout" },
];

export default function StyleSwitcher({ value, onChange }: Props) {
  return (
    <div className="w-full max-w-198.5] bg-white border border-neutral-300 rounded-xs p-2 sm:p-3 shadow-2xs print:hidden">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 px-0.5">
        <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800">
          Style
        </span>
        <span className="text-[9.5px] sm:text-[10px] font-mono text-neutral-500 uppercase">
          {value}
        </span>
      </div>

      {/* মোবাইলে এক সারিতে পাশাপাশি ৪টা ছোট বাটন (grid-cols-4), বড় স্ক্রিনেও ৪টা */}
      <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
        {STYLE_OPTIONS.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-1.5 sm:px-2.5 py-1.5 sm:py-2 text-center sm:text-left rounded-xs border transition-all cursor-pointer ${
                isActive
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                  : "bg-neutral-50 text-neutral-800 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <div className="text-[10.5px] sm:text-xs font-semibold leading-tight truncate">
                {opt.label}
              </div>
              <div
                className={`hidden sm:block text-[10px] mt-0.5 ${
                  isActive ? "text-neutral-300" : "text-neutral-500"
                }`}
              >
                {opt.hint}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
