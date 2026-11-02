// app/auth/_components/PinSetup.tsx
"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Copy, Check, Loader2 } from "lucide-react";
import PinInput from "./PinInput";
import { generateKagazId } from "../generateKagazId";
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
      // ১. পিন হ্যাশ তৈরি
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(rawPin, salt);

      // ২. ইউনিক Kagaz ID তৈরি
      const newId = generateKagazId(fullName);

      // ৩. Supabase-এ প্রোফাইল ইনসার্ট
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            kagaz_id: newId,
            full_name: fullName,
            email: (email || "").trim().toLowerCase(),
            phone: phone || "",
            role: role,
            pin_hash: pinHash,
          },
        ])
        .select()
        .single();

      if (insertError) {
        if (insertError.message.includes("unique")) {
          setError("This Email or Phone is already registered.");
        } else {
          setError(insertError.message);
        }
        setLoading(false);
        return;
      }

      // ৪. লোকাল স্টোরেজে সেশন টোকেন হিসেবে Kagaz ID সেভ রাখা
      localStorage.setItem("kagaz_active_id", newId);
      localStorage.setItem("kagaz_role", role);

      setGeneratedId(newId);
      setStep("success");
    } catch (err) {
      console.error("DEBUG ERROR DETAILS:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create profile. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {step === "set" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Step 02 // Security
            </span>
            <h2 className="text-2xl font-serif text-neutral-950">
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
            className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
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
            <h2 className="text-2xl font-serif text-neutral-950">
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
            className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <>
                <span>Generate Kagaz ID</span>
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
            <h2 className="text-2xl font-serif text-neutral-950">
              Your Official Kagaz ID
            </h2>
          </div>

          <div className="border border-neutral-950 bg-neutral-950 p-6 text-white space-y-4">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-neutral-400 border-b border-neutral-800 pb-2">
              <span>OFFICIAL IDENTITY</span>
              <span>{role}</span>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-light">{fullName}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-2xl font-light tracking-widest text-white">
                  {generatedId}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="border border-neutral-800 p-2 hover:bg-neutral-800 transition-colors"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-neutral-300" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 font-light">
              This unique code will appear on your printed resumes & biodatas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
          >
            <span>Go to Builder</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
