// app/dashboard/individual/components/DuoSplitCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { RotateCw, Phone, MapPin, Mail, User, ShieldCheck } from "lucide-react";
import { CardProps } from "./types";

export default function DuoSplitCard({
  kagazId,
  data,
  userProfileUrl,
}: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped((prev) => !prev)}
      title="Click card to flip"
      className="w-full max-w-[440px] aspect-[1.75/1] mx-auto select-none cursor-pointer"
      style={{ perspective: "1000px" }}
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
          id="card-front-side"
          className="absolute inset-0 w-full h-full rounded-2xl shadow-xl border border-neutral-500 flex overflow-hidden text-neutral-900"
          style={{
            backgroundImage: "url('/cards/ind-front-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* বাঁদিকের অংশ: নাম, পদবি ও কন্টাক্ট ইনফো */}
          <div className="w-[62%] h-full p-5 flex flex-col justify-between relative z-10">
            {/* ওপরের SutraNet লোগো ও নাম */}
            <div className="flex items-center justify-start gap-2 z-10">
              <span className="flex h-6 w-6 items-center justify-center bg-slate-900 text-neutral-50 font-mono font-bold text-[11px] rounded-xs shrink-0 shadow-sm">
                S
              </span>
              <span className="text-xs font-semibold tracking-wide text-slate-900 font-mono">
                Sutra
                <span className="font-serif italic font-light text-slate-900">
                  Net
                </span>
              </span>
            </div>

            {/* প্রোফাইল ছবি ও নাম-রোল */}
            <div className="flex items-center gap-3 my-1">
              {/* প্রোফাইল ছবি */}
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-neutral-400 bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                {data.avatarUrl ? (
                  <Image
                    src={data.avatarUrl}
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-neutral-700" />
                )}
              </div>

              {/* নাম ও রোল */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <h2 className="text-sm sm:text-base font-serif font-bold text-neutral-950 truncate tracking-wide leading-tight">
                  {data.name || "YOUR NAME"}
                </h2>
                <p className="text-[9.5px] sm:text-[10px] font-mono font-semibold tracking-wider uppercase text-neutral-700 truncate">
                  {data.title || "PROFESSIONAL ROLE"}
                </p>
              </div>
            </div>

            {/* মাঝখানের অংশ: আইডি ঠিক মাঝে হাইলাইটেড */}
            <div className="my-auto py-1 text-center flex justify-center items-center gap-2 bg-neutral-200/60 py-1 px-2.5 rounded-md border border-neutral-300/60 w-fit mx-auto shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 tracking-wider">
                ID:
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-neutral-950 tracking-wider">
                {kagazId || "JT-2611-0000"}
              </span>
            </div>

            {/* নিচের অংশ: ফোন, লোকেশন ও ইমেইল */}
            <div className="space-y-1.5 text-[10px] font-mono text-neutral-900 border-t border-neutral-300 pt-2">
              <div className="flex items-center gap-2 truncate">
                <div className="p-0.5 text-slate-950 rounded-xs shrink-0">
                  <Phone className="h-3 w-3" />
                </div>
                <span className="truncate font-medium">
                  {data.phone || "123 - 456799"}
                </span>
              </div>

              <div className="flex items-center gap-2 truncate">
                <div className="p-0.5 text-slate-950 rounded-xs shrink-0">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="truncate font-medium">
                  {data.address || "Kolkata, India"}
                </span>
              </div>

              <div className="flex items-center gap-2 truncate">
                <div className="p-0.5 text-slate-950 rounded-xs shrink-0">
                  <Mail className="h-3 w-3" />
                </div>
                <span className="truncate font-medium">
                  {data.email || "youremail@gmail.com"}
                </span>
              </div>
            </div>
          </div>

          {/* ডানদিকের অংশ: ওপরে গ্রিন ভেরিফাইড ব্যাজ এবং একদম নিচে ইউজারের কিউআর কোড */}
          <div className="w-[38%] h-full relative z-10 flex flex-col justify-between items-end pt-2 p-4 text-white">
            {/* ওপরের সবুজ ভেরিফাইড ব্যাজ */}
            <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider text-emerald-300 shadow-xs">
              <ShieldCheck className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
              <span>VERIFIED</span>
            </div>

            {/* একদম নিচের দিকে ইউজারের কিউআর কোড */}
            <div className="p-1.5 bg-white rounded-lg shadow-md border border-neutral-700 mt-auto">
              <QRCodeSVG value={userProfileUrl} size={56} level="M" />
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
            id="card-back-side"
            className="absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between text-white"
            style={{
              backgroundImage: "url('/cards/ind-back-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* ওপরের অংশ: লোগো ও নাম (ডানপাশে ফিক্সড) */}
            <div className="flex items-center justify-end gap-2.5 z-10">
              <span className="flex h-6 w-6 items-center justify-center bg-white text-neutral-950 font-mono font-bold text-xs rounded-xs shrink-0 shadow-sm">
                S
              </span>
              <span className="text-base font-semibold tracking-wide text-white font-mono">
                Sutra
                <span className="font-serif italic font-light text-neutral-200">
                  Net
                </span>
              </span>
            </div>

            {/* মাঝখানের অংশ: QR কোড (ডানপাশে গোছানো) */}
            <div className="flex items-center justify-end my-auto relative z-10">
              <div className="p-2 bg-white rounded-xl shadow-lg border border-neutral-700 shrink-0">
                <QRCodeSVG value={userProfileUrl} size={72} level="M" />
              </div>
            </div>

            {/* নিচের ফুটার: এক লাইনের বিবরণ */}
            <div className="flex justify-end items-center text-[9px] sm:text-[9.5px] font-mono text-neutral-200 z-10 font-medium text-right">
              <p>
                Official digital identity & tech <br /> solutions portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
