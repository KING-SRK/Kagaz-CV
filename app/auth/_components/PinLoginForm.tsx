// app/auth/_components/PinLoginForm.tsx
"use client";

import { useState } from "react";
import PinInput from "./PinInput";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

interface PinLoginFormProps {
  onGoToRegister: () => void;
}

export default function PinLoginForm({ onGoToRegister }: PinLoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      const orFilter = `kagaz_id.eq.${query},email.eq.${query.toLowerCase()},phone.eq.${phoneQuery},phone.eq.${query}`;

      // ১. প্রথমে Individual (profiles টেবিল) খোঁজা
      const { data: indProfile } = await supabase
        .from("profiles")
        .select("id, kagaz_id, pin_hash")
        .or(orFilter)
        .maybeSingle();

      if (indProfile) {
        const isMatch = await bcrypt.compare(rawPin, indProfile.pin_hash);
        if (!isMatch) {
          setError("Incorrect PIN. Please try again.");
          setLoading(false);
          return;
        }

        localStorage.setItem("kagaz_active_id", indProfile.id);
        localStorage.setItem("kagaz_card_id", indProfile.kagaz_id);
        localStorage.setItem("kagaz_role", "individual");
        router.push("/dashboard/individual");
        return;
      }

      // ২. না পেলে Organization (company_profiles টেবিল) খোঁজা
      const { data: orgProfile } = await supabase
        .from("company_profiles")
        .select("id, kagaz_id, pin_hash")
        .or(orFilter)
        .maybeSingle();

      if (orgProfile) {
        const isMatch = await bcrypt.compare(rawPin, orgProfile.pin_hash);
        if (!isMatch) {
          setError("Incorrect PIN. Please try again.");
          setLoading(false);
          return;
        }

        localStorage.setItem("kagaz_active_id", orgProfile.id);
        localStorage.setItem("kagaz_card_id", orgProfile.kagaz_id);
        localStorage.setItem("kagaz_role", "organization");
        router.push("/dashboard/organization");
        return;
      }

      // ৩. কোনো টেবিলেই না পাওয়া গেলে
      setError("Account not found with this identifier.");
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

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          Quick Access
        </span>
        <h2 className="text-2xl font-serif text-neutral-950">
          Unlock Workspace.
        </h2>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
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
            className="w-full border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm font-mono outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2.5 text-center">
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
          className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying PIN...</span>
            </>
          ) : (
            <>
              <span>Unlock & Enter</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
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
