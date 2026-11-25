// app/dashboard/individual/components/DuoSplitCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  UserCheck,
  Phone,
  MapPin,
  Mail,
  User,
  ShieldCheck,
  CalendarFold,
} from "lucide-react";
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
      className="w-full max-w-110 aspect-1.75/1 mx-auto select-none cursor-pointer"
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
          <div className="w-[62%] h-full p-4 sm:p-5 flex flex-col justify-between relative z-10">
            {/* ওপরের SutraNet লোগো ও নাম */}
            <div className="flex items-center justify-start gap-2 z-10">
              <img
                src="/images/sutranet-logo.png"
                alt="SutraNet Logo"
                className="w-6 h-6 rounded-sm"
              />
              <span className="text-sm font-semibold tracking-wide text-slate-900 font-mono">
                Sutra
                <span className="font-serif italic font-light text-neutral-900">
                  Net
                </span>
              </span>
            </div>

            {/* মাঝখানের অংশ: আইডি ঠিক মাঝে হাইলাইটেড */}
            <div className="py-0.5 text-center flex justify-center items-center gap-2 px-2.5 rounded-md w-fit mx-auto">
              <span className="text-base sm:text-lg font-mono font-bold text-neutral-950 tracking-wider">
                {kagazId}
              </span>
            </div>

            {/* বড় Square প্রোফাইল ছবি ও নাম-রোল */}
            <div className="flex items-center gap-3 my-0.5">
              {/* Square প্রোফাইল ছবি */}
              <div className="h-14 w-14 sm:h-15 sm:w-15 rounded-lg border border-neutral-400 bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                {data.avatarUrl ? (
                  <Image
                    src={data.avatarUrl}
                    alt="Avatar"
                    width={64}
                    height={64}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-neutral-700" />
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

            {/* নিচের অংশ: ফোন, লোকেশন ও ইমেইল */}
            <div className="space-y-1 text-[10px] font-mono text-neutral-900 border-t border-neutral-300 pt-1.5">
              <div className="flex items-center gap-5 truncate">
                <div className="flex items-center gap-2 truncate">
                  <div className="p-0.5 text-slate-950 rounded-xs shrink-0">
                    <CalendarFold className="h-3 w-3" />
                  </div>
                  <span className="truncate font-medium">
                    {data.dob || "DD/MM/YYYY"}
                  </span>
                </div>

                <div className="flex items-center gap-2 truncate">
                  <div className="p-0.5 text-slate-950 rounded-xs shrink-0">
                    <UserCheck className="h-3 w-3" />
                  </div>
                  <span className="truncate font-medium">
                    {data.gender || "GENDER"}
                  </span>
                </div>
              </div>

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
          <div className="w-[38%] h-full relative z-10 flex flex-col justify-between items-end pt-2 p-4 pr-5 text-white">
            {/* ওপরের সবুজ ভেরিফাইড ব্যাজ */}
            <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded-full text-[7px] font-mono tracking-wider text-emerald-300 shadow-xs">
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
              <img
                src="/images/sutranet-logo.png"
                alt="SutraNet Logo"
                className="w-6 h-6 rounded-sm"
              />
              <span className="text-sm font-semibold tracking-wide text-white font-mono">
                Sutra
                <span className="font-serif italic font-light text-neutral-200">
                  Net
                </span>
              </span>
            </div>

            {/* মাঝখানের অংশ: QR কোড (ডানপাশে গোছানো) */}
            <div className="flex items-center justify-end my-auto relative z-10">
              <div className="p-2 bg-white rounded-xl shadow-lg border border-neutral-700 shrink-0">
                <QRCodeSVG
                  value="https://sutra-net.vercel.app/"
                  size={72}
                  level="M"
                />
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
