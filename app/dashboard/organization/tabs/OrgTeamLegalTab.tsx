// app/dashboard/organization/tabs/OrgTeamLegalTab.tsx
"use client";

import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { OrgTeamMember, OrgLegalInfo } from "@/lib/organizationService";

interface Props {
  isEditing: boolean;
  teamMembers: OrgTeamMember[];
  legalInfo: OrgLegalInfo;
  onChange: (updated: {
    team_members?: OrgTeamMember[];
    legal_info?: OrgLegalInfo;
  }) => void;
}

export default function OrgTeamLegalTab({
  isEditing,
  teamMembers = [],
  legalInfo = {},
  onChange,
}: Props) {
  // --- Team Member Handlers ---
  const addMember = () => {
    onChange({
      team_members: [
        ...teamMembers,
        {
          id: Date.now().toString(),
          kagazId: "",
          name: "",
          designation: "",
          department: "",
          intro: "",
          consentVerified: true,
        },
      ],
    });
  };

  const updateMember = (
    id: string,
    field: keyof OrgTeamMember,
    val: string | boolean,
  ) => {
    onChange({
      team_members: teamMembers.map((m) =>
        m.id === id ? { ...m, [field]: val } : m,
      ),
    });
  };

  const removeMember = (id: string) => {
    onChange({
      team_members: teamMembers.filter((m) => m.id !== id),
    });
  };

  // --- Legal Info Handler ---
  const updateLegal = (field: keyof OrgLegalInfo, val: string | boolean) => {
    onChange({
      legal_info: {
        ...legalInfo,
        [field]: val,
      },
    });
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* ১. টিম ও লিডারশিপ */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-blue-600" /> Leadership & Team (
            {teamMembers.length})
          </h3>

          {teamMembers.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 italic">
              No team members listed yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-neutral-950">
                        {member.name || "Team Member"}
                      </h4>
                      <p className="text-[11px] font-mono text-neutral-600">
                        {member.designation}{" "}
                        {member.department ? `• ${member.department}` : ""}
                      </p>
                    </div>

                    {member.kagazId && (
                      <Link
                        href={`/p/${member.kagazId}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-neutral-300 hover:border-neutral-900 text-[10px] font-mono text-neutral-800 rounded-xs"
                        title="View Connected SutraNet Profile"
                      >
                        <span>ID</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </Link>
                    )}
                  </div>

                  {member.intro && (
                    <p className="text-xs text-neutral-600 pt-1">
                      {member.intro}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ২. লিগ্যাল ও রেজিস্ট্রেশন ভল্ট */}
        <div className="space-y-3 border-t border-neutral-100 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Legal &
              Government Registrations
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Private Vault Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
            {legalInfo.gstin && (
              <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] uppercase text-neutral-400 block">
                    GSTIN
                  </span>
                  <span className="font-bold text-neutral-900">
                    {legalInfo.gstin}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                  {legalInfo.showGstin ? (
                    <>
                      <Eye className="h-3 w-3 text-emerald-600" /> Public
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 text-amber-600" /> Private
                    </>
                  )}
                </span>
              </div>
            )}

            {legalInfo.pan && (
              <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs">
                <span className="text-[9.5px] uppercase text-neutral-400 block">
                  Business PAN (Private)
                </span>
                <span className="font-bold text-neutral-900">
                  {legalInfo.pan}
                </span>
              </div>
            )}

            {legalInfo.udyam && (
              <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs">
                <span className="text-[9.5px] uppercase text-neutral-400 block">
                  Udyam (MSME) Reg.
                </span>
                <span className="font-bold text-neutral-900">
                  {legalInfo.udyam}
                </span>
              </div>
            )}

            {legalInfo.cin && (
              <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs">
                <span className="text-[9.5px] uppercase text-neutral-400 block">
                  CIN / LLPIN
                </span>
                <span className="font-bold text-neutral-900">
                  {legalInfo.cin}
                </span>
              </div>
            )}

            {legalInfo.tradeLicense && (
              <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs">
                <span className="text-[9.5px] uppercase text-neutral-400 block">
                  Trade License
                </span>
                <span className="font-bold text-neutral-900">
                  {legalInfo.tradeLicense}
                </span>
              </div>
            )}

            {legalInfo.fssai && (
              <div className="p-3 bg-neutral-50/60 border border-neutral-200/80 rounded-xs">
                <span className="text-[9.5px] uppercase text-neutral-400 block">
                  FSSAI License
                </span>
                <span className="font-bold text-neutral-900">
                  {legalInfo.fssai}
                </span>
              </div>
            )}
          </div>

          {!legalInfo.gstin &&
            !legalInfo.pan &&
            !legalInfo.udyam &&
            !legalInfo.cin &&
            !legalInfo.tradeLicense &&
            !legalInfo.fssai && (
              <p className="text-xs font-mono text-neutral-400 italic">
                No legal registrations added yet (optional for small/local
                businesses).
              </p>
            )}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-6">
      {/* ১. টিম মেম্বার এডিট */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            1. Management & Team Members
          </span>
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-3 py-1 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Member
          </button>
        </div>

        {teamMembers.map((member, idx) => (
          <div
            key={member.id}
            className="p-3.5 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                Member #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeMember(member.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Member Full Name *"
                value={member.name}
                onChange={(e) =>
                  updateMember(member.id, "name", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Connect SutraNet ID (Optional, e.g. SN-1024)"
                value={member.kagazId || ""}
                onChange={(e) =>
                  updateMember(member.id, "kagazId", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Designation (e.g. Co-Founder & CEO)"
                value={member.designation}
                onChange={(e) =>
                  updateMember(member.id, "designation", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Department (e.g. Software / Hardware)"
                value={member.department}
                onChange={(e) =>
                  updateMember(member.id, "department", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>

            <input
              type="text"
              placeholder="Short role introduction..."
              value={member.intro}
              onChange={(e) => updateMember(member.id, "intro", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />

            <label className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={member.consentVerified}
                onChange={(e) =>
                  updateMember(member.id, "consentVerified", e.target.checked)
                }
              />
              <span>
                I confirm this member consented to be listed under this
                organization
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* ২. লিগ্যাল ও রেজিস্ট্রেশন ভল্ট এডিট */}
      <div className="space-y-3 border-t border-neutral-200 pt-5">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-neutral-700 block">
            2. Legal & Government Registrations (All Optional)
          </span>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Sensitive IDs like PAN remain private by default. Choose what to
            display publicly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xs space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-neutral-500">
              GSTIN Number
            </label>
            <input
              type="text"
              placeholder="e.g. 19AAAAA0000A1Z5"
              value={legalInfo.gstin || ""}
              onChange={(e) => updateLegal("gstin", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
            <label className="flex items-center gap-1.5 text-[10.5px] font-mono text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={legalInfo.showGstin || false}
                onChange={(e) => updateLegal("showGstin", e.target.checked)}
              />
              <span>Display GSTIN on public profile</span>
            </label>
          </div>

          <div className="p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xs space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-neutral-500">
              Business PAN (Always Private)
            </label>
            <input
              type="text"
              placeholder="e.g. ABCDE1234F"
              value={legalInfo.pan || ""}
              onChange={(e) => updateLegal("pan", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Udyam (MSME) Registration
            </label>
            <input
              type="text"
              placeholder="UDYAM-WB-00-0000000"
              value={legalInfo.udyam || ""}
              onChange={(e) => updateLegal("udyam", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              CIN / LLPIN (For Pvt Ltd / LLP)
            </label>
            <input
              type="text"
              placeholder="Corporate ID Number"
              value={legalInfo.cin || ""}
              onChange={(e) => updateLegal("cin", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Trade License / Shop Act No.
            </label>
            <input
              type="text"
              placeholder="Municipal Trade License No."
              value={legalInfo.tradeLicense || ""}
              onChange={(e) => updateLegal("tradeLicense", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              FSSAI License (For Food Business)
            </label>
            <input
              type="text"
              placeholder="14-digit FSSAI Number"
              value={legalInfo.fssai || ""}
              onChange={(e) => updateLegal("fssai", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
