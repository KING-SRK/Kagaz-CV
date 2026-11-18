// app/dashboard/organization/CompanySmartCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export interface CompanyCardData {
  name: string;
  logoUrl: string;
  category: string;
  tagline: string;
  description?: string;
  phone: string;
  website: string;
  address: string;
  estYear: string;
  workingHours?: string;
  isVerified?: boolean;
}

interface CompanySmartCardProps {
  kagazId: string;
  data: CompanyCardData;
}

export default function CompanySmartCard({
  kagazId,
  data,
}: CompanySmartCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 440;
  const CARD_HEIGHT = 265;

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const availableWidth = wrapperRef.current.offsetWidth;
        if (availableWidth > 0 && availableWidth < CARD_WIDTH) {
          setScale(availableWidth / CARD_WIDTH);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const publicUrl =
    typeof window !== "undefined" && kagazId
      ? `${window.location.origin}/p/${kagazId}`
      : `https://sutranet.in/p/${kagazId || "ORG"}`;

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${CARD_HEIGHT * scale}px` }}
      className="w-full max-w-[440px] flex items-center justify-center mx-auto relative"
    >
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        title="Click card to flip"
        style={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          perspective: "1000px",
        }}
        className="shrink-0 cursor-pointer select-none"
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ================= FRONT SIDE (সামনের দিক) ================= */}
          <div
            id="org-card-front"
            className="absolute inset-0 w-full h-full rounded-2xl shadow-xl border border-neutral-800 flex overflow-hidden text-white"
            style={{
              backgroundImage: "url('/cards/org-front-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* বাঁদিকের অংশ (৬৮%): কোম্পানির নাম, লোগো, আইডি ও যোগাযোগ */}
            <div className="w-[68%] h-full p-5 flex flex-col justify-between relative z-10">
              {/* ওপরের অংশ: SutraNet লোগো ও ভেরিফাইড ব্যাজ */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center bg-white text-neutral-950 font-mono font-bold text-[11px] rounded-xs shrink-0 shadow-sm">
                    S
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-white font-mono">
                    Sutra
                    <span className="font-serif italic font-light text-neutral-300">
                      Net
                    </span>
                  </span>
                </div>

                {data.isVerified && (
                  <div className="flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider text-emerald-300 shadow-xs shrink-0">
                    <ShieldCheck className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                    <span>VERIFIED</span>
                  </div>
                )}
              </div>

              {/* কোম্পানির লোগো, নাম ও ক্যাটাগরি */}
              <div className="flex items-center gap-3 my-1">
                <div className="h-12 w-12 rounded-lg border border-neutral-600 bg-neutral-900 shadow-md overflow-hidden flex items-center justify-center shrink-0">
                  {data.logoUrl ? (
                    <img
                      src={data.logoUrl}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-neutral-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate tracking-wide leading-tight">
                    {data.name || "ORGANIZATION NAME"}
                  </h2>
                  <p className="text-[9.5px] font-mono font-semibold tracking-wider uppercase text-emerald-400 truncate">
                    {data.category || "COMMERCIAL ENTERPRISE"}
                  </p>
                  {data.tagline && (
                    <p className="text-[9px] font-sans text-neutral-300 truncate">
                      {data.tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* মাঝখানের অংশ: কোম্পানির অফিশিয়াল আইডি */}
              <div className="my-auto flex items-center gap-2 bg-white/10 backdrop-blur-xs py-1 px-2.5 rounded-md border border-white/15 w-fit">
                <span className="text-[9.5px] font-mono font-bold uppercase text-neutral-300 tracking-wider">
                  ORG ID:
                </span>
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  {kagazId || "ORG-2611-0000"}
                </span>
              </div>

              {/* নিচের অংশ: ফোন, প্রতিষ্ঠার সাল ও ঠিকানা */}
              <div className="space-y-1.5 text-[10px] font-mono text-neutral-200 border-t border-white/15 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="h-3 w-3 text-neutral-400 shrink-0" />
                    <span className="truncate font-medium">
                      {data.phone || "Contact Not Set"}
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-400 shrink-0">
                    EST. {data.estYear || "2025"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                  <span className="truncate font-medium">
                    {data.address || "Kolkata, India"}
                  </span>
                </div>
              </div>
            </div>

            {/* ডানদিকের অংশ (৩২%): ওপরে ফাঁকা জায়গায় QR কোড */}
            <div className="w-[32%] h-full relative z-10 flex flex-col justify-start items-end p-4 pr-30">
              <div className="p-1.5 bg-white rounded-lg shadow-lg border border-neutral-600">
                <QRCodeSVG value={publicUrl} size={56} level="M" />
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE (পেছনের দিক) ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl shadow-xl border border-neutral-800"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div
              id="org-card-back"
              className="absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between text-white"
              style={{
                backgroundImage: "url('/cards/org-back-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                // এখান থেকে transform: "rotateY(180deg)" সরিয়ে দেওয়া হয়েছে!
              }}
            >
              {/* ওপরের অংশ: SutraNet লোগো ও নাম (বাঁ পাশে) */}
              <div className="flex items-center justify-end gap-2.5 z-10">
                <span className="flex h-6 w-6 items-center justify-center bg-white text-neutral-950 font-mono font-bold text-xs rounded-xs shrink-0 shadow-sm">
                  S
                </span>
                <span className="text-base font-semibold tracking-wide text-white font-mono">
                  Sutra
                  <span className="font-serif italic font-light text-neutral-300">
                    Net
                  </span>
                </span>
              </div>

              {/* মাঝখানের অংশ: QR কোড (বাঁ পাশে) */}
              <div className="flex items-center justify-end my-auto relative z-10">
                <div className="p-2 bg-white rounded-xl shadow-lg border border-neutral-600 shrink-0">
                  <QRCodeSVG value={publicUrl} size={72} level="M" />
                </div>
              </div>

              {/* নিচের ফুটার: এক লাইনের কর্পোরেট বিবরণ (বাঁ পাশে) */}
              <div className="flex justify-end items-center text-[9px] sm:text-[9.5px] font-mono text-neutral-300 z-10 font-medium text-right">
                <p>
                  Official enterprise identity &amp; digital <br /> registry
                  network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
