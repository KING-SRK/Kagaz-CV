// app/dashboard/_components/SmartCard.tsx
"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RotateCw, ShieldCheck, Globe } from "lucide-react";
import Image from "next/image";

interface SmartCardProps {
  role: "individual" | "organization" | string;
  kagazId: string;
  data: {
    name: string;
    avatarUrl?: string;
    phone: string;
    email?: string;
    title?: string;
    dob?: string;
    gender?: string;
    tagline?: string;
    address?: string;
    estYear?: string;
  };
}

export default function SmartCard({ role, kagazId, data }: SmartCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const userProfileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${kagazId || "preview"}`
      : `https://kagazcv.vercel.app/p/${kagazId || "preview"}`;

  const websiteHomeUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://kagazcv.vercel.app";

  const isOrg = role === "organization";

  return (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div
        className="w-95 sm:w-112.5 h-67.5 perspective-[1000px] cursor-pointer group select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-700 transform-3d transition-transform ${
            isFlipped ? "transform-[rotateY(180deg)]" : ""
          }`}
        >
          {/* ==================== FRONT SIDE ==================== */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#0B0D10] text-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-neutral-700/60 flex flex-col justify-between overflow-hidden backface-hidden">
            {/* ১. ব্যাকগ্রাউন্ড মেটালিক টেক্সচার ও গ্রিড প্যাটার্ন */}
            <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] bg-size-[12px_12px] opacity-40 pointer-events-none" />

            {/* ২. কার্ভড অ্যাবস্ট্রাক্ট ভেভ ও সিকিউরিটি প্যাটার্ন (Guilloche lines) */}
            <svg
              className="absolute -right-16 -top-16 w-80 h-80 opacity-20 pointer-events-none stroke-neutral-400"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="100"
                cy="100"
                r="40"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              <circle cx="100" cy="100" r="60" strokeWidth="1" />
              <circle
                cx="100"
                cy="100"
                r="80"
                strokeWidth="0.8"
                strokeDasharray="4 2"
              />
              <circle cx="100" cy="100" r="100" strokeWidth="1.2" />
              <circle cx="100" cy="100" r="120" strokeWidth="0.6" />
              <path d="M 0,100 Q 50,50 100,100 T 200,100" strokeWidth="0.7" />
              <path d="M 0,80 Q 50,130 100,80 T 200,80" strokeWidth="0.7" />
            </svg>

            {/* ৩. হলোগ্রাফিক টপ রিফ্লেকশন লাইট */}
            <div className="absolute -top-24 left-1/4 w-72 h-36 bg-linear-to-b from-neutral-500/10 via-emerald-500/5 to-transparent blur-2xl pointer-events-none" />

            {/* টপ হেডার: লোগো ও সিকিউরিটি ট্যাগ */}
            <div className="flex justify-between items-center z-10 border-b border-neutral-800/90 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center bg-linear-to-br from-neutral-100 to-neutral-300 text-neutral-950 font-mono font-bold text-xs rounded shadow-md border border-white/50">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1 leading-none">
                    Sutra
                    <span className="font-serif italic font-light text-neutral-400">
                      Net
                    </span>
                  </span>
                  <span className="text-[7.5px] font-mono tracking-[0.2em] uppercase text-neutral-400 mt-0.5">
                    Smart Identity Card
                  </span>
                </div>
              </div>

              {/* রোল ব্যাজ (Individual / Organization) */}
              <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-700/80 px-2.5 py-1 rounded-full shadow-inner backdrop-blur-sm">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isOrg ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "bg-emerald-400 shadow-[0_0_8px_#34d399]"}`}
                />
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-neutral-200 font-medium">
                  {isOrg ? "ORGANIZATION" : "INDIVIDUAL"}
                </span>
              </div>
            </div>

            {/* মিডল সেকশন: চিপ, অ্যাভাটার, ইনফো ও QR কোড */}
            <div className="grid grid-cols-12 gap-3 items-center z-10 my-auto">
              {/* বামে: ছবি ও মাইক্রোচিপ */}
              <div className="col-span-3 flex flex-col items-center gap-1.5">
                <div className="h-20 w-20 rounded-xl bg-neutral-900 border border-neutral-700/90 flex items-center justify-center overflow-hidden text-neutral-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] relative">
                  <Image
                    src={"/hero-portrait.jpg"}
                    alt="Avatar"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* মাঝে: ইউজারের তথ্য */}
              <div className="col-span-6 space-y-1 min-w-0 pr-1">
                <h3 className="text-base font-serif font-medium text-white truncate tracking-tight">
                  {data.name || (isOrg ? "Organization Name" : "Member Name")}
                </h3>
                <p className="text-[10px] font-mono text-neutral-400 truncate tracking-wide">
                  {isOrg
                    ? data.tagline || "Commercial Business"
                    : data.title || "Identity Holder"}
                </p>

                {/* মেটাডাটা গ্রিড */}
                <div className="pt-1.5 space-y-0.5 text-[9px] font-mono text-neutral-300">
                  <div className="truncate">
                    <span className="text-neutral-500 font-medium">PHONE:</span>{" "}
                    {data.phone || "N/A"}
                  </div>
                  {!isOrg ? (
                    <>
                      <div className="truncate">
                        <span className="text-neutral-500 font-medium">
                          DOB:
                        </span>{" "}
                        {data.dob || "DD/MM/YYYY"}
                      </div>
                      <div className="truncate">
                        <span className="text-neutral-500 font-medium">
                          GENDER:
                        </span>{" "}
                        {data.gender || "M/F"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="truncate">
                        <span className="text-neutral-500 font-medium">
                          EST:
                        </span>{" "}
                        {data.estYear || "2025"}
                      </div>
                      <div className="truncate">
                        <span className="text-neutral-500 font-medium">
                          LOC:
                        </span>{" "}
                        {data.address || "Main City"}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ডানে: ইউজারের নিজস্ব QR কোড */}
              <div className="col-span-3 flex flex-col items-center justify-center pl-2 border-l border-neutral-800/80">
                <div className="p-1.5 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.08)] border border-neutral-300">
                  <QRCodeSVG value={userProfileUrl} size={54} level="M" />
                </div>
                <span className="text-[7px] font-mono uppercase tracking-widest text-neutral-400 text-center mt-1.5">
                  Scan Profile
                </span>
              </div>
            </div>

            {/* ফুটার: কার্ড কোড ও ফ্লিপ অপশন */}
            <div className="flex justify-between items-end border-t border-neutral-800/90 pt-2 z-10 text-[9px] font-mono text-neutral-400">
              <div>
                <span className="block text-neutral-500 text-[7.5px] tracking-widest uppercase">
                  OFFICIAL KAGAZ ID
                </span>
                <span className="text-xs text-neutral-100 font-mono font-medium tracking-widest">
                  {kagazId || "GT-XXXX-XXXX"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9.5px] text-neutral-400 group-hover:text-white transition-colors">
                <span>View Back</span>
                <RotateCw className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* ==================== BACK SIDE ==================== */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#0E1116] text-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-neutral-700/60 flex flex-col justify-between overflow-hidden transform-[rotateY(180deg)] backface-hidden">
            {/* ব্যাক সাইড ম্যাগনেটিক স্ট্রিপ ডিজাইন (Credit card style) */}
            <div className="absolute top-0 left-0 right-0 h-9 bg-neutral-900 border-b border-neutral-800 flex items-center px-4">
              <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-neutral-500">
                AUTHORIZED SIGNATURE NOT REQUIRED • VERIFIED RECORD
              </span>
            </div>

            {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* ব্যাক সাইড হেডার */}
            <div className="pt-7 flex justify-between items-center border-b border-neutral-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="text-[9.5px] font-mono uppercase tracking-widest text-neutral-300">
                  Authentication & Registry
                </span>
              </div>
              <span className="text-[8.5px] font-mono bg-neutral-800/80 border border-neutral-700 px-2 py-0.5 rounded text-neutral-400">
                KagazCV Network
              </span>
            </div>

            {/* সেন্ট্রাল এরিয়া: প্ল্যাটফর্ম QR কোড ও ওয়েবসাইটের বিবরণ */}
            <div className="flex items-center justify-between gap-5 my-auto">
              {/* ওয়েবসাইটের নিজস্ব QR কোড */}
              <div className="flex flex-col items-center shrink-0">
                <div className="p-2 bg-white rounded-xl shadow-md border border-neutral-300">
                  <QRCodeSVG value={websiteHomeUrl} size={78} level="M" />
                </div>
                <span className="text-[7.5px] font-mono uppercase tracking-wider text-neutral-400 mt-1">
                  Website QR
                </span>
              </div>

              {/* প্ল্যাটফর্ম পরিচিতি */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white font-medium">
                    Verified Digital Registry
                  </span>
                </div>
                <p className="text-[10.5px] text-neutral-300 leading-relaxed font-light">
                  This card certifies the holder&apos;s identity on the KagazCV
                  system. Scan the website code to access portal tools or issue
                  credentials.
                </p>
                <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-400/90 pt-0.5">
                  <Globe className="h-3 w-3" />
                  <span>kagazcv.vercel.app</span>
                </div>
              </div>
            </div>

            {/* ব্যাক সাইড ফুটার */}
            <div className="border-t border-neutral-800/80 pt-2 flex justify-between items-center text-[8.5px] font-mono text-neutral-500">
              <span>SECURITY LEVEL • 256-BIT ENCRYPTED</span>
              <div className="flex items-center gap-1 group-hover:text-neutral-300 transition-colors">
                <span>Return to Front</span>
                <RotateCw className="h-2.5 w-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ফ্লিপ ইন্ডিকেটর বাটন */}
      <button
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        className="mt-4 flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <RotateCw className="h-3.5 w-3.5" />
        <span>
          Flip to view{" "}
          {isFlipped
            ? "Front (Holder Info & Profile QR)"
            : "Back (Platform & Website QR)"}
        </span>
      </button>
    </div>
  );
}
