// app/dashboard/_components/PrimaryIdentity.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Cake } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface ProfileState {
  full_name: string;
  email: string;
  phone: string;
  dob: string;
}

export default function PrimaryIdentity() {
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = localStorage.getItem("kagaz_active_id");
    if (!activeId) return;

    async function loadData() {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, qr_data")
        .eq("kagaz_id", activeId)
        .maybeSingle();

      if (data) {
        setProfile({
          full_name: data.full_name || "N/A",
          email: data.email || "N/A",
          phone: data.phone || "Not linked",
          dob: data.qr_data?.dob || "DD/MM/YYYY",
        });
      }
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200/80 p-6 h-48 animate-pulse rounded" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-neutral-200/80 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs">
        {/* প্রোফাইল ইমেজ */}
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-full overflow-hidden border-2 border-neutral-100 bg-neutral-100 shadow-xs">
          <Image
            src="/hero-portrait.jpg"
            alt="Profile"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ফিল্ড লিস্ট */}
        <div className="flex-1 w-full space-y-1">
          {/* Email */}
          <div className="flex items-center justify-between py-2 border-b border-neutral-100 text-xs">
            <span className="font-mono text-neutral-500 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-neutral-400" />
              Account Email
            </span>
            <span className="font-mono text-neutral-900 truncate max-w-50">
              {profile?.email}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-2 border-b border-neutral-100 text-xs">
            <span className="font-mono text-neutral-500 flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-neutral-400" />
              Registered Mobile
            </span>
            <span className="font-mono text-neutral-900">{profile?.phone}</span>
          </div>

          {/* Date of Birth */}
          <div className="flex items-center justify-between py-2 text-xs">
            <span className="font-mono text-neutral-500 flex items-center gap-2">
              <Cake className="h-3.5 w-3.5 text-neutral-400" />
              Date of Birth
            </span>
            <span className="font-mono text-neutral-900">{profile?.dob}</span>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/profile"
        className="w-full flex items-center justify-center gap-2 border border-neutral-300 bg-white py-2.5 text-xs font-mono uppercase text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs"
      >
        Edit Profile
      </Link>
    </div>
  );
}
