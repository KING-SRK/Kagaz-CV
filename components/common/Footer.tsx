// components/Footer.tsx
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-800 print:hidden">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-10">
        {/* ওপরের মেইন গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-neutral-200/80">
          {/* ১. ব্র্যান্ড ও সংক্ষিপ্ত বিবরণ (৫ কলাম) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-xs transition-transform duration-300 group-hover:scale-95 shrink-0">
                <Image
                  src="/images/sutranet-logo.png"
                  alt="SutraNet Logo"
                  fill
                  priority
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-light tracking-tight text-neutral-950">
                Sutra<span className="font-serif italic font-normal">Net</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-600 font-light max-w-sm leading-relaxed">
              Create clean, job-ready resumes, verified personal profiles, and
              business hubs. Connect your paper CV with your live online profile
              using a unique SutraNet ID and QR code.
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-xs text-[10.5px] font-mono text-neutral-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Privacy-First Digital Identity Network</span>
            </div>
          </div>

          {/* ২. প্ল্যাটফর্ম লিংকস (৩ কলাম) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-950">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-neutral-950 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/create-cv"
                  className="hover:text-neutral-950 transition-colors inline-flex items-center gap-1"
                >
                  <span>Free CV Builder</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link
                  href="/find-talent"
                  className="hover:text-neutral-950 transition-colors"
                >
                  Find Talent Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/find-enterprise"
                  className="hover:text-neutral-950 transition-colors"
                >
                  Find Enterprise Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* ৩. অ্যাকাউন্ট ও কুইক অ্যাকশন (৪ কলাম) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-950">
              Get Started
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link
                  href="/auth"
                  className="hover:text-neutral-950 transition-colors"
                >
                  Sign In / Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-neutral-950 transition-colors"
                >
                  Manage Your Profile &amp; Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-neutral-950 transition-colors"
                >
                  How SutraNet Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* নিচের কপিরাইট, লিগ্যাল লিংকস ও ক্রেডিট বার */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-neutral-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <p>© 2026 SutraNet. All rights reserved.</p>
            <span className="text-neutral-300">•</span>
            <Link
              href="/privacy-policy"
              className="hover:text-neutral-950 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-neutral-300">•</span>
            <Link
              href="/terms"
              className="hover:text-neutral-950 transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          <p className="text-center sm:text-right">
            Built by{" "}
            <a
              href="https://grow-tech.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 font-semibold hover:underline transition-colors"
            >
              Grow Tech Digital Solutions
            </a>{" "}
            - ❤️ Kolkata, India
          </p>
        </div>
      </div>
    </footer>
  );
}
