// app/dashboard/_components/IdentityBadge.tsx
"use client";

import { useSyncExternalStore, useState } from "react";
import { Copy, Check, ShieldCheck } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("kagaz_card_id") ||
    localStorage.getItem("kagaz_active_id") ||
    ""
  );
}

function getServerSnapshot() {
  return "";
}

export default function IdentityBadge() {
  const sutraId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (!sutraId) return;
    navigator.clipboard.writeText(sutraId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sutraId) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-4 bg-white border border-neutral-200/80 shadow-2xs rounded-xs my-4">
      <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-medium text-neutral-500">
          Official SutraNet Identifier
        </span>
      </div>

      <div
        onClick={handleCopy}
        title="Click to copy ID"
        className="group inline-flex items-center gap-2.5 cursor-pointer select-none transition-transform active:scale-[0.99] bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/60 px-4 py-1.5 rounded-xs"
      >
        {/* ফন্ট সাইজ 5xl থেকে কমিয়ে টেক্সট-lg / xl এবং ট্র্যাকিং স্বাভাবিক করা হয়েছে */}
        <span className="text-lg sm:text-xl font-mono font-bold tracking-widest text-neutral-900 group-hover:text-neutral-950 transition-colors">
          {sutraId}
        </span>

        <button
          type="button"
          aria-label="Copy ID"
          className="p-1 rounded bg-white group-hover:bg-neutral-950 group-hover:text-white text-neutral-500 border border-neutral-200 group-hover:border-neutral-950 transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 group-hover:text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <span className="text-[9px] font-mono uppercase text-neutral-400 mt-1">
        {copied ? "Copied to clipboard" : "Click to copy ID"}
      </span>
    </div>
  );
}
