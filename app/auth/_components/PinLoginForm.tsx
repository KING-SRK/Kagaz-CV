// app/auth/_components/PinLoginForm.tsx
"use client";

import { useState } from "react";
import PinInput from "./PinInput";
import GoogleAuthButton from "./GoogleAuthButton";
import { ArrowRight, Loader2, User, Building2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

interface PinLoginFormProps {
  onGoToRegister: () => void;
}

interface MatchedWorkspace {
  id: string;
  kagaz_id: string;
  role: "individual" | "organization";
  displayName: string;
}

export default function PinLoginForm({ onGoToRegister }: PinLoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // একই ইমেইল/ফোনে দুটো অ্যাকাউন্ট থাকলে ওয়ার্কস্পেস বেছে নেওয়ার স্টেট
  const [matchedAccounts, setMatchedAccounts] = useState<MatchedWorkspace[]>(
    [],
  );

  const enterWorkspace = (acc: MatchedWorkspace) => {
    localStorage.setItem("kagaz_active_id", acc.id);
    localStorage.setItem("kagaz_card_id", acc.kagaz_id);
    localStorage.setItem("kagaz_role", acc.role);
    router.push(
      acc.role === "organization"
        ? "/dashboard/organization"
        : "/dashboard/individual",
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = identifier.trim();
    const rawPin = pin.join("");

    if (!query) {
      setError("Please provide SutraNet ID, email, or phone.");
      return;
    }
    if (pin.some((d) => d === "")) {
      setError("Please enter complete 4-digit PIN.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cleanDigits = query.replace(/\D/g, "");

      let phoneQuery = query;
      if (cleanDigits.length === 10) {
        phoneQuery = `+91${cleanDigits}`;
      } else if (cleanDigits.length === 12 && cleanDigits.startsWith("91")) {
        phoneQuery = `+${cleanDigits}`;
      }

      const orFilter = `kagaz_id.ilike.${query},email.ilike.${query},phone.eq.${phoneQuery},phone.eq.${query}`;

      // ১. দুটো টেবিলেই একসাথে খোঁজা হচ্ছে
      const [{ data: indProfile }, { data: orgProfile }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, kagaz_id, full_name, pin_hash")
          .or(orFilter)
          .maybeSingle(),
        supabase
          .from("company_profiles")
          .select("id, kagaz_id, company_name, pin_hash")
          .or(orFilter)
          .maybeSingle(),
      ]);

      if (!indProfile && !orgProfile) {
        setError("Account not found with this identifier.");
        setLoading(false);
        return;
      }

      const validMatches: MatchedWorkspace[] = [];
      let hasGoogleOnlyAccount = false;

      if (indProfile) {
        if (!indProfile.pin_hash) {
          hasGoogleOnlyAccount = true;
        } else if (await bcrypt.compare(rawPin, indProfile.pin_hash)) {
          validMatches.push({
            id: indProfile.id,
            kagaz_id: indProfile.kagaz_id,
            role: "individual",
            displayName: indProfile.full_name || "Individual Workspace",
          });
        }
      }

      if (orgProfile) {
        if (!orgProfile.pin_hash) {
          hasGoogleOnlyAccount = true;
        } else if (await bcrypt.compare(rawPin, orgProfile.pin_hash)) {
          validMatches.push({
            id: orgProfile.id,
            kagaz_id: orgProfile.kagaz_id,
            role: "organization",
            displayName: orgProfile.company_name || "Organization Workspace",
          });
        }
      }

      // ২. যদি দুটো ওয়ার্কস্পেসেই PIN মিলে যায়, বেছে নেওয়ার অপশন দেখাবে
      if (validMatches.length > 1) {
        setMatchedAccounts(validMatches);
        setLoading(false);
        return;
      }

      // ৩. যদি ১টি ওয়ার্কস্পেসে মিলে যায়, সরাসরি ঢুকিয়ে দেবে
      if (validMatches.length === 1) {
        enterWorkspace(validMatches[0]);
        return;
      }

      // ৪. কোনোটাতেই PIN না মিললে
      if (hasGoogleOnlyAccount) {
        setError(
          "This account uses Google Sign-In. Please continue with Google.",
        );
      } else {
        setError("Incorrect PIN. Please try again.");
      }
    } catch (err) {
      console.error("DEBUG ERROR DETAILS:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to verify credentials. Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  // একই ইমেইলে Individual ও Organization দুটোই থাকলে সুইচার UI
  if (matchedAccounts.length > 1) {
    return (
      <div className="w-full space-y-5">
        <button
          type="button"
          onClick={() => setMatchedAccounts([])}
          className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">
            Multiple Workspaces Found
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
            Select Workspace.
          </h2>
          <p className="text-xs text-neutral-500">
            Choose which workspace you want to unlock right now.
          </p>
        </div>

        <div className="space-y-3">
          {matchedAccounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => enterWorkspace(acc)}
              className="w-full border border-neutral-200 hover:border-neutral-950 p-4 flex items-center justify-between text-left transition-colors cursor-pointer rounded-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center shrink-0">
                  {acc.role === "organization" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-950 truncate">
                    {acc.displayName}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500 uppercase">
                    {acc.role} • {acc.kagaz_id}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          Quick Access
        </span>
        <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
          Unlock Workspace.
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
            SutraNet ID / Email / Phone
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g. JT-2610-8942 or 9876543210"
            className="w-full border border-neutral-200 bg-neutral-50/50 px-3.5 sm:px-4 py-2.5 text-sm font-mono outline-none focus:border-neutral-950 focus:bg-white rounded-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2 text-center">
            Security PIN
          </label>
          <PinInput pin={pin} setPin={setPin} />
        </div>

        {error && (
          <p className="text-center text-xs text-red-600 font-mono">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors disabled:opacity-60 cursor-pointer rounded-xs"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying PIN...</span>
            </>
          ) : (
            <>
              <span>Unlock &amp; Enter</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* ডিভাইডার এবং Google Sign-In বাটন */}
      <div className="relative flex items-center py-0.5">
        <div className="grow border-t border-neutral-200" />
        <span className="shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          Or
        </span>
        <div className="grow border-t border-neutral-200" />
      </div>

      <GoogleAuthButton label="Sign in with Google" />

      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onGoToRegister}
          className="text-xs text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          New user?{" "}
          <span className="underline font-medium">Create SutraNet ID</span>
        </button>
      </div>
    </div>
  );
}
