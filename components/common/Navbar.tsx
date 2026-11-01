// components/Navbar.tsx
"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // ইউজার যদি dashboard বা builder-এ থাকে, তবে এই ন্যাভবার লুকিয়ে যাবে
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-[#FDFCFB]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* লোগো ও ব্র্যান্ড নাম (Editorial Minimal) */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center bg-neutral-950 text-xs font-mono font-medium text-white transition-transform duration-300 group-hover:scale-95">
            K
          </span>
          <span className="text-lg font-light tracking-tight text-neutral-950">
            Kagaz<span className="font-serif italic font-normal">CV</span>
          </span>
        </Link>

        {/* নেভিগেশন লিংকস */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          <Link
            href="/explore"
            className="transition-colors hover:text-neutral-950"
          >
            Explore Profiles
          </Link>
          <Link
            href="/templates"
            className="transition-colors hover:text-neutral-950"
          >
            Templates
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-neutral-950"
          >
            How it Works
          </Link>
        </nav>

        {/* অ্যাকশন বাটন: সোয়াইপ Auth পেজের সাথে লিঙ্ক করা */}
        <div className="flex items-center gap-6">
          <Link
            href="/auth?mode=login"
            className="hidden text-xs font-medium uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:text-neutral-950 sm:inline-block"
          >
            Log In
          </Link>

          <Link
            href="/auth?mode=register"
            className="group inline-flex items-center gap-2 bg-neutral-950 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white shadow-sm transition-all duration-300 hover:bg-neutral-800"
          >
            <span>Register</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
