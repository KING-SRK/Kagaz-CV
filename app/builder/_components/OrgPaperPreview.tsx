// app/dashboard/builder/_components/OrgPaperPreview.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import { OrgData } from "./OrganizationForm";

interface OrgPaperPreviewProps {
  data: OrgData;
  kagazId: string;
}

export default function OrgPaperPreview({
  data,
  kagazId,
}: OrgPaperPreviewProps) {
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${kagazId || "preview"}`
      : `https://kagazcv.com/p/${kagazId || "preview"}`;

  return (
    <div className="flex justify-center p-4 sm:p-8 overflow-y-auto">
      <div
        id="printable-cv"
        className="w-full max-w-[650px] min-h-[850px] bg-white border border-neutral-300 shadow-[0_4px_30px_rgba(0,0,0,0.06)] p-8 sm:p-12 flex flex-col justify-between text-[#141414] print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
      >
        <div className="space-y-8">
          {/* হেডার */}
          <div className="flex justify-between items-start gap-4 border-b-2 border-neutral-950 pb-6">
            <div className="space-y-1.5 max-w-[420px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Official Business Profile
              </span>
              <h1 className="text-3xl font-serif tracking-tight font-medium">
                {data.orgName ? (
                  <span className="text-neutral-950">{data.orgName}</span>
                ) : (
                  <span className="text-neutral-400 select-none">
                    ENTER BUSINESS NAME
                  </span>
                )}
              </h1>
              <p className="text-xs font-mono uppercase tracking-wider">
                {data.tagline ? (
                  <span className="text-neutral-700">{data.tagline}</span>
                ) : (
                  <span className="text-neutral-400 select-none">
                    BUSINESS CATEGORY / TAGLINE
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 text-[11px] font-mono">
                {data.email ? (
                  <span className="text-neutral-600">{data.email}</span>
                ) : (
                  <span className="text-neutral-400 select-none">
                    contact@domain.com
                  </span>
                )}
                <span className="text-neutral-400">•</span>
                {data.phone ? (
                  <span className="text-neutral-600">{data.phone}</span>
                ) : (
                  <span className="text-neutral-400 select-none">
                    +91 00000 00000
                  </span>
                )}
                <span className="text-neutral-400">•</span>
                {data.workingHours ? (
                  <span className="text-neutral-600">{data.workingHours}</span>
                ) : (
                  <span className="text-neutral-400 select-none">
                    Mon - Sat: 10AM - 9PM
                  </span>
                )}
              </div>
            </div>

            {/* QR কোড */}
            <div className="flex flex-col items-center text-center pl-4 border-l border-neutral-200">
              <div className="p-1 border border-neutral-950 bg-white">
                <QRCodeSVG value={publicUrl} size={68} level="M" />
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest mt-1 text-neutral-500">
                Scan for Storefront
              </span>
            </div>
          </div>

          {/* লোকেশন / অ্যাড্রেস */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-semibold border-b border-neutral-200 pb-1">
              Store / Office Address
            </h2>
            <p className="text-xs font-mono text-neutral-700">
              {data.address ? (
                data.address
              ) : (
                <span className="text-neutral-400 select-none">
                  Shop / Office Street Address, City, Pincode
                </span>
              )}
            </p>
          </div>

          {/* সার্ভিসসমূহ */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-semibold border-b border-neutral-200 pb-1">
              Available Services & Catalog
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.services
                ? data.services.split(",").map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono bg-neutral-100 border border-neutral-300 px-2.5 py-1 text-neutral-800"
                    >
                      {item.trim()}
                    </span>
                  ))
                : ["Service A", "Service B", "Service C", "Service D"].map(
                    (item, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono border border-dashed border-neutral-300 px-2.5 py-1 text-neutral-400 select-none"
                      >
                        {item}
                      </span>
                    ),
                  )}
            </div>
          </div>

          {/* এবাউট */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-900 font-semibold border-b border-neutral-200 pb-1">
              About Enterprise & Notice
            </h2>
            <p className="text-xs leading-relaxed font-light">
              {data.description ? (
                <span className="text-neutral-700">{data.description}</span>
              ) : (
                <span className="text-neutral-400 italic select-none">
                  Detailed institutional description, service delivery
                  standards, payment channels, and official notices...
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ফুটার */}
        <div className="border-t border-neutral-200 pt-4 mt-12 flex justify-between items-center text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Kagaz Verified Official Merchant Document</span>
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
