// app/dashboard/_components/CardDesignSwitcher.tsx
"use client";

import { CardDesignType } from "./SmartCard";

interface CardDesignSwitcherProps {
  currentDesign: CardDesignType;
  onDesignChange: (design: CardDesignType) => void;
}

export default function CardDesignSwitcher({
  currentDesign,
  onDesignChange,
}: CardDesignSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 border border-neutral-200 rounded-lg mt-4 shadow-2xs select-none">
      {/* ১. Duo Split */}
      <button
        type="button"
        onClick={() => onDesignChange("duo-split")}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none border ${
          currentDesign === "duo-split"
            ? "bg-white text-neutral-950 font-semibold shadow-xs border-neutral-200"
            : "bg-transparent text-neutral-500 border-transparent hover:text-neutral-900 hover:bg-neutral-200/50"
        }`}
      >
        <span className="flex h-3 w-3 rounded-full border border-neutral-400 overflow-hidden shrink-0">
          <span className="w-1/2 bg-white h-full" />
          <span className="w-1/2 bg-neutral-950 h-full" />
        </span>
        <span>Dual Split</span>
      </button>

      {/* ২. Obsidian Black */}
      <button
        type="button"
        onClick={() => onDesignChange("obsidian")}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none border ${
          currentDesign === "obsidian"
            ? "bg-neutral-950 text-white font-semibold shadow-xs border-neutral-950"
            : "bg-transparent text-neutral-500 border-transparent hover:text-neutral-900 hover:bg-neutral-200/50"
        }`}
      >
        <span className="h-3 w-3 rounded-full bg-neutral-900 border border-neutral-700 shrink-0" />
        <span>Obsidian</span>
      </button>

      {/* ৩. Titanium Silver Gradient */}
      <button
        type="button"
        onClick={() => onDesignChange("titanium")}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none border ${
          currentDesign === "titanium"
            ? "bg-neutral-800 text-white font-semibold shadow-xs border-neutral-600"
            : "bg-transparent text-neutral-500 border-transparent hover:text-neutral-900 hover:bg-neutral-200/50"
        }`}
      >
        <span className="h-3 w-3 rounded-full bg-linear-to-tr from-neutral-700 via-neutral-300 to-white border border-white/60 shrink-0 shadow-[0_0_5px_rgba(255,255,255,0.4)]" />
        <span>Titanium</span>
      </button>
    </div>
  );
}
