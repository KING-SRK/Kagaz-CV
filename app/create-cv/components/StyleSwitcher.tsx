// app/create-cv/components/StyleSwitcher.tsx
"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { CvTemplateType } from "../types";

interface Props {
  value: CvTemplateType;
  onChange: (template: CvTemplateType) => void;
  refreshKey?: number;
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

type TemplateCounts = Record<CvTemplateType, number>;

export default function StyleSwitcher({
  value,
  onChange,
  refreshKey = 0,
}: Props) {
  const [counts, setCounts] = useState<TemplateCounts>({
    modern: 0,
    classic: 0,
    mono: 0,
    minimal: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      const { data, error } = await supabase.rpc("get_cv_download_stats");
      if (!isMounted || error || !Array.isArray(data)) return;

      const updated: TemplateCounts = {
        modern: 0,
        classic: 0,
        mono: 0,
        minimal: 0,
      };

      for (const row of data) {
        const key = row.template as CvTemplateType;
        if (key in updated) {
          updated[key] = Number(row.download_count) || 0;
        }
      }

      setCounts(updated);
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const totalDownloads =
    counts.modern + counts.classic + counts.mono + counts.minimal;

  return (
    <div className="w-full max-w-198.5 bg-white border border-neutral-300 rounded-xs p-2 sm:p-3 shadow-2xs print:hidden">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 px-0.5 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800">
            Style
          </span>
          {totalDownloads > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded-xs text-[9.5px] font-mono text-neutral-700">
              <Download className="h-2.5 w-2.5 text-emerald-600" />
              <span>Total: {totalDownloads}</span>
            </span>
          )}
        </div>

        <span className="text-[9.5px] sm:text-[10px] font-mono text-neutral-500 uppercase">
          {value}
        </span>
      </div>

      {/* মোবাইলে এক সারিতে পাশাপাশি ৪টা ছোট বাটন (grid-cols-4), বড় স্ক্রিনেও ৪টা */}
      <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
        {STYLE_OPTIONS.map((opt) => {
          const isActive = value === opt.id;
          const count = counts[opt.id] ?? 0;

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
              <div className="flex items-center justify-center sm:justify-between gap-1">
                <span className="text-[10.5px] sm:text-xs font-semibold leading-tight truncate">
                  {opt.label}
                </span>
                {count > 0 && (
                  <span
                    className={`text-[9px] font-mono px-1 rounded-xs shrink-0 ${
                      isActive
                        ? "bg-white/15 text-emerald-300"
                        : "bg-neutral-200/80 text-neutral-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
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
