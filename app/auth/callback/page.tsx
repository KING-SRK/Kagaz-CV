// app/auth/callback/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { generateKagazId } from "../_utils/generateKagazId";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [googleUser, setGoogleUser] = useState<{
    email: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [creating, setCreating] = useState(false);

  // ১. ফাংশনটিকে useEffect-এর আগেই useCallback দিয়ে ডিক্লেয়ার করা হলো
  const createProfileWithRole = useCallback(
    async (
      selectedRole: "individual" | "organization",
      email: string,
      name: string,
      avatar: string,
    ) => {
      setCreating(true);
      const newId = generateKagazId(name);

      if (selectedRole === "organization") {
        const { data, error } = await supabase
          .from("company_profiles")
          .insert([
            {
              kagaz_id: newId,
              company_name: name,
              email,
              logo_url: avatar,
              role: "organization",
            },
          ])
          .select("id")
          .single();

        if (!error && data) {
          localStorage.setItem("kagaz_active_id", data.id);
          localStorage.setItem("kagaz_card_id", newId);
          localStorage.setItem("kagaz_role", "organization");
          router.replace("/dashboard/organization");
          return;
        }
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .insert([
            {
              kagaz_id: newId,
              full_name: name,
              email,
              avatar_url: avatar,
              role: "individual",
            },
          ])
          .select("id")
          .single();

        if (!error && data) {
          localStorage.setItem("kagaz_active_id", data.id);
          localStorage.setItem("kagaz_card_id", newId);
          localStorage.setItem("kagaz_role", "individual");
          router.replace("/dashboard/individual");
          return;
        }
      }

      setCreating(false);
    },
    [router],
  );

  // ২. এবার useEffect-এর ভেতর নিরাপদে কল করা হচ্ছে
  useEffect(() => {
    async function handleCallback() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        router.replace("/auth");
        return;
      }

      const email = user.email.toLowerCase();
      const fullName =
        user.user_metadata?.full_name || email.split("@")[0] || "Member";
      const avatar = user.user_metadata?.avatar_url || "";

      // Individual টেবিলে আছে কি না চেক করো
      const { data: indProfile } = await supabase
        .from("profiles")
        .select("id, kagaz_id")
        .eq("email", email)
        .maybeSingle();

      if (indProfile) {
        localStorage.setItem("kagaz_active_id", indProfile.id);
        localStorage.setItem("kagaz_card_id", indProfile.kagaz_id);
        localStorage.setItem("kagaz_role", "individual");
        router.replace("/dashboard/individual");
        return;
      }

      // Organization টেবিলে আছে কি না চেক করো
      const { data: orgProfile } = await supabase
        .from("company_profiles")
        .select("id, kagaz_id")
        .eq("email", email)
        .maybeSingle();

      if (orgProfile) {
        localStorage.setItem("kagaz_active_id", orgProfile.id);
        localStorage.setItem("kagaz_card_id", orgProfile.kagaz_id);
        localStorage.setItem("kagaz_role", "organization");
        router.replace("/dashboard/organization");
        return;
      }

      // নতুন ইউজার হলে রোল চেক বা সিলেক্ট করাবে
      const pendingRole = localStorage.getItem("pending_google_role") as
        | "individual"
        | "organization"
        | null;

      setGoogleUser({ email, name: fullName, avatar });

      if (pendingRole) {
        localStorage.removeItem("pending_google_role");
        await createProfileWithRole(pendingRole, email, fullName, avatar);
      } else {
        setNeedsRoleSelection(true);
      }
    }

    handleCallback();
  }, [router, createProfileWithRole]);

  if (needsRoleSelection && googleUser) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 rounded-xs shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">
              Google Verified • {googleUser.email}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
              Choose Account Type
            </h2>
            <p className="text-xs text-neutral-500">
              Select how you want to use SutraNet.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              disabled={creating}
              onClick={() =>
                createProfileWithRole(
                  "individual",
                  googleUser.email,
                  googleUser.name,
                  googleUser.avatar,
                )
              }
              className="w-full border border-neutral-200 hover:border-neutral-950 p-4 flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-950">
                  Individual
                </p>
                <p className="text-[11px] text-neutral-500">
                  Personal digital ID, CV & QR card
                </p>
              </div>
            </button>

            <button
              type="button"
              disabled={creating}
              onClick={() =>
                createProfileWithRole(
                  "organization",
                  googleUser.email,
                  googleUser.name,
                  googleUser.avatar,
                )
              }
              className="w-full border border-neutral-200 hover:border-neutral-950 p-4 flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-950">
                  Organization
                </p>
                <p className="text-[11px] text-neutral-500">
                  Company profile, branches & team hub
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-2 text-xs font-mono text-neutral-600">
      <Loader2 className="h-5 w-5 animate-spin text-neutral-950" />
      <span>Signing you in with Google...</span>
    </div>
  );
}
