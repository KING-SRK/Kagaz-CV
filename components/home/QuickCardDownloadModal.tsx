// components/home/QuickCardDownloadModal.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { X, IdCard, Mail, Download, Loader2, CheckCircle2 } from "lucide-react";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabaseClient";
import SmartCard from "@/app/dashboard/individual/SmartCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface VerifiedProfileData {
  kagazId: string;
  role: string;
  name: string;
  phone: string;
  avatarUrl: string;
  title: string;
  dob: string;
  gender: string;
  tagline: string;
  address: string;
  email: string;
}

export default function QuickCardDownloadModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<"lookup" | "downloading">("lookup");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardProfile, setCardProfile] = useState<VerifiedProfileData | null>(
    null,
  );
  const [downloadDone, setDownloadDone] = useState(false);

  // মোডাল বন্ধ হলে স্টেট রিসেট
  const handleClose = () => {
    setStep("lookup");
    setIdentifier("");
    setError("");
    setCardProfile(null);
    setDownloadDone(false);
    onClose();
  };

  // কার্ড ডেটা পাওয়ার পর অটোমেটিক Front & Back PNG ডাউনলোড করা
  useEffect(() => {
    if (!isOpen || step !== "downloading" || !cardProfile || downloadDone) {
      return;
    }

    const timer = setTimeout(async () => {
      const frontEl = document.getElementById("quick-dl-front");
      const backEl = document.getElementById("quick-dl-back");

      const innerFront =
        frontEl?.querySelector<HTMLElement>("#card-front-side") || frontEl;
      const innerBack =
        backEl?.querySelector<HTMLElement>("#card-back-side") || backEl;

      if (!innerFront || !innerBack) return;

      try {
        const frontUrl = await toPng(innerFront, {
          cacheBust: true,
          pixelRatio: 3,
          width: 440,
          height: 265,
          style: { transform: "none", width: "440px", height: "265px" },
        });

        const a1 = document.createElement("a");
        a1.download = `${cardProfile.kagazId}-Front.png`;
        a1.href = frontUrl;
        a1.click();

        await new Promise((r) => setTimeout(r, 450));

        const backUrl = await toPng(innerBack, {
          cacheBust: true,
          pixelRatio: 3,
          width: 440,
          height: 265,
          style: { transform: "none", width: "440px", height: "265px" },
        });

        const a2 = document.createElement("a");
        a2.download = `${cardProfile.kagazId}-Back.png`;
        a2.href = backUrl;
        a2.click();

        setDownloadDone(true);
      } catch (err) {
        console.error("Card export failed:", err);
        setError("Failed to generate card image. Please try again.");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isOpen, step, cardProfile, downloadDone]);

  if (!isOpen) return null;

  // Email বা SutraNet ID দিয়ে প্রোফাইল খুঁজে সরাসরি ডাউনলোড শুরু করা
  const handleLookupAndDownload = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const query = identifier.trim();
    if (!query) {
      setError("Please enter your Email or SutraNet ID.");
      return;
    }

    setLoading(true);
    try {
      const isEmail = query.includes("@");
      const { data: profile, error: fetchErr } = await supabase
        .from("profiles")
        .select(
          "kagaz_id, role, full_name, phone, avatar_url, title, dob, gender, email, address_line, city, state",
        )
        .or(isEmail ? `email.ilike.${query}` : `kagaz_id.ilike.${query}`)
        .maybeSingle();

      if (fetchErr || !profile) {
        setError("No SutraNet profile found with this ID or Email.");
        setLoading(false);
        return;
      }

      const formattedAddress =
        profile.city && profile.state
          ? `${profile.city}, ${profile.state}`
          : profile.address_line || "Kolkata, India";

      setCardProfile({
        kagazId: profile.kagaz_id || "SN-ID",
        role: profile.role || "individual",
        name: profile.full_name || "Official Member",
        phone: profile.phone || "Not Set",
        avatarUrl: profile.avatar_url || "",
        title: profile.title || "Certified Member",
        dob: profile.dob || "DD/MM/YYYY",
        gender: profile.gender ? profile.gender.toUpperCase() : "GENDER",
        tagline: profile.role === "organization" ? "Commercial Hub" : "",
        address: formattedAddress,
        email: profile.email || "",
      });

      setStep("downloading");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-neutral-300 rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <IdCard className="h-4 w-4 text-neutral-900 shrink-0" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-950">
              Download Smart Card
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-neutral-500 hover:text-neutral-950 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {step === "lookup" && (
            <form onSubmit={handleLookupAndDownload} className="space-y-4">
              <div>
                <h4 className="text-base font-serif font-bold text-neutral-950">
                  Instant ID Card Download
                </h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Enter your registered <strong>Email</strong> or{" "}
                  <strong>SutraNet ID</strong> (e.g. JT-2611-8405) to instantly
                  download your digital smart card.
                </p>
              </div>

              <div>
                <label className="block text-[10.5px] font-mono uppercase text-neutral-600 mb-1.5">
                  Email or SutraNet ID
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com or JT-2611-8405"
                    className="w-full border border-neutral-300 pl-9 pr-3 py-2.5 text-xs font-mono rounded-xs focus:outline-none focus:border-neutral-950 text-black"
                  />
                </div>
              </div>

              {error && (
                <p className="text-[11px] font-mono text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xs">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-500 text-white py-2.5 px-4 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Fetching Card...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Smart Card</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === "downloading" && cardProfile && (
            <div className="text-center py-4 space-y-3">
              {downloadDone ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-serif font-bold text-neutral-950">
                    Smart Card Downloaded!
                  </h4>
                  <p className="text-xs text-neutral-600">
                    Both <strong>{cardProfile.kagazId}-Front.png</strong> and{" "}
                    <strong>{cardProfile.kagazId}-Back.png</strong> have been
                    saved to your device.
                  </p>
                </>
              ) : (
                <>
                  <Loader2 className="h-8 w-8 text-neutral-900 animate-spin mx-auto" />
                  <h4 className="text-base font-serif font-bold text-neutral-950">
                    Generating HD Card...
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Your Front &amp; Back smart card images will download
                    automatically in a moment.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* অফ-স্ক্রিন রেন্ডার এরিয়া (HD PNG ক্যাপচারের জন্য) */}
      {step === "downloading" && cardProfile && (
        <div
          aria-hidden="true"
          className="fixed left-[-9999px] top-0 pointer-events-none opacity-100"
        >
          <div id="quick-dl-front" style={{ width: 440, height: 265 }}>
            <SmartCard
              role={cardProfile.role}
              kagazId={cardProfile.kagazId}
              design="duo-split"
              data={cardProfile}
            />
          </div>
          <div id="quick-dl-back" style={{ width: 440, height: 265 }}>
            <SmartCard
              role={cardProfile.role}
              kagazId={cardProfile.kagazId}
              design="duo-split"
              data={cardProfile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
