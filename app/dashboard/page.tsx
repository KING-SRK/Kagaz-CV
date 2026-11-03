// app/dashboard/page.tsx
import { Fingerprint } from "lucide-react";
import PrimaryIdentity from "./_components/PrimaryIdentity";
import CardSection from "./_components/CardSection";
import ProfileDetailsSection from "./_components/ProfileDetailsSection";
import IdentityBadge from "./_components/IdentityBadge"; // নতুন কম্পোনেন্ট

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-900">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* ব্যানার হেডার */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <div>
            <span className="text-sm font-mono uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-slate-500" />
              Verified Primary Identity
            </span>
            <h1 className="text-3xl font-serif font-normal text-neutral-950 mt-1">
              Welcome
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-neutral-500 uppercase">
              Active Network
            </span>
          </div>
        </div>

        {/* মাঝখানে বড় করে শুধু SutraNet ID */}
        <IdentityBadge />

        {/* ওপরের গ্রিড: বাঁদিকের আইডেন্টিটি + ডানদিকের কার্ড */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <PrimaryIdentity />
          </div>

          <div className="lg:col-span-6">
            <CardSection />
          </div>
        </div>

        {/* নিচের পরপর সেকশন: About -> Location -> Education -> Skills -> Secure Govt ID */}
        <div className="pt-2">
          <ProfileDetailsSection />
        </div>
      </main>
    </div>
  );
}
