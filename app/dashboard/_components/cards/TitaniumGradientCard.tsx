// app/dashboard/_components/cards/TitaniumGradientCard.tsx
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { RotateCw, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { CardProps } from "./types";

export default function TitaniumGradientCard({
  role,
  kagazId,
  data,
  userProfileUrl,
  websiteHomeUrl,
}: CardProps) {
  const isOrg = role === "organization";

  return (
    <>
      {/* ================= FRONT SIDE (PURE BLACK & WHITE GRADIENT) ================= */}
      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-black via-neutral-950 to-white text-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-300/40 flex flex-col justify-between overflow-hidden backface-hidden ring-1 ring-white/30">
        {/* খাঁটি সাদা মেটালিক গ্লো ও রিফ্লেকশন ব্লাশ */}
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-white/30 rounded-full blur-3xl pointer-events-none" />

        {/* Emerald ডিজাইনের সেই আসল সিকিউরিটি সার্কুলার কার্ভ */}
        <svg
          className="absolute right-0 top-0 w-96 h-96 opacity-25 pointer-events-none stroke-white"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="150"
            cy="50"
            r="70"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <circle cx="150" cy="50" r="100" strokeWidth="1" />
          <circle
            cx="150"
            cy="50"
            r="130"
            strokeWidth="0.6"
            strokeDasharray="4 2"
          />
        </svg>

        {/* টপ হেডার */}
        <div className="flex justify-between items-center z-10 border-b border-white/20 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center bg-white text-black font-mono font-bold text-xs rounded shadow-md border border-neutral-200">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1 leading-none drop-shadow-sm">
                Sutra
                <span className="font-serif italic font-light text-neutral-200">
                  Net
                </span>
              </span>
              <span className="text-[7.5px] font-mono tracking-[0.2em] uppercase text-neutral-300 mt-0.5">
                Titanium Grade
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 border border-white/30 px-2.5 py-1 rounded-full shadow-inner backdrop-blur-md">
            <Sparkles className="h-2.5 w-2.5 text-white animate-pulse" />
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-white font-medium">
              {isOrg ? "ENTERPRISE" : "TITANIUM"}
            </span>
          </div>
        </div>

        {/* বডি গ্রিড */}
        <div className="grid grid-cols-12 gap-3 items-center z-10 my-auto">
          {/* বাঁয়ে ফটো ফ্রেম */}
          <div className="col-span-3 flex flex-col items-center gap-1.5">
            <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-xl bg-black border-2 border-white/40 p-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.8)] overflow-hidden relative">
              <Image
                src={data.avatarUrl || "/hero-portrait.jpg"}
                alt="Avatar"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* মাঝে বিবরণ */}
          <div className="col-span-6 space-y-1 min-w-0 pr-1">
            <h3 className="text-base font-serif font-medium text-white truncate tracking-tight drop-shadow-sm">
              {data.name || (isOrg ? "Organization Name" : "Member Name")}
            </h3>
            <p className="text-[10px] font-mono text-neutral-300 truncate tracking-wide">
              {isOrg
                ? data.tagline || "Verified Commercial Unit"
                : data.title || "Identity Holder"}
            </p>

            <div className="pt-1.5 space-y-0.5 text-[9px] font-mono text-neutral-200">
              <div className="truncate">
                <span className="text-neutral-400 font-medium">TEL:</span>{" "}
                <span className="text-white">{data.phone || "N/A"}</span>
              </div>
              {!isOrg ? (
                <>
                  <div className="truncate">
                    <span className="text-neutral-400 font-medium">DOB:</span>{" "}
                    <span className="text-white">
                      {data.dob || "DD/MM/YYYY"}
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="text-neutral-400 font-medium">SEX:</span>{" "}
                    <span className="text-white">{data.gender || "M/F"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="truncate">
                    <span className="text-neutral-400 font-medium">EST:</span>{" "}
                    <span className="text-white">{data.estYear || "2025"}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-neutral-400 font-medium">LOC:</span>{" "}
                    <span className="text-white">
                      {data.address || "Kolkata, WB"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ডানে কিউআর কোড (সাদা কর্নারে উচ্চ কনট্রাস্ট সহ) */}
          <div className="col-span-3 flex flex-col items-center justify-center pl-2 border-l border-white/20">
            <div className="p-1.5 bg-white rounded-lg shadow-xl border-2 border-black">
              <QRCodeSVG value={userProfileUrl} size={54} level="M" />
            </div>
            <span className="text-[7px] font-mono uppercase tracking-widest text-black font-bold text-center mt-1.5">
              Scan Pass
            </span>
          </div>
        </div>

        {/* ফুটার */}
        <div className="flex justify-between items-end border-t border-white/20 pt-2 z-10 text-[9px] font-mono">
          <div>
            <span className="block text-neutral-400 text-[7.5px] tracking-widest uppercase">
              AUTHENTICATED PASS
            </span>
            <span className="text-xs text-white font-mono font-semibold tracking-widest drop-shadow-sm">
              {kagazId || "ST-XXXX-XXXX"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-black font-bold">
            <span>View Back</span>
            <RotateCw className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* ================= BACK SIDE (INVERTED HIGH-CONTRAST B&W) ================= */}
      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tl from-black via-neutral-950 to-white text-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-300/40 flex flex-col justify-between overflow-hidden transform-[rotateY(180deg)] backface-hidden ring-1 ring-white/30">
        {/* ম্যাগনেটিক স্ট্রিপ */}
        <div className="absolute top-0 left-0 right-0 h-9 bg-black border-b border-white/20 flex items-center px-4">
          <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-neutral-300">
            SECURE REPOSITORY KEY • LEVEL 3 ENCRYPTED
          </span>
        </div>

        <div className="pt-7 flex justify-between items-center border-b border-white/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            <span className="text-[9.5px] font-mono uppercase tracking-widest text-black font-bold">
              SutraNet Registry
            </span>
          </div>
          <span className="text-[8.5px] font-mono bg-black text-white px-2 py-0.5 rounded border border-white/20">
            Titanium Tier
          </span>
        </div>

        <div className="flex items-center justify-between gap-5 my-auto">
          <div className="flex flex-col items-center shrink-0">
            <div className="p-2 bg-white rounded-xl shadow-xl border-2 border-black">
              <QRCodeSVG value={websiteHomeUrl} size={78} level="M" />
            </div>
            <span className="text-[7.5px] font-mono uppercase tracking-wider text-neutral-300 mt-1">
              Portal QR
            </span>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-white font-medium">
                Cryptographic Seal
              </span>
            </div>
            <p className="text-[10.5px] text-neutral-300 leading-relaxed font-light">
              This passport proves identity integrity across SutraNet nodes.
              Scan with any standard device to verify credentials.
            </p>
            <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-neutral-300 pt-0.5">
              <Globe className="h-3 w-3" />
              <span>sutranet.in</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-2 flex justify-between items-center text-[8.5px] font-mono text-neutral-400">
          <span>HIGH-SECURITY GRADE • 256-BIT</span>
          <div className="flex items-center gap-1 text-white">
            <span>Return to Front</span>
            <RotateCw className="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
    </>
  );
}
