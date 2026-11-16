// app/dashboard/organization/tabs/OrgLegalTab.tsx
"use client";

import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  FileCheck2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { OrgLegalInfo } from "@/lib/organizationService";
import { FormInput } from "@/components/ui/FormFields";

interface Props {
  isEditing: boolean;
  legalInfo: OrgLegalInfo;
  onChange: (updated: OrgLegalInfo) => void;
}

const maskSensitiveId = (val?: string) => {
  if (!val) return "";
  const clean = val.trim();
  if (clean.length <= 4) return "****";
  return `${clean.slice(0, 3)}${"*".repeat(clean.length - 5)}${clean.slice(-2)}`;
};

export default function OrgLegalTab({
  isEditing,
  legalInfo = { showGstin: false, verificationStatus: "Unverified" },
  onChange,
}: Props) {
  const updateField = <K extends keyof OrgLegalInfo>(
    field: K,
    value: OrgLegalInfo[K],
  ) => {
    onChange({
      ...legalInfo,
      [field]: value,
    });
  };

  const handleClearSensitiveData = () => {
    onChange({
      showGstin: false,
      verificationStatus: "Unverified",
      verificationConsent: false,
    });
  };

  const status = legalInfo.verificationStatus || "Unverified";

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-5 sm:space-y-6 animate-in fade-in-50 duration-200">
        {/* ১. Registration Information */}
        <div className="space-y-3 sm:space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-800 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-neutral-900 shrink-0" />
              <span>1. Registration Information</span>
            </span>
            <span className="text-[10px] sm:text-[10.5px] font-mono text-neutral-500 flex items-center gap-1">
              <Lock className="h-3 w-3 text-amber-600 shrink-0" />
              <span>Confidential numbers are masked or hidden publicly</span>
            </span>
          </div>

          <div className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3">
            {/* রো ১: GSTIN & PAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs font-mono">
              <div className="p-2.5 sm:p-3 bg-white border border-neutral-200/80 rounded-xs flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    GSTIN
                  </span>
                  <p
                    className={`font-medium truncate ${
                      legalInfo.gstin ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {legalInfo.gstin || "Not Set"}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9.5px] uppercase rounded-xs border shrink-0 ${
                    legalInfo.showGstin
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {legalInfo.showGstin ? (
                    <>
                      <Eye className="h-2.5 w-2.5 shrink-0" /> Public
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-2.5 w-2.5 shrink-0" /> Private
                    </>
                  )}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-white border border-neutral-200/80 rounded-xs flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                    Company / Business PAN
                  </span>
                  <p
                    className={`font-medium truncate ${
                      legalInfo.pan ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {legalInfo.pan ? maskSensitiveId(legalInfo.pan) : "Not Set"}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9.5px] uppercase rounded-xs border bg-neutral-100 text-neutral-600 border-neutral-200 shrink-0">
                  <Lock className="h-2.5 w-2.5 shrink-0" /> Always Private
                </span>
              </div>
            </div>

            {/* রো ২: CIN, LLPIN, Udyam Registration Number */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  CIN (Corporate ID)
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.cin ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {legalInfo.cin || "Not Set"}
                </p>
              </div>

              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  LLPIN
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.llpin ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {legalInfo.llpin || "Not Set"}
                </p>
              </div>

              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  Udyam Registration (MSME)
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.udyam ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {legalInfo.udyam || "Not Set"}
                </p>
              </div>
            </div>

            {/* রো ৩: Shop & Establishment, Trade Licence, FSSAI Licence */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  Shop & Establishment Reg.
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.shopEstablishment
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {legalInfo.shopEstablishment || "Not Set"}
                </p>
              </div>

              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  Trade Licence
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.tradeLicense
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {legalInfo.tradeLicense || "Not Set"}
                </p>
              </div>

              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  FSSAI Licence
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.fssai ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {legalInfo.fssai || "Not Set"}
                </p>
              </div>
            </div>

            {/* রো ৪: IEC, Professional Tax & Other Government Licence */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  Import Export Code (IEC)
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.iec ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {legalInfo.iec || "Not Set"}
                </p>
              </div>

              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                  Professional Tax Reg.
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.professionalTax
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {legalInfo.professionalTax || "Not Set"}
                </p>
              </div>

              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5 truncate">
                  {legalInfo.otherLicenseName || "Other Government Licence"}
                </span>
                <p
                  className={`font-medium truncate ${
                    legalInfo.otherLicenseNumber
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {legalInfo.otherLicenseNumber || "Not Set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ২. Verification Status & Compliance */}
        <div className="space-y-3 border-t border-neutral-100 pt-4 sm:pt-5">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-800 flex items-center gap-1.5">
            <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>2. Verification Status & Compliance</span>
          </span>

          <div className="p-3 sm:p-4 bg-neutral-50/70 border border-neutral-200 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-neutral-900">
                  Platform Review Status:
                </span>
                {status === "Verified" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase rounded-xs shrink-0">
                    <CheckCircle2 className="h-3 w-3 shrink-0" /> Verified by
                    SutraNet
                  </span>
                ) : status === "Pending Review" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono uppercase rounded-xs shrink-0">
                    <Clock className="h-3 w-3 shrink-0" /> Under Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-mono uppercase rounded-xs shrink-0">
                    <AlertCircle className="h-3 w-3 shrink-0" /> Not Verified
                    Yet
                  </span>
                )}
              </div>
              <p className="text-[11px] font-sans text-neutral-500 leading-relaxed">
                Verification badges are issued only after manual compliance
                review. Supporting links are kept strictly confidential and
                never displayed publicly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in-50 duration-200">
      {/* ১. Registration Information */}
      <div className="space-y-3 sm:space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
              1. Registration Information (All Optional)
            </span>
            <span className="text-[11px] font-sans text-neutral-500">
              Enter only the registrations applicable to your business type.
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearSensitiveData}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-1 border border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700 text-[10px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
          >
            <Trash2 className="h-3 w-3 shrink-0" /> Purge All Legal Data
          </button>
        </div>

        <div className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-4">
          {/* GSTIN & PAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-start">
            <div className="space-y-2">
              <FormInput
                label="GSTIN (Optional)"
                value={legalInfo.gstin || ""}
                onChange={(val) => updateField("gstin", val.toUpperCase())}
                placeholder="Enter your 15-digit GSTIN"
              />
              <button
                type="button"
                onClick={() =>
                  updateField("showGstin", !Boolean(legalInfo.showGstin))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs border cursor-pointer transition-colors ${
                  legalInfo.showGstin
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {legalInfo.showGstin ? (
                  <>
                    <Eye className="h-3 w-3 shrink-0" /> GSTIN Public on Profile
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 shrink-0" /> GSTIN Kept Private
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <FormInput
                label="Company / Business PAN (Optional)"
                value={legalInfo.pan || ""}
                onChange={(val) => updateField("pan", val.toUpperCase())}
                placeholder="Enter your 10-character PAN"
              />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs border bg-neutral-100 text-neutral-600 border-neutral-200">
                <Lock className="h-3 w-3 shrink-0" /> Private by Default (Never
                Public)
              </span>
            </div>
          </div>

          {/* CIN, LLPIN, Udyam Registration Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              label="CIN (Optional)"
              value={legalInfo.cin || ""}
              onChange={(val) => updateField("cin", val.toUpperCase())}
              placeholder="Enter your Corporate Identity Number"
            />

            <FormInput
              label="LLPIN (Optional)"
              value={legalInfo.llpin || ""}
              onChange={(val) => updateField("llpin", val.toUpperCase())}
              placeholder="Enter your LLP Identification Number"
            />

            <FormInput
              label="Udyam Registration Number (Optional)"
              value={legalInfo.udyam || ""}
              onChange={(val) => updateField("udyam", val.toUpperCase())}
              placeholder="Enter your Udyam MSME number"
            />
          </div>

          {/* Shop & Establishment, Trade Licence, FSSAI Licence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              label="Shop & Establishment Reg. (Optional)"
              value={legalInfo.shopEstablishment || ""}
              onChange={(val) => updateField("shopEstablishment", val)}
              placeholder="Enter your registration number"
            />

            <FormInput
              label="Trade Licence (Optional)"
              value={legalInfo.tradeLicense || ""}
              onChange={(val) => updateField("tradeLicense", val)}
              placeholder="Enter your trade licence number"
            />

            <FormInput
              label="FSSAI Licence (Optional)"
              value={legalInfo.fssai || ""}
              onChange={(val) => updateField("fssai", val)}
              placeholder="Enter your 14-digit FSSAI number"
            />
          </div>

          {/* IEC, Professional Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Import Export Code / IEC (Optional)"
              value={legalInfo.iec || ""}
              onChange={(val) => updateField("iec", val.toUpperCase())}
              placeholder="Enter your 10-digit IEC"
            />

            <FormInput
              label="Professional Tax Registration (Optional)"
              value={legalInfo.professionalTax || ""}
              onChange={(val) => updateField("professionalTax", val)}
              placeholder="Enter your Professional Tax number"
            />
          </div>

          {/* Other Government Licence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-200/70">
            <FormInput
              label="Other Government Licence Name (Custom)"
              value={legalInfo.otherLicenseName || ""}
              onChange={(val) => updateField("otherLicenseName", val)}
              placeholder="Enter your licence or authority name"
            />

            <FormInput
              label="Other Licence / Registration Number"
              value={legalInfo.otherLicenseNumber || ""}
              onChange={(val) => updateField("otherLicenseNumber", val)}
              placeholder="Enter your custom licence number"
            />
          </div>
        </div>
      </div>

      {/* ২. Verification Documents & Consent */}
      <div className="space-y-3 border-t border-neutral-200 pt-4 sm:pt-5">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
            2. Verification Documents & Compliance Consent (Optional)
          </span>
          <span className="text-[11px] font-sans text-neutral-500">
            Submit a secure link (e.g., DigiLocker or Google Drive PDF) for
            platform verification. Documents are never published publicly.
          </span>
        </div>

        <div className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5">
          <FormInput
            label="Supporting Certificate Link (DigiLocker / Drive URL)"
            type="url"
            value={legalInfo.verificationDocUrl || ""}
            onChange={(val) => {
              onChange({
                ...legalInfo,
                verificationDocUrl: val,
                verificationStatus: val ? "Pending Review" : "Unverified",
              });
            }}
            placeholder="Enter your secure verification document URL"
          />

          <label className="flex items-start gap-2.5 p-2.5 sm:p-3 bg-white border border-neutral-200 rounded-xs cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(legalInfo.verificationConsent)}
              onChange={(e) =>
                updateField("verificationConsent", e.target.checked)
              }
              className="mt-0.5 shrink-0"
            />
            <span className="text-[11px] font-sans text-neutral-600 leading-relaxed">
              I consent to SutraNet reviewing the submitted registration details
              strictly for identity verification. I understand that submitting
              details does not grant an automatic government-verified badge
              until review is completed, and I can purge this data anytime.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
