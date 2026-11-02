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
      setError("Please provide Kagaz ID, email, or phone.");
      return;
    }
    if (pin.some((d) => d === "")) {
      setError("Please enter complete 4-digit PIN.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ফোন নম্বরের স্পেস বা হাইফেন পরিষ্কার করা
      const cleanDigits = query.replace(/\D/g, "");

      // ইউজার ১০ ডিজিটের সাধারণ ভারতীয় নম্বর দিলে '+91' যুক্ত করা
      let phoneQuery = query;
      if (cleanDigits.length === 10) {
        phoneQuery = `+91${cleanDigits}`;
      } else if (cleanDigits.length === 12 && cleanDigits.startsWith("91")) {
        phoneQuery = `+${cleanDigits}`;
      }

      // Kagaz ID, Email অথবা Phone (+91 সহ বা ছাড়া) দিয়ে প্রোফাইল খোঁজা
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("id, kagaz_id, role, pin_hash")
        .or(
          `kagaz_id.eq.${query},email.eq.${query.toLowerCase()},phone.eq.${phoneQuery},phone.eq.${query}`,
        )
        .maybeSingle();

      if (fetchError || !profile) {
        setError("Account not found with this identifier.");
        setLoading(false);
        return;
      }

      // পিন হ্যাশ মিলানো
      const isMatch = await bcrypt.compare(rawPin, profile.pin_hash);

      if (!isMatch) {
        setError("Incorrect PIN. Please try again.");
        setLoading(false);
        return;
      }

      // সেশনে আইডি ও রোল সেভ রাখা
      localStorage.setItem("kagaz_active_id", profile.kagaz_id);
      localStorage.setItem("kagaz_role", profile.role);

      // বিল্ডারে রিডাইরেক্ট
      router.push("/dashboard");
    } catch (err) {
      console.error("DEBUG ERROR DETAILS:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to verify credentials. Check console for details.");
      }
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
            Kagaz ID / Email / Phone
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
          className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
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
          className="text-xs text-neutral-500 hover:text-neutral-950 transition-colors"
        >
          New user?{" "}
          <span className="underline font-medium">Create Kagaz ID</span>
        </button>
      </div>
    </div>
  );
}
