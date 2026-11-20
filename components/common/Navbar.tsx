// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  User,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentType = searchParams.get("type");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // লগআউট কনফার্মেশন পপআপ স্টেট
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const currentRoute = `${pathname}?${currentType || ""}`;
  const [prevRoute, setPrevRoute] = useState<string>(currentRoute);

  if (currentRoute !== prevRoute) {
    setPrevRoute(currentRoute);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  // ১. ইউজার অথেন্টিকেশন চেক
  useEffect(() => {
    async function checkUserAuth() {
      const activeId = localStorage.getItem("kagaz_active_id");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (activeId || user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoadingAuth(false);
    }

    checkUserAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeId = localStorage.getItem("kagaz_active_id");
      setIsLoggedIn(Boolean(session?.user || activeId));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  // ২. লগআউট পপআপ ওপেন করা
  const triggerLogoutPopup = () => {
    setMobileMenuOpen(false);
    setLogoutModalOpen(true);
  };

  // ৩. কনফার্ম করলে আসল লগআউট হ্যান্ডলার
  const confirmLogout = async () => {
    setLoggingOut(true);
    localStorage.removeItem("kagaz_active_id");
    localStorage.removeItem("kagaz_card_id");
    localStorage.removeItem("kagaz_role");
    localStorage.removeItem("pending_google_role");
    await supabase.auth.signOut();
    setLoggingOut(false);
    setLogoutModalOpen(false);
    setIsLoggedIn(false);
    router.replace("/auth");
  };

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

  const isDashboardActive = pathname.startsWith("/dashboard");

  const navLinks = [
    { name: "Home", href: "/", active: isActive("/") },
    {
      name: "Create CV",
      href: "/create-cv",
      active: isActive("/create-cv"),
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
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-[#FDFCFB]/90 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* SutraNet Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-2.5 shrink-0"
          >
            <span className="flex h-7 w-7 items-center justify-center bg-neutral-950 text-xs font-mono font-medium text-white transition-transform duration-300 group-hover:scale-95">
              S
            </span>
            <span className="text-base sm:text-lg font-light tracking-tight text-neutral-950">
              Sutra<span className="font-serif italic font-normal">Net</span>
            </span>
          </Link>

          {/* 💻 ডেস্কটপ নেভিগেশন লিংকস */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 whitespace-nowrap ${
                  link.active
                    ? "text-neutral-950 font-semibold"
                    : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                <span>{link.name}</span>
                {link.active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neutral-950" />
                )}
              </Link>
            ))}
          </nav>

          {/* ডানদিকের অ্যাকশন বাটনস + মোবাইল হ্যামবার্গার মেনু বাটন */}
          <div className="flex items-center gap-2 sm:gap-3">
            {loadingAuth ? (
              <div className="h-8 sm:h-9 w-20 sm:w-24 bg-neutral-100 animate-pulse rounded-xs" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <Link
                  href="/dashboard"
                  className={`group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium uppercase tracking-[0.12em] sm:tracking-[0.15em] transition-all duration-300 rounded-xs ${
                    isDashboardActive
                      ? "bg-white text-neutral-950 border-2 border-neutral-950 font-bold shadow-xs"
                      : "bg-neutral-950 text-white shadow-sm hover:bg-neutral-800 border border-transparent"
                  }`}
                >
                  {isDashboardActive ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
                  )}
                  <span>Account</span>
                  <ArrowUpRight className="hidden sm:block h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {/* ডেস্কটপে Logout বাটন */}
                <button
                  type="button"
                  onClick={triggerLogoutPopup}
                  title="Logout"
                  className="hidden sm:inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer rounded-xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="group inline-flex items-center gap-1.5 sm:gap-2 bg-neutral-950 px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium uppercase tracking-[0.12em] sm:tracking-[0.15em] text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 rounded-xs whitespace-nowrap"
              >
                <span>Sign In</span>
                <span className="hidden sm:inline">/ Join</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}

            {/* 📱 মোবাইল মেনু টগল বাটন (< md) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden inline-flex items-center justify-center p-2 border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 rounded-xs cursor-pointer transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* 📱 মোবাইল ড্রপডাউন মেনু ড্রয়ার */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/80 bg-[#FDFCFB] px-4 pt-3 pb-5 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs font-mono uppercase tracking-[0.18em] transition-colors ${
                  link.active
                    ? "bg-neutral-950 text-white font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                <span>{link.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </Link>
            ))}

            {isLoggedIn && (
              <div className="pt-2 mt-2 border-t border-neutral-200/70">
                <button
                  type="button"
                  onClick={triggerLogoutPopup}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 bg-red-50/70 text-red-600 px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout from Account</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* 🔐 LOGOUT CONFIRMATION POPUP MODAL */}
      {logoutModalOpen && (
        <div
          onClick={() => !loggingOut && setLogoutModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-neutral-300 w-full max-w-sm rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-950">
                  Confirm Sign Out
                </h3>
              </div>
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setLogoutModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900 rounded-xs cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-2">
              <p className="text-sm font-serif font-bold text-neutral-950">
                Are you sure you want to log out?
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                You will be signed out of your current SutraNet session on this
                device. You can sign back in anytime using your credentials.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center gap-2.5">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 px-4 py-2 text-xs font-mono uppercase border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loggingOut}
                onClick={confirmLogout}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono uppercase bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 rounded-xs transition-colors cursor-pointer"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Exiting...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Yes, Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
