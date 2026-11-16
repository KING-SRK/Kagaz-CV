// app/dashboard/individual/PrimaryIdentity.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  Cake,
  User,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getIndividualProfile } from "@/lib/individualService";

interface ProfileState {
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  avatar_url?: string;
  kagaz_id?: string;
  title?: string;
}

export default function PrimaryIdentity() {
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const activeId = localStorage.getItem("kagaz_active_id");
      if (!activeId) {
        if (isMounted) setLoading(false);
        return;
      }

      // ১. সার্ভিস থেকে প্রোফাইল খোঁজা
      const { data } = await getIndividualProfile(activeId);

      if (data && isMounted) {
        setProfile({
          full_name: data.full_name || "Name Not Set",
          email: data.email || "Not linked",
          phone: data.phone || "Not linked",
          dob: data.dob || "DD/MM/YYYY",
          avatar_url: data.avatar_url || "",
          kagaz_id: data.kagaz_id || "N/A",
          title: data.title || "Identity Holder",
        });
      } else {
        // ২. ফলব্যাক ডিরেক্ট কুয়েরি
        const { data: directData } = await supabase
          .from("profiles")
          .select("full_name, email, phone, dob, avatar_url, kagaz_id, title")
          .or(`id.eq.${activeId},kagaz_id.eq.${activeId}`)
          .maybeSingle();

        if (directData && isMounted) {
          setProfile({
            full_name: directData.full_name || "Name Not Set",
            email: directData.email || "Not linked",
            phone: directData.phone || "Not linked",
            dob: directData.dob || "DD/MM/YYYY",
            avatar_url: directData.avatar_url || "",
            kagaz_id: directData.kagaz_id || "N/A",
            title: directData.title || "Identity Holder",
          });
        }
      }

      if (isMounted) setLoading(false);
    }

    loadData();

    // ⚡ রিয়েলটাইম আপডেট লিসেনার
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const updated = customEvent.detail;
        setProfile((prev) => ({
          ...prev!,
          full_name: updated.full_name || prev?.full_name || "Name Not Set",
          title: updated.title || prev?.title || "Identity Holder",
          dob: updated.dob || prev?.dob || "DD/MM/YYYY",
          avatar_url: updated.avatar_url ?? prev?.avatar_url,
        }));
      }
    };

    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, []);

  const handleCopyEmail = () => {
    if (profile?.email && profile.email !== "Not linked") {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200/80 p-5 sm:p-7 min-h-80 sm:min-h-95 animate-pulse rounded-xs flex flex-col justify-between" />
    );
  }

  return (
    <div className="bg-white border border-neutral-200/80 p-4 sm:p-6 md:p-7 shadow-xs rounded-xs flex flex-col justify-between sm:min-h-95 relative overflow-hidden">
      {/* টপ প্রোফাইল প্রিভিউ ও স্ট্যাটাস */}
      <div className="flex items-center gap-3.5 sm:gap-5 border-b border-neutral-100 pb-4 sm:pb-6">
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full overflow-hidden border-2 border-neutral-200 bg-neutral-100 shadow-2xs">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-400 bg-neutral-100">
              <User className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
              Primary Profile
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
              Verified
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-serif font-bold text-neutral-950 truncate tracking-tight">
            {profile?.full_name}
          </h2>

          <p className="text-[11px] sm:text-xs font-mono text-neutral-500 truncate">
            {profile?.title}
          </p>
        </div>
      </div>

      {/* মেম্বারশিপ ফিল্ড ডিটেইলস */}
      <div className="py-3.5 sm:py-4 space-y-2 sm:space-y-2.5">
        {/* Email */}
        <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-neutral-50/50 border border-neutral-200/70 rounded-xs text-[11px] sm:text-xs">
          <span className="font-mono text-neutral-500 flex items-center gap-2 shrink-0">
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 shrink-0" />
            <span>Email</span>
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-neutral-900 font-medium truncate max-w-35 sm:max-w-55">
              {profile?.email}
            </span>
            {profile?.email && profile.email !== "Not linked" && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-neutral-400 hover:text-neutral-700 p-0.5 transition-colors cursor-pointer shrink-0"
                title="Copy email"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-neutral-50/50 border border-neutral-200/70 rounded-xs text-[11px] sm:text-xs">
          <span className="font-mono text-neutral-500 flex items-center gap-2 shrink-0">
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 shrink-0" />
            <span>Mobile</span>
          </span>
          <span className="font-mono text-neutral-900 font-medium truncate">
            {profile?.phone}
          </span>
        </div>

        {/* Date of Birth */}
        <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-neutral-50/50 border border-neutral-200/70 rounded-xs text-[11px] sm:text-xs">
          <span className="font-mono text-neutral-500 flex items-center gap-2 shrink-0">
            <Cake className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 shrink-0" />
            <span>Date of Birth</span>
          </span>
          <span className="font-mono text-neutral-900 font-medium truncate">
            {profile?.dob}
          </span>
        </div>
      </div>

      {/* ফুটার নোট */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 text-[10.5px] sm:text-[11px] font-mono text-neutral-400">
        <span className="shrink-0">SutraNet Node ID</span>
        <span className="text-neutral-700 font-medium truncate">
          {profile?.kagaz_id}
        </span>
      </div>
    </div>
  );
}
