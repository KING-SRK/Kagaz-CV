// components/Navbar.tsx
"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");

  // একটিভ পাথ ও প্যারামিটার ম্যাচিং লজিক
  const isActive = (path: string, queryType?: string) => {
    if (queryType) {
      return pathname === path && currentType === queryType;
    }
    if (path === "/") {
      return pathname === "/" && !currentType;
    }
    return pathname.startsWith(path) && !currentType;
  };

  const navLinks = [
    { name: "Home", href: "/", active: isActive("/") },
    {
      name: "Create CV",
      href: "/dashboard/builder",
      active: isActive("/dashboard/builder"),
    },
    {
      name: "Find Talent",
      href: "/explore?type=individual",
      active: isActive("/explore", "individual"),
    },
    {
      name: "Find Enterprise",
      href: "/explore?type=organization",
      active: isActive("/explore", "organization"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-[#FDFCFB]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* SutraNet Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center bg-neutral-950 text-xs font-mono font-medium text-white transition-transform duration-300 group-hover:scale-95">
            S
          </span>
          <span className="text-lg font-light tracking-tight text-neutral-950">
            Sutra<span className="font-serif italic font-normal">Net</span>
          </span>
        </Link>

        {/* নেভিগেশন লিংকস সাথে একটিভ ইন্ডিকেটর */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.2em]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-1 transition-colors duration-200 ${
                link.active
                  ? "text-neutral-950 font-semibold"
                  : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <span>{link.name}</span>
              {/* একটিভ থাকলে নিচে মিনিমাল কালো আন্ডারলাইন দাগ */}
              {link.active && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neutral-950" />
              )}
            </Link>
          ))}
        </nav>

        {/* অ্যাকশন বাটনস */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 bg-neutral-950 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white shadow-sm transition-all duration-300 hover:bg-neutral-800"
          >
            <span>Account</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
