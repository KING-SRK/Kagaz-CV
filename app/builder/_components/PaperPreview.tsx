// app/dashboard/builder/_components/PaperPreview.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import { ResumeData } from "./IndividualForm";

interface PaperPreviewProps {
  data: ResumeData;
  kagazId: string;
}

export default function PaperPreview({ data, kagazId }: PaperPreviewProps) {
  const publicProfileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${kagazId || "preview"}`
      : `https://kagazcv.com/p/${kagazId || "preview"}`;

  return (
    <div className="flex justify-center p-4 sm:p-8 overflow-y-auto">
      {/* A4 সাইজ পেপারের মতো কনটেইনার */}
      <div
        id="printable-cv"
        className="w-full max-w-[650px] min-h-[850px] bg-white border border-neutral-300 shadow-[0_4px_30px_rgba(0,0,0,0.06)] p-8 sm:p-12 flex flex-col justify-between text-[#141414] print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
      >
        <div className="space-y-8">
          {/* হেডার সেকশন + QR কোড */}
          <div className="flex justify-between items-start gap-4 border-b border-neutral-900 pb-6">
            <div className="space-y-1.5 max-w-[420px]">
              <h1 className="text-3xl font-serif tracking-tight font-medium">
                {data.fullName ? (
                  <span className="text-neutral-950">{data.fullName}</span>
                ) : (
                  <span className="text-neutral-400 font-normal select-none">
                    ENTER YOUR FULL NAME
                  </span>
                )}
              </h1>

              <p className="text-xs font-mono uppercase tracking-wider">
                {data.title ? (
                  <span className="text-neutral-700">{data.title}</span>
                ) : (
                  <span className="text-neutral-400 font-normal select-none">
                    YOUR PROFESSIONAL TITLE
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 text-[11px] font-mono">
                {data.email ? (
                  <span className="text-neutral-600">{data.email}</span>
                ) : (
                  <span className="text-neutral-400 font-normal select-none">
                    email@address.com
                  </span>
                )}
                <span className="text-neutral-400 font-normal">•</span>
                {data.phone ? (
                  <span className="text-neutral-600">{data.phone}</span>
                ) : (
                  <span className="text-neutral-400 font-normal select-none">
                    +91 00000 00000
                  </span>
                )}
                <span className="text-neutral-400 font-normal">•</span>
                {data.location ? (
                  <span className="text-neutral-600">{data.location}</span>
                ) : (
                  <span className="text-neutral-400 font-normal select-none">
                    City, Country
                  </span>
                )}
              </div>
            </div>

            {/* ডায়নামিক QR কোড */}
            <div className="flex flex-col items-center text-center pl-4 border-l border-neutral-200">
              <div className="p-1 border border-neutral-950 bg-white">
                <QRCodeSVG value={publicProfileUrl} size={68} level="M" />
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest mt-1 text-neutral-400 font-normal">
                Scan for Digital CV
              </span>
            </div>
          </div>

          {/* প্রফেশনাল সামারি / বায়ো */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-semibold border-b border-neutral-200 pb-1">
              About / Summary
            </h2>
            <p className="text-xs leading-relaxed font-light">
              {data.bio ? (
                <span className="text-neutral-700">{data.bio}</span>
              ) : (
                <span className="text-neutral-400 font-normal italic select-none">
                  Write a short summary about your background, strengths, and
                  what drives your professional career...
                </span>
              )}
            </p>
          </div>

          {/* এক্সপেরিয়েন্স */}
          <div className="space-y-3">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-semibold border-b border-neutral-200 pb-1">
              Experience
            </h2>
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold font-sans">
                  {data.experienceTitle ? (
                    <span className="text-neutral-900">
                      {data.experienceTitle}
                    </span>
                  ) : (
                    <span className="text-neutral-400 font-normal select-none">
                      Job Position / Role
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-mono">
                  {data.experienceCompany ? (
                    <span className="text-neutral-500">
                      {data.experienceCompany}
                    </span>
                  ) : (
                    <span className="text-neutral-400 font-normal select-none">
                      Company or Organization
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs font-light leading-relaxed">
                {data.experienceDesc ? (
                  <span className="text-neutral-600">
                    {data.experienceDesc}
                  </span>
                ) : (
                  <span className="text-neutral-400 font-normal italic select-none">
                    Outline your key responsibilities, milestones, tools
                    utilized, and overall contribution...
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* কোর স্কিলস */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-semibold border-b border-neutral-200 pb-1">
              Core Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills
                ? data.skills.split(",").map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-neutral-800"
                    >
                      {s.trim()}
                    </span>
                  ))
                : ["Skill One", "Skill Two", "Skill Three", "Skill Four"].map(
                    (placeholderSkill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono border border-dashed border-neutral-300 px-2 py-0.5 text-neutral-400 font-normal select-none"
                      >
                        {placeholderSkill}
                      </span>
                    ),
                  )}
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <div className="border-t border-neutral-200 pt-4 mt-12 flex justify-between items-center text-[10px] font-mono text-neutral-400 font-normal">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Kagaz Verified Physical Document</span>
          </div>
          <div>
            ID:{" "}
            <span className="text-neutral-900 font-medium">
              {kagazId || "GT-XXXX-XXXX"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
