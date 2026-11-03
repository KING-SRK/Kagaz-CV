// app/dashboard/_components/cards/DuoSplitCard.tsx
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { RotateCw, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { CardProps } from "./types";

export default function DuoSplitCard({
  role,
  kagazId,
  data,
  userProfileUrl,
  websiteHomeUrl,
}: CardProps) {
  const isOrg = role === "organization";

  return (
    <>
      {/* FRONT SIDE */}
      <div className="absolute inset-0 w-full h-full rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-neutral-300 flex overflow-hidden backface-hidden ring-1 ring-neutral-200">
        {/* বাঁদিকের ৬০% অংশ: পিওর হোয়াইট */}
        <div className="w-[62%] h-full p-5 sm:p-6 flex flex-col justify-between bg-white text-neutral-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#000000_0.75px,transparent_0.75px)] bg-size-[14px_14px] opacity-[0.04] pointer-events-none" />

          <div className="flex items-center gap-2.5 z-10">
            <span className="flex h-6 w-6 items-center justify-center bg-neutral-950 text-white font-mono font-bold text-xs rounded-xs">
              S
            </span>
            <span className="text-sm font-semibold tracking-tight text-neutral-950">
              Sutra<span className="font-serif italic font-light">Net</span>
            </span>
          </div>

          <div className="flex items-center gap-3.5 z-10 my-auto">
            <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full border-2 border-neutral-950 p-0.5 shrink-0 bg-neutral-100 overflow-hidden shadow-xs">
              <Image
                src={data.avatarUrl || "/hero-portrait.jpg"}
                alt="Card Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-950 truncate leading-snug">
                {data.name || "Member Name"}
              </h3>
              <p className="text-[10px] font-mono text-neutral-500 truncate uppercase">
                {isOrg
                  ? data.tagline || "Enterprise Hub"
                  : data.title || "Identity Holder"}
              </p>
              <span className="inline-block px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 text-[8.5px] font-mono uppercase text-neutral-700 font-semibold rounded-xs mt-1">
                {isOrg ? "Corporate" : "Individual"}
              </span>
            </div>
          </div>

          <div className="space-y-0.5 text-[9px] font-mono text-neutral-600 border-t border-neutral-200/80 pt-2 z-10">
            <div className="flex justify-between">
              <span className="text-neutral-400">TEL</span>
              <span className="font-medium text-neutral-900">
                {data.phone || "N/A"}
              </span>
            </div>
            {!isOrg ? (
              <div className="flex justify-between">
                <span className="text-neutral-400">DOB</span>
                <span className="font-medium text-neutral-900">
                  {data.dob || "DD/MM/YYYY"}
                </span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-neutral-400">LOC</span>
                <span className="font-medium text-neutral-900 truncate max-w-[120px]">
                  {data.address || "Kolkata"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ডানদিকের ৩৮% অংশ: জেট ব্ল্যাক */}
        <div className="w-[38%] h-full bg-[#0A0A0A] p-4 sm:p-5 flex flex-col justify-between items-center text-white relative border-l border-neutral-950">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-1 bg-white/10 border border-white/15 px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider text-neutral-200">
            <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
            <span>VERIFIED</span>
          </div>

          <div className="flex flex-col items-center my-auto z-10">
            <div className="p-2 bg-white rounded-xl shadow-lg border border-neutral-200">
              <QRCodeSVG value={userProfileUrl} size={68} level="M" />
            </div>
            <span className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-neutral-400 mt-2">
              SCAN PASS
            </span>
          </div>

          <div className="w-full text-center border-t border-neutral-800 pt-1.5 z-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-200 block truncate">
              {kagazId || "ST-0000-00"}
            </span>
          </div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#FCFBFA] shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-neutral-300 flex flex-col justify-between overflow-hidden transform-[rotateY(180deg)] backface-hidden ring-1 ring-neutral-200">
        <div className="h-10 bg-[#0A0A0A] w-full flex items-center justify-between px-6 border-b border-neutral-900">
          <span className="text-[7.5px] font-mono uppercase tracking-[0.3em] text-neutral-400">
            SUTRANET AUTHENTICATED SMART CARD • ZERO KNOWLEDGE
          </span>
          <span className="text-[8px] font-mono text-emerald-400 font-semibold">
            PASS-V2
          </span>
        </div>

        <div className="flex items-center justify-between gap-6 px-6 sm:px-8 my-auto">
          <div className="space-y-1.5 text-left flex-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-neutral-950" />
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-950 font-bold">
                Official Registry
              </span>
            </div>
            <p className="text-[10.5px] text-neutral-600 leading-relaxed font-light">
              This identity card provides instant offline and digital credential
              verification across the SutraNet registry network.
            </p>
            <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-neutral-800 pt-1">
              <Globe className="h-3 w-3 text-neutral-500" />
              <span className="font-medium">sutranet.in</span>
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <div className="p-2 bg-white rounded-xl shadow-md border-2 border-neutral-950">
              <QRCodeSVG value={websiteHomeUrl} size={70} level="M" />
            </div>
            <span className="text-[7.5px] font-mono uppercase tracking-wider text-neutral-500 mt-1">
              Portal Link
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200 px-6 py-2 bg-neutral-50 flex justify-between items-center text-[8.5px] font-mono text-neutral-500">
          <span>ISSUED BY SUTRANET PLATFORM</span>
          <div className="flex items-center gap-1">
            <span>Click to flip</span>
            <RotateCw className="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
    </>
  );
}
