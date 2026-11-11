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
      <div className="bg-white border border-neutral-200/80 p-7 min-h-[380px] animate-pulse rounded-xs flex flex-col justify-between" />
    );
  }

  return (
    <div className="bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-xs rounded-xs flex flex-col justify-between min-h-[380px] relative overflow-hidden">
      {/* টপ প্রোফাইল প্রিভিউ ও স্ট্যাটাস */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-neutral-100 pb-6">
        <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 rounded-full overflow-hidden border-2 border-neutral-200 bg-neutral-100 shadow-2xs">
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
              <User className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
              Primary Profile
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </span>
          </div>

          <h2 className="text-xl font-serif font-bold text-neutral-950 truncate tracking-tight">
            {profile?.full_name}
          </h2>

          <p className="text-xs font-mono text-neutral-500 truncate">
            {profile?.title}
          </p>
        </div>
      </div>

      {/* মেম্বারশিপ ফিল্ড ডিটেইলস */}
      <div className="py-4 space-y-2.5">
        {/* Email */}
        <div className="flex items-center justify-between p-3 bg-neutral-50/50 border border-neutral-200/70 rounded-xs text-xs">
          <span className="font-mono text-neutral-500 flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-neutral-400" />
            Account Email
          </span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-neutral-900 font-medium truncate max-w-[190px] sm:max-w-[220px]">
              {profile?.email}
            </span>
            {profile?.email && profile.email !== "Not linked" && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-neutral-400 hover:text-neutral-700 p-0.5 transition-colors cursor-pointer"
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
        <div className="flex items-center justify-between p-3 bg-neutral-50/50 border border-neutral-200/70 rounded-xs text-xs">
          <span className="font-mono text-neutral-500 flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-neutral-400" />
            Registered Mobile
          </span>
          <span className="font-mono text-neutral-900 font-medium">
            {profile?.phone}
          </span>
        </div>

        {/* Date of Birth */}
        <div className="flex items-center justify-between p-3 bg-neutral-50/50 border border-neutral-200/70 rounded-xs text-xs">
          <span className="font-mono text-neutral-500 flex items-center gap-2.5">
            <Cake className="h-4 w-4 text-neutral-400" />
            Date of Birth
          </span>
          <span className="font-mono text-neutral-900 font-medium">
            {profile?.dob}
          </span>
        </div>
      </div>

      {/* ফুটার নোট */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span>SutraNet Node ID</span>
        <span className="text-neutral-700 font-medium">
          {profile?.kagaz_id}
        </span>
      </div>
    </div>
  );
}
