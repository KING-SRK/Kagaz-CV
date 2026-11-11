// app/dashboard/builder/_components/BuilderNavbar.tsx
"use client";

import Link from "next/link";
import { Printer, ArrowLeft, Check } from "lucide-react";

interface BuilderNavbarProps {
  kagazId: string;
  role: string;
  onPrint: () => void;
}

export default function BuilderNavbar({
  kagazId,
  role,
  onPrint,
}: BuilderNavbarProps) {
  return (
    <header className="print:hidden h-14 border-b border-neutral-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex h-7 w-7 items-center justify-center bg-neutral-950 text-xs font-mono font-medium text-white"
        >
          K
        </Link>
        <div className="h-4 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-neutral-400">
            ID:
          </span>
          <span className="text-xs font-mono font-medium text-neutral-900 bg-neutral-100 border border-neutral-200 px-2 py-0.5">
            {kagazId || "DEMO-ID"}
          </span>
          <span className="text-[10px] font-mono uppercase bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 text-neutral-500">
            {role}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Save PDF</span>
        </button>
      </div>
    </header>
  );
}
