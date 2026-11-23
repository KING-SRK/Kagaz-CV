// app/auth/_components/PinSetup.tsx
"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Copy, Check, Loader2 } from "lucide-react";
import PinInput from "./PinInput";
import { generateUniqueSutraNetId } from "../_utils/generateKagazId";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

interface PinSetupProps {
  fullName: string;
  email: string;
  phone: string;
  role: "individual" | "organization";
}

export default function PinSetup({
  fullName,
  email,
  phone,
  role,
}: PinSetupProps) {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);
  const [step, setStep] = useState<"set" | "confirm" | "success">("set");
  const [error, setError] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetPin = () => {
    if (pin.some((d) => d === "")) {
      setError("Please input complete 4-digit PIN.");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleConfirmPin = async () => {
    const rawPin = pin.join("");
    const confirmRawPin = confirmPin.join("");

    if (rawPin !== confirmRawPin) {
      setError("PIN did not match. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(rawPin, salt);
      const newId = await generateUniqueSutraNetId(role);
      const cleanEmail = (email || "").trim().toLowerCase();

      let createdUuid = "";

      if (role === "organization") {
        const { data: orgData, error: orgError } = await supabase
          .from("company_profiles")
          .insert([
            {
              kagaz_id: newId,
              company_name: fullName,
              email: cleanEmail,
              phone: phone || "",
              role: "organization",
              pin_hash: pinHash,
            },
          ])
          .select("id")
          .single();

        if (orgError || !orgData) {
          setError(
            orgError?.message.includes("unique")
              ? "This Email or Phone is already registered."
              : orgError?.message || "Failed to create company profile.",
          );
          setLoading(false);
          return;
        }
        createdUuid = orgData.id;
      } else {
        const { data: indData, error: indError } = await supabase
          .from("profiles")
          .insert([
            {
              kagaz_id: newId,
              full_name: fullName,
              email: cleanEmail,
              phone: phone || "",
              role: "individual",
              pin_hash: pinHash,
            },
          ])
          .select("id")
          .single();

        if (indError || !indData) {
          setError(
            indError?.message.includes("unique")
              ? "This Email or Phone is already registered."
              : indError?.message || "Failed to create individual profile.",
          );
          setLoading(false);
          return;
        }
        createdUuid = indData.id;
      }

      localStorage.setItem("kagaz_active_id", createdUuid);
      localStorage.setItem("kagaz_card_id", newId);
      localStorage.setItem("kagaz_role", role);

      setGeneratedId(newId);
      setStep("success");
    } catch (err) {
      console.error("DEBUG ERROR DETAILS:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create profile. Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToDashboard = () => {
    if (role === "organization") {
      router.push("/dashboard/organization");
    } else {
      router.push("/dashboard/individual");
    }
  };

  return (
    <div className="w-full space-y-6">
      {step === "set" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Step 02 // Security
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
              Set a 4-Digit PIN.
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Use this PIN for fast sign-in instead of a password.
            </p>
          </div>

          <PinInput pin={pin} setPin={setPin} />
          {error && (
            <p className="text-center text-xs text-red-600 font-mono">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSetPin}
            className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
          >
            <span>Next Step</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Step 02 // Verification
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
              Repeat your PIN.
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Type your 4 digits one more time.
            </p>
          </div>

          <PinInput pin={confirmPin} setPin={setConfirmPin} />
          {error && (
            <p className="text-center text-xs text-red-600 font-mono">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleConfirmPin}
            className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors disabled:opacity-60 cursor-pointer rounded-xs"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <>
                <span>Generate SutraNet ID</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">
              Account Activated
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
              Your Official SutraNet ID
            </h2>
          </div>

          <div className="border border-neutral-950 bg-neutral-950 p-4 sm:p-6 text-white space-y-4 rounded-xs">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-neutral-400 border-b border-neutral-800 pb-2 gap-2">
              <span className="truncate">OFFICIAL IDENTITY</span>
              <span className="shrink-0">{role}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-400 font-light truncate">
                {fullName}
              </p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="font-mono text-lg sm:text-2xl font-light tracking-wider sm:tracking-widest text-white truncate">
                  {generatedId}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  title="Copy SutraNet ID"
                  className="border border-neutral-800 p-2 hover:bg-neutral-800 transition-colors cursor-pointer shrink-0 rounded-xs"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-neutral-300" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 font-light leading-relaxed">
              This unique code identifies your {role} profile across SutraNet.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoToDashboard}
            className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
          >
            <span>Go to Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
