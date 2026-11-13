// app/dashboard/organization/tabs/OrgDocumentsTab.tsx
"use client";

import { useState } from "react";
import {
  FileText,
  CreditCard,
  BookOpen,
  Printer,
  Building2,
  Globe,
  Mail,
  PhoneCall,
  MapPin,
  QrCode,
} from "lucide-react";
import { FullCompanyProfile } from "@/lib/organizationService";
import { formatOtherDisplay } from "@/constants/orgOptions";

interface Props {
  company: FullCompanyProfile;
}

type DocType = "profile_pdf" | "visiting_card" | "intro_pdf" | "catalogue";

export default function OrgDocumentsTab({ company }: Props) {
  const [selectedDoc, setSelectedDoc] = useState<DocType>("profile_pdf");

  const primaryContact =
    (company.contacts || []).find((c) => c.isPublic) ||
    (company.contacts || [])[0];
  const headOffice = (company.branches || [])[0];

  const handlePrint = () => {
    window.print();
  };

  const docOptions: { id: DocType; label: string; desc: string }[] = [
    {
      id: "profile_pdf",
      label: "A. Company Profile PDF",
      desc: "Complete official profile with services, contact & address.",
    },
    {
      id: "visiting_card",
      label: "C. Digital Visiting Card",
      desc: "Compact business card with SutraNet ID & QR code.",
    },
    {
      id: "intro_pdf",
      label: "B. Business Introduction",
      desc: "One-page executive summary for clients & partners.",
    },
    {
      id: "catalogue",
      label: "D. Product & Service Catalogue",
      desc: "Downloadable brochure of all your offerings & pricing.",
    },
  ];

  return (
    <div className="space-y-5">
      {/* হেডার ও প্রিন্ট/ডাউনলোড বাটন */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            Company Profile Documents & Visiting Card
          </span>
          <p className="text-[11px] font-sans text-neutral-500 mt-0.5">
            Generate print-ready PDFs and digital business cards directly from
            your SutraNet profile.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-mono uppercase rounded-xs cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* ৪টি ডকুমেন্ট সিলেক্টর কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {docOptions.map((doc) => {
          const active = selectedDoc === doc.id;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => setSelectedDoc(doc.id)}
              className={`p-3 text-left border rounded-xs transition-colors cursor-pointer ${
                active
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-neutral-50/70 text-neutral-800 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <span className="text-[11px] font-mono font-bold block">
                {doc.label}
              </span>
              <span
                className={`text-[10px] font-sans mt-1 block leading-snug ${
                  active ? "text-neutral-300" : "text-neutral-500"
                }`}
              >
                {doc.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= লাইভ প্রিভিউ এরিয়া ================= */}
      <div className="p-6 bg-neutral-100/80 border border-neutral-200 rounded-xs flex justify-center">
        {/* C. DIGITAL VISITING CARD */}
        {selectedDoc === "visiting_card" && (
          <div className="w-full max-w-md bg-neutral-950 text-white p-6 rounded-sm shadow-lg border border-neutral-800 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xs bg-white text-neutral-950 flex items-center justify-center overflow-hidden shrink-0">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.company_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold tracking-wide">
                    {company.company_name || "Your Company Name"}
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-400">
                    {formatOtherDisplay(company.business_category) ||
                      formatOtherDisplay(company.industry) ||
                      "Business Category"}
                  </p>
                </div>
              </div>

              <div className="p-2 bg-white text-neutral-950 rounded-xs shrink-0 flex flex-col items-center">
                <QrCode className="h-10 w-10" />
                <span className="text-[8px] font-mono font-bold mt-0.5">
                  SCAN ID
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-4 space-y-1.5 text-xs font-mono text-neutral-300">
              {primaryContact?.phone && (
                <p className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{primaryContact.phone}</span>
                </p>
              )}
              {primaryContact?.email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{primaryContact.email}</span>
                </p>
              )}
              {company.website && (
                <p className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{company.website}</span>
                </p>
              )}
              {headOffice && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {[headOffice.city, headOffice.state]
                      .filter(Boolean)
                      .join(", ") || "Location Not Set"}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-neutral-800 pt-2.5">
              <span>SUTRANET VERIFIED IDENTITY</span>
              <span className="text-white font-bold">
                ID: {company.kagaz_id || "SN-ORG-XXXX"}
              </span>
            </div>
          </div>
        )}

        {/* A / B / D: A4 DOCUMENT PREVIEW (Company Profile / Intro / Catalogue) */}
        {selectedDoc !== "visiting_card" && (
          <div className="w-full max-w-2xl bg-white border border-neutral-300 p-8 shadow-sm space-y-6 text-neutral-900">
            {/* ডকুমেন্ট হেডার */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-neutral-950 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.company_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-7 w-7 text-neutral-400" />
                  )}
                </div>
                <div>
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                    {selectedDoc === "profile_pdf"
                      ? "OFFICIAL COMPANY PROFILE"
                      : selectedDoc === "intro_pdf"
                        ? "EXECUTIVE BUSINESS INTRODUCTION"
                        : "PRODUCT & SERVICE CATALOGUE"}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-neutral-950">
                    {company.company_name || "Organization Name"}
                  </h2>
                  <p className="text-xs font-mono text-neutral-600">
                    {formatOtherDisplay(company.industry)} •{" "}
                    {formatOtherDisplay(company.business_category)}
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-neutral-500 shrink-0">
                <QrCode className="h-10 w-10 text-neutral-900 ml-auto mb-1" />
                <span>ID: {company.kagaz_id}</span>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono uppercase font-bold text-neutral-500">
                About the Company
              </h4>
              <p className="text-xs font-sans text-neutral-800 leading-relaxed">
                {selectedDoc === "intro_pdf"
                  ? company.short_description || company.detailed_description
                  : company.detailed_description ||
                    company.short_description ||
                    "Company overview not added yet."}
              </p>
            </div>

            {/* Products & Services (Profile PDF এবং Catalogue-এ দেখাবে) */}
            {(selectedDoc === "profile_pdf" || selectedDoc === "catalogue") &&
              (company.offerings || []).length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Products & Services
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {company.offerings.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-neutral-200 bg-neutral-50/50 rounded-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-neutral-950">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold">
                            {item.pricingType === "Quotation-based"
                              ? "On Quote"
                              : item.price
                                ? `₹${item.price}`
                                : item.type}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Contact & Address Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-200 pt-4 text-xs font-mono">
              <div>
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-1">
                  Contact Information
                </span>
                {primaryContact?.phone && <p>Phone: {primaryContact.phone}</p>}
                {primaryContact?.email && <p>Email: {primaryContact.email}</p>}
                {company.website && <p>Web: {company.website}</p>}
              </div>

              <div>
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-1">
                  Registered / Head Office
                </span>
                {headOffice ? (
                  <p>
                    {[
                      headOffice.buildingNo,
                      headOffice.street,
                      headOffice.area,
                      headOffice.city,
                      headOffice.state,
                      headOffice.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : (
                  <p className="text-neutral-400">Address not added</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
