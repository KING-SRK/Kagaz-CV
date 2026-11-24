// app/terms/page.tsx
import Link from "next/link";
import { FileCheck2, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <FileCheck2 className="h-3.5 w-3.5 text-neutral-900" />
            <span>Effective: November 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-neutral-950">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            Rules and guidelines for using SutraNet IDs, CV Builder, ID Cards,
            and Talent/Enterprise Directories.
          </p>
        </header>

        <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using SutraNet, you agree to follow these Terms
              &amp; Conditions. You are responsible for keeping your SutraNet ID
              and account PIN confidential.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              2. Authentic Information &amp; Verification
            </h2>
            <p>
              All personal profiles, enterprise listings, and vault documents
              must represent real, accurate information. Impersonation, fake
              credentials, or misleading company profiles may result in
              suspension or removal without notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              3. Public QR Cards &amp; Shared Links
            </h2>
            <p>
              When you share your printed ID card, PDF resume, or public{" "}
              <code>/p/[id]</code> link, anyone scanning the QR code will see
              the fields you have marked as public in your settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              4. Jobs &amp; Directory Conduct
            </h2>
            <p>
              Enterprises may only post genuine openings and must use applicant
              snapshots solely for recruitment. Misuse of directory contacts for
              spam or unauthorized data scraping is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-950">
              5. Limitation of Liability
            </h2>
            <p>
              SutraNet provides digital identity and discovery tools.{" "}
              <a
                href="https://grow-tech.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-950 font-medium underline"
              >
                Grow Tech Digital Solutions
              </a>{" "}
              is not a party to employment contracts, freelance agreements, or
              offline transactions between users and enterprises.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
