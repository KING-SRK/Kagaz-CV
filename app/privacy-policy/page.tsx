// app/privacy-policy/page.tsx
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] text-neutral-900 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <header className="border-b border-neutral-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-xs text-[10.5px] font-mono text-neutral-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Last Updated: November 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-neutral-950">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            How SutraNet (built by Grow Tech Digital Solutions) collects,
            protects, and lets you control your personal and enterprise identity
            data.
          </p>
        </header>

        <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Personal Identity Profiles:</strong> Name, title, email,
                phone number, profile photo, city/address, education, work
                experience, skills, projects, and optional personal fields.
              </li>
              <li>
                <strong>Private Document Vault:</strong> Document types and
                numbers submitted for identity verification are stored strictly
                for verification purposes and are never shown publicly.
              </li>
              <li>
                <strong>Enterprise Profiles:</strong> Company name, logo,
                industry, branches, offerings, team details, and optional
                business registration details.
              </li>
              <li>
                <strong>Job Applications:</strong> When you apply to a job on
                SutraNet, your permitted profile snapshot and cover note are
                shared with that hiring enterprise.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              2. Granular Visibility &amp; User Control
            </h2>
            <p>
              You stay in full control of what appears on your public SutraNet
              record (<code>/p/[id]</code>) and directory listings. Through your
              dashboard visibility switches, you can hide or show specific
              sections such as phone number, email, address, date of birth,
              family details, or company legal information at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              3. Free CV Builder Usage
            </h2>
            <p>
              You can create and download PDF resumes without signing in. Full
              guest resumes are never published publicly. When you download a
              PDF in guest mode, basic non-sensitive details (such as name,
              title, city, and selected layout) may be logged privately for
              internal usage statistics and platform improvement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              4. Data Security &amp; Retention
            </h2>
            <p>
              Security PINs are stored in hashed form, and platform data is
              hosted on secured cloud infrastructure (Supabase). We do not sell
              your personal or business data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              5. Contact &amp; Data Removal
            </h2>
            <p>
              You can update your details anytime from your dashboard. For
              account deletion or privacy support, contact{" "}
              <a
                href="https://grow-tech.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-950 font-medium underline"
              >
                Grow Tech Digital Solutions
              </a>{" "}
              (Kolkata, India).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
