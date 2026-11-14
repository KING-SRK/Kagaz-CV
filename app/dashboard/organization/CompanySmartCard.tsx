// app/dashboard/organization/CompanySmartCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Clock,
  Globe,
  MapPin,
  Phone,
  RotateCw,
  ShieldCheck,
} from "lucide-react";
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

  // কার্ডের আসল ডেস্কটপ সাইজ (একদম ফিক্সড, কখনো ভাঙবে না)
  const CARD_WIDTH = 440;
  const CARD_HEIGHT = 255;

  // 📱 স্ক্রিন ছোট হলে অটোমেটিক স্কেল হিসাব করবে যাতে একবিন্দুও না কাটে
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
        }}
        className="shrink-0 cursor-pointer select-none perspective-distant group"
      >
        {/* ৩ডি ফ্লিপ কন্টেইনার */}
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-3d ${
            isFlipped ? "transform-[rotateY(180deg)]" : ""
          }`}
        >
          {/* ================= FRONT SIDE (সামনের দিক) ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-sm overflow-hidden border border-neutral-300 shadow-md bg-white flex">
            {/* বাম দিকের অংশ */}
            <div className="flex-1 p-6 flex flex-col justify-between bg-[#FDFCFB] text-neutral-950 relative">
              {/* ওপরের ব্র্যান্ডিং হেডার */}
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-4 w-4 bg-neutral-950 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                    S
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 font-semibold">
                    SutraNet Enterprise
                  </span>
                </div>
                {data.isVerified && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-xs">
                    <ShieldCheck className="h-2.5 w-2.5" /> Verified
                  </span>
                )}
              </div>

              {/* মাঝখানের লোগো ও কোম্পানির নাম */}
              <div className="flex items-center gap-3.5 my-auto py-1">
                <div className="h-14 w-14 rounded-xs border border-neutral-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {data.logoUrl ? (
                    <img
                      src={data.logoUrl}
                      alt={data.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-neutral-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-serif font-bold text-neutral-950 truncate leading-tight">
                    {data.name || "Organization Name"}
                  </h3>
                  <p className="text-[10.5px] font-mono uppercase tracking-wider text-emerald-700 font-semibold truncate mt-0.5">
                    {data.category || "Commercial Enterprise"}
                  </p>
                  {data.tagline && (
                    <p className="text-[10px] font-sans text-neutral-500 truncate mt-0.5">
                      {data.tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* নিচের যোগাযোগ ও ঠিকানা */}
              <div className="space-y-1 border-t border-neutral-200/80 pt-2.5 text-[10px] font-mono text-neutral-600">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 truncate">
                    <Phone className="h-2.5 w-2.5 text-neutral-400 shrink-0" />
                    {data.phone || "Contact Not Set"}
                  </span>
                  <span className="text-neutral-400 shrink-0">
                    EST. {data.estYear || "2025"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="h-2.5 w-2.5 text-neutral-400 shrink-0" />
                    {data.address || "India"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0">
                    <RotateCw className="h-2.5 w-2.5" /> Flip
                  </span>
                </div>
              </div>
            </div>

            {/* ডান দিকের ডার্ক অংশ (QR কোড ও ID) */}
            <div className="w-[130px] bg-neutral-950 text-white p-3.5 flex flex-col items-center justify-between border-l border-neutral-800 shrink-0">
              <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-neutral-400 text-center">
                OFFICIAL ID
              </span>

              <div className="bg-white p-2 rounded-xs shadow-xs">
                <QRCodeSVG value={publicUrl} size={74} level="M" />
              </div>

              <div className="text-center w-full">
                <p className="text-[9.5px] font-mono font-semibold tracking-wider text-white truncate">
                  {kagazId || "ORG-ID"}
                </p>
                <p className="text-[8px] font-mono uppercase text-neutral-500 mt-0.5">
                  Scan to Verify
                </p>
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE (পেছনের দিক) ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] rounded-sm overflow-hidden border border-neutral-800 shadow-md bg-neutral-950 text-white p-6 flex flex-col justify-between">
            {/* ওপরের ম্যাগনেটিক স্ট্রিপ স্টাইল ও হেডার */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                CORPORATE CREDENTIALS
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {kagazId || "ORG-ID"}
              </span>
            </div>

            {/* মাঝখানের বিস্তারিত তথ্য */}
            <div className="space-y-2.5 my-auto py-1">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                  About Organization
                </p>
                <p className="text-xs font-sans text-neutral-300 line-clamp-2 leading-relaxed mt-0.5">
                  {data.description ||
                    data.tagline ||
                    "Verified commercial entity registered on SutraNet Digital Identity Network."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> Operating Hours
                  </p>
                  <p className="text-[10.5px] font-mono text-neutral-200 truncate mt-0.5">
                    {data.workingHours || "Mon - Sat • 10AM - 8PM"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5" /> Official Portal
                  </p>
                  <p className="text-[10.5px] font-mono text-neutral-200 truncate mt-0.5">
                    {data.website
                      ? data.website.replace(/^https?:\/\//, "")
                      : `sutranet.in/p/${kagazId}`}
                  </p>
                </div>
              </div>
            </div>

            {/* নিচের ফুটার নোট */}
            <div className="flex items-center justify-between border-t border-neutral-800 pt-2.5 text-[9.5px] font-mono text-neutral-500">
              <span>Scan QR on front to view products & branches</span>
              <span className="inline-flex items-center gap-1 text-neutral-300">
                <RotateCw className="h-2.5 w-2.5" /> Flip Front
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
