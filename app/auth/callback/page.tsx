// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  User,
  Building2,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { generateUniqueSutraNetId } from "../_utils/generateKagazId";
import PinInput from "../_components/PinInput";

interface ExistingAccount {
  id: string;
  kagaz_id: string;
  pin_hash?: string | null;
}

// 🍪 কুকি থেকে রোল পড়ার হেল্পার ফাংশন
function getPendingRoleFromCookie(): "individual" | "organization" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)sutranet_pending_role=(individual|organization)/,
  );
  return match ? (match[1] as "individual" | "organization") : null;
}

function clearPendingRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie =
    "sutranet_pending_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export default function AuthCallbackPage() {
  const router = useRouter();

  const [step, setStep] = useState<
    | "loading"
    | "switch-account"
    | "select-role"
    | "set-pin"
    | "confirm-pin"
    | "success"
  >("loading");

  const [googleUser, setGoogleUser] = useState<{
    email: string;
    name: string;
    avatar: string;
  } | null>(null);

  const [foundInd, setFoundInd] = useState<ExistingAccount | null>(null);
  const [foundOrg, setFoundOrg] = useState<ExistingAccount | null>(null);

  const [selectedRole, setSelectedRole] = useState<
    "individual" | "organization"
  >("individual");

  const [existingRecordId, setExistingRecordId] = useState<string | null>(null);
  const [existingKagazId, setExistingKagazId] = useState<string | null>(null);

  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [generatedId, setGeneratedId] = useState("");
  const [copied, setCopied] = useState(false);

  const proceedToAccount = (
    account: ExistingAccount,
    role: "individual" | "organization",
  ) => {
    clearPendingRoleCookie();
    if (account.pin_hash) {
      localStorage.setItem("kagaz_active_id", account.id);
      localStorage.setItem("kagaz_card_id", account.kagaz_id);
      localStorage.setItem("kagaz_role", role);
      router.replace(
        role === "organization"
          ? "/dashboard/organization"
          : "/dashboard/individual",
      );
      return;
    }

    setSelectedRole(role);
    setExistingRecordId(account.id);
    setExistingKagazId(account.kagaz_id);
    setStep("set-pin");
  };

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

      setGoogleUser({ email, name: fullName, avatar });

      const [{ data: indProfile }, { data: orgProfile }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, kagaz_id, pin_hash")
          .eq("email", email)
          .maybeSingle(),
        supabase
          .from("company_profiles")
          .select("id, kagaz_id, pin_hash")
          .eq("email", email)
          .maybeSingle(),
      ]);

      setFoundInd(indProfile);
      setFoundOrg(orgProfile);

      // 🍪 কুকি থেকে পেন্ডিং রোল চেক করা হচ্ছে
      const targetRole = getPendingRoleFromCookie();

      if (targetRole === "organization") {
        if (orgProfile) {
          proceedToAccount(orgProfile, "organization");
        } else {
          setSelectedRole("organization");
          setStep("set-pin");
        }
        return;
      }

      if (targetRole === "individual") {
        if (indProfile) {
          proceedToAccount(indProfile, "individual");
        } else {
          setSelectedRole("individual");
          setStep("set-pin");
        }
        return;
      }

      // সরাসরি Log In থেকে এলে:
      if (indProfile && orgProfile) {
        setStep("switch-account");
      } else if (indProfile) {
        proceedToAccount(indProfile, "individual");
      } else if (orgProfile) {
        proceedToAccount(orgProfile, "organization");
      } else {
        setStep("select-role");
      }
    }

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextToConfirm = () => {
    if (pin.some((d) => d === "")) {
      setError("Please input complete 4-digit PIN.");
      return;
    }
    setError("");
    setStep("confirm-pin");
  };

  const handleFinalizeAccount = async () => {
    if (!googleUser) return;

    const rawPin = pin.join("");
    const confirmRawPin = confirmPin.join("");

    if (rawPin !== confirmRawPin) {
      setError("PIN did not match. Please try again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(rawPin, salt);

      if (existingRecordId && existingKagazId) {
        const tableName =
          selectedRole === "organization" ? "company_profiles" : "profiles";

        const { error: updateError } = await supabase
          .from(tableName)
          .update({ pin_hash: pinHash })
          .eq("id", existingRecordId);

        if (updateError) {
          setError(updateError.message);
          setSaving(false);
          return;
        }

        clearPendingRoleCookie();
        localStorage.setItem("kagaz_active_id", existingRecordId);
        localStorage.setItem("kagaz_card_id", existingKagazId);
        localStorage.setItem("kagaz_role", selectedRole);

        router.replace(
          selectedRole === "organization"
            ? "/dashboard/organization"
            : "/dashboard/individual",
        );
        return;
      }

      const newId = await generateUniqueSutraNetId(selectedRole);

      if (selectedRole === "organization") {
        const { data, error: orgError } = await supabase
          .from("company_profiles")
          .insert([
            {
              kagaz_id: newId,
              company_name: googleUser.name,
              email: googleUser.email,
              logo_url: googleUser.avatar,
              role: "organization",
              pin_hash: pinHash,
            },
          ])
          .select("id")
          .single();

        if (orgError || !data) {
          setError(orgError?.message || "Failed to create company profile.");
          setSaving(false);
          return;
        }

        clearPendingRoleCookie();
        localStorage.setItem("kagaz_active_id", data.id);
        localStorage.setItem("kagaz_card_id", newId);
        localStorage.setItem("kagaz_role", "organization");
      } else {
        const { data, error: indError } = await supabase
          .from("profiles")
          .insert([
            {
              kagaz_id: newId,
              full_name: googleUser.name,
              email: googleUser.email,
              avatar_url: googleUser.avatar,
              role: "individual",
              pin_hash: pinHash,
            },
          ])
          .select("id")
          .single();

        if (indError || !data) {
          setError(indError?.message || "Failed to create individual profile.");
          setSaving(false);
          return;
        }

        clearPendingRoleCookie();
        localStorage.setItem("kagaz_active_id", data.id);
        localStorage.setItem("kagaz_card_id", newId);
        localStorage.setItem("kagaz_role", "individual");
      }

      setGeneratedId(newId);
      setStep("success");
    } catch (err) {
      console.error("Google PIN setup failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center gap-2 text-xs font-mono text-neutral-600">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-950" />
        <span>Verifying Google account...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 rounded-xs shadow-xs">
        {step === "switch-account" && googleUser && foundInd && foundOrg && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">
                Multiple Workspaces Found
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
                Select Workspace
              </h2>
              <p className="text-xs text-neutral-500">
                Both an Individual and Organization profile are linked to{" "}
                <span className="font-mono text-neutral-800">
                  {googleUser.email}
                </span>
                .
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => proceedToAccount(foundInd, "individual")}
                className="w-full border border-neutral-200 hover:border-neutral-950 p-4 flex items-center justify-between text-left transition-colors cursor-pointer rounded-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-950">
                      Individual Workspace
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500">
                      ID: {foundInd.kagaz_id}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>

              <button
                type="button"
                onClick={() => proceedToAccount(foundOrg, "organization")}
                className="w-full border border-neutral-200 hover:border-neutral-950 p-4 flex items-center justify-between text-left transition-colors cursor-pointer rounded-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-950">
                      Organization Workspace
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500">
                      ID: {foundOrg.kagaz_id}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </div>
        )}

        {step === "select-role" && googleUser && (
          <div className="space-y-5">
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
                onClick={() => {
                  setSelectedRole("individual");
                  setStep("set-pin");
                }}
                className="w-full border border-neutral-200 hover:border-neutral-950 p-4 flex items-center gap-3 text-left transition-colors cursor-pointer rounded-xs"
              >
                <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center shrink-0">
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
                onClick={() => {
                  setSelectedRole("organization");
                  setStep("set-pin");
                }}
                className="w-full border border-neutral-200 hover:border-neutral-950 p-4 flex items-center gap-3 text-left transition-colors cursor-pointer rounded-xs"
              >
                <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center shrink-0">
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
        )}

        {step === "set-pin" && googleUser && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Security Setup •{" "}
                {selectedRole}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
                Set a 4-Digit PIN.
              </h2>
              <p className="text-xs text-neutral-500 font-light">
                Required for quick PIN sign-in with your SutraNet ID or phone.
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
              onClick={handleNextToConfirm}
              className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {step === "confirm-pin" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-neutral-950">
                Repeat your PIN.
              </h2>
              <p className="text-xs text-neutral-500 font-light">
                Type your 4 digits one more time to confirm.
              </p>
            </div>

            <PinInput pin={confirmPin} setPin={setConfirmPin} />

            {error && (
              <p className="text-center text-xs text-red-600 font-mono">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setConfirmPin(["", "", "", ""]);
                  setError("");
                  setStep("set-pin");
                }}
                className="border border-neutral-300 px-4 py-3 text-xs font-mono uppercase text-neutral-700 hover:bg-neutral-50 cursor-pointer rounded-xs"
              >
                Back
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleFinalizeAccount}
                className="flex-1 flex items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors disabled:opacity-60 cursor-pointer rounded-xs"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Activating...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "success" && googleUser && (
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
                <span className="shrink-0">{selectedRole}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-400 font-light truncate">
                  {googleUser.name}
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
                You can now log in using either Google or your SutraNet ID with
                your 4-digit PIN.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.replace(
                  selectedRole === "organization"
                    ? "/dashboard/organization"
                    : "/dashboard/individual",
                )
              }
              className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
