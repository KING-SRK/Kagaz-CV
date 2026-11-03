// app/dashboard/_components/IdentityBadge.tsx
"use client";

import { useSyncExternalStore, useState } from "react";
import { Copy, Check, ShieldCheck } from "lucide-react";

// localStorage থেকে রিড করার জন্য সাবস্ক্রিপশন ও স্ন্যাপশট ফাংশন
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("kagaz_active_id") || "";
}

function getServerSnapshot() {
  return "";
}

export default function IdentityBadge() {
  // useSyncExternalStore ব্যবহারের ফলে কোনো useEffect বা cascading render এরর আসবে না
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
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 bg-white border border-neutral-200/80 shadow-xs">
      <div className="flex items-center gap-1.5 text-neutral-400 mb-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
          OFFICIAL SUTRANET IDENTIFIER
        </span>
      </div>

      <div
        onClick={handleCopy}
        title="Click to copy ID"
        className="group inline-flex items-center gap-3 cursor-pointer select-none transition-transform active:scale-[0.98]"
      >
        <span className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold tracking-[0.2em] text-neutral-950 group-hover:text-neutral-700 transition-colors">
          {sutraId}
        </span>

        <button
          type="button"
          aria-label="Copy ID"
          className="p-1.5 rounded bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white text-neutral-600 transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <span className="text-[9px] font-mono uppercase text-neutral-400 mt-1">
        {copied ? "Copied to clipboard" : "Click anywhere on ID to copy"}
      </span>
    </div>
  );
}
