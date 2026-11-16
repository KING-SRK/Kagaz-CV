// app/dashboard/organization/tabs/OrgTeamTab.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  ExternalLink,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { OrgTeamMember } from "@/lib/organizationService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import {
  TEAM_DESIGNATIONS,
  TEAM_DEPARTMENTS,
  formatOtherDisplay,
} from "@/constants/orgOptions";

interface Props {
  isEditing: boolean;
  teamMembers: OrgTeamMember[];
  onChange: (newTeam: OrgTeamMember[]) => void;
}

const createDefaultMember = (): OrgTeamMember => ({
  id: Date.now().toString(),
  kagazId: "",
  name: "",
  designation: "",
  department: "",
  intro: "",
  avatarUrl: "",
  consentVerified: false,
  status: "Pending Consent",
});

export default function OrgTeamTab({
  isEditing,
  teamMembers = [],
  onChange,
}: Props) {
  const [lookingUpId, setLookingUpId] = useState<string | null>(null);
  const [lookupFeedback, setLookupFeedback] = useState<
    Record<string, { type: "success" | "error"; text: string }>
  >({});

  useEffect(() => {
    if (isEditing && teamMembers.length === 0) {
      onChange([createDefaultMember()]);
    }
  }, [isEditing, teamMembers.length, onChange]);

  const addMember = () => {
    onChange([...teamMembers, createDefaultMember()]);
  };

  const updateMember = (
    id: string,
    field: keyof OrgTeamMember,
    val: string | boolean,
  ) => {
    onChange(
      teamMembers.map((m) => (m.id === id ? { ...m, [field]: val } : m)),
    );
  };

  const removeMember = (id: string) => {
    onChange(teamMembers.filter((m) => m.id !== id));
  };

  // ⚡ SutraNet Individual Profile ID দিয়ে লাইভ ডেটা খুঁজে আনার ফাংশন
  const handleConnectSutraNetProfile = async (member: OrgTeamMember) => {
    const queryId = member.kagazId?.trim();
    if (!queryId) {
      setLookupFeedback((prev) => ({
        ...prev,
        [member.id]: {
          type: "error",
          text: "Please enter a SutraNet Profile ID first.",
        },
      }));
      return;
    }

    try {
      setLookingUpId(member.id);
      setLookupFeedback((prev) => {
        const copy = { ...prev };
        delete copy[member.id];
        return copy;
      });

      const { data, error } = await supabase
        .from("profiles")
        .select("id, kagaz_id, full_name, avatar_url, title, bio, role")
        .or(`kagaz_id.eq.${queryId},id.eq.${queryId}`)
        .maybeSingle();

      if (error || !data) {
        setLookupFeedback((prev) => ({
          ...prev,
          [member.id]: {
            type: "error",
            text: "No SutraNet Individual profile found with this ID.",
          },
        }));
        return;
      }

      if (data.role === "organization") {
        setLookupFeedback((prev) => ({
          ...prev,
          [member.id]: {
            type: "error",
            text: "This ID belongs to an Organization, not an Individual.",
          },
        }));
        return;
      }

      onChange(
        teamMembers.map((m) =>
          m.id === member.id
            ? {
                ...m,
                kagazId: data.kagaz_id || queryId,
                name: data.full_name || m.name,
                avatarUrl: data.avatar_url || "",
                intro: m.intro || data.title || data.bio || "",
                consentVerified: false,
                status: "Pending Consent",
              }
            : m,
        ),
      );

      setLookupFeedback((prev) => ({
        ...prev,
        [member.id]: {
          type: "success",
          text: `Profile matched: ${data.full_name}. Pending member consent.`,
        },
      }));
    } catch {
      setLookupFeedback((prev) => ({
        ...prev,
        [member.id]: {
          type: "error",
          text: "Failed to verify SutraNet ID.",
        },
      }));
    } finally {
      setLookingUpId(null);
    }
  };

  const displayMembers =
    teamMembers.length > 0 ? teamMembers : [createDefaultMember()];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
            <Users className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              Company Team & Management ({displayMembers.length})
            </span>
          </span>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {displayMembers.map((m, idx) => {
            const designationLabel = formatOtherDisplay(m.designation);
            const departmentLabel = formatOtherDisplay(m.department);
            const isAccepted = m.consentVerified || m.status === "Accepted";

            return (
              <div
                key={m.id}
                className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3 sm:space-y-3.5"
              >
                {/* কার্ড হেডার */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2 sm:pb-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                      Team Member #{idx + 1}
                    </span>

                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase rounded-xs shrink-0">
                        <CheckCircle2 className="h-3 w-3 shrink-0" /> Consent
                        Accepted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono uppercase rounded-xs shrink-0">
                        <Clock className="h-3 w-3 shrink-0" /> Pending Consent
                      </span>
                    )}
                  </div>

                  {/* কানেক্টেড প্রোফাইল লিংক */}
                  {m.kagazId && (
                    <Link
                      href={`/p/${m.kagazId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-[10px] font-mono uppercase text-neutral-900 rounded-xs shrink-0 transition-colors"
                    >
                      <span>View SutraNet Profile</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </Link>
                  )}
                </div>

                {/* ছবি ও গ্রিড ফিল্ডস */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-start">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xs border border-neutral-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {m.avatarUrl ? (
                      <img
                        src={m.avatarUrl}
                        alt={m.name || "Member"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-300" />
                    )}
                  </div>

                  {/* ৪টি মূল ফিল্ড */}
                  <div className="flex-1 w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 text-xs font-mono">
                    <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                      <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                        Person Name
                      </span>
                      <p
                        className={`font-medium truncate ${
                          m.name ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {m.name || "Not Set"}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                      <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                        SutraNet Profile ID
                      </span>
                      <p
                        className={`font-medium truncate ${
                          m.kagazId ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {m.kagazId || "Not Linked"}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                      <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                        Designation
                      </span>
                      <p
                        className={`font-medium truncate ${
                          designationLabel
                            ? "text-neutral-900"
                            : "text-neutral-400"
                        }`}
                      >
                        {designationLabel || "Not Set"}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                      <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                        Department
                      </span>
                      <p
                        className={`font-medium truncate ${
                          departmentLabel
                            ? "text-neutral-900"
                            : "text-neutral-400"
                        }`}
                      >
                        {departmentLabel || "Not Set"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Introduction */}
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs text-xs">
                  <span className="text-[9.5px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Professional Introduction
                  </span>
                  <p
                    className={`leading-relaxed wrap-break-word ${
                      m.intro
                        ? "text-neutral-700"
                        : "text-neutral-400 font-mono"
                    }`}
                  >
                    {m.intro || "Not Set"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      {/* হেডার ও নতুন মেম্বার যোগ করার বাটন */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
            Company Team & Management ({displayMembers.length})
          </span>
          <span className="text-[11px] font-sans text-neutral-500">
            Connect existing SutraNet Individual profiles or add key leadership
            members.
          </span>
        </div>
        <button
          type="button"
          onClick={addMember}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Member
        </button>
      </div>

      {/* সতর্কবার্তা / Consent Policy নোট */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xs flex items-start gap-2.5 text-[11px] font-sans text-amber-900">
        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Connecting a SutraNet Profile ID sends a link request. A member is
          shown as a verified team connection on the public page only after they
          accept consent.
        </p>
      </div>

      {/* প্রতিটি মেম্বার কার্ড */}
      <div className="space-y-3.5 sm:space-y-4">
        {displayMembers.map((m, idx) => {
          const feedback = lookupFeedback[m.id];

          return (
            <div
              key={m.id}
              className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5"
            >
              {/* কার্ড হেডার */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2.5">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                    Team Member #{idx + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs border shrink-0 ${
                      m.consentVerified || m.status === "Accepted"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {m.consentVerified || m.status === "Accepted" ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 shrink-0" /> Consent
                        Accepted
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 shrink-0" /> Pending Member
                        Consent
                      </>
                    )}
                  </span>
                </div>

                {displayMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    title="Remove Member"
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Connect Existing SutraNet Profile বার */}
              <div className="p-2.5 sm:p-3 bg-white border border-neutral-200/80 rounded-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-end gap-2.5">
                  <div className="flex-1 min-w-0">
                    <FormInput
                      label="Connect Existing SutraNet Profile ID (Optional)"
                      value={m.kagazId || ""}
                      onChange={(val) => updateMember(m.id, "kagazId", val)}
                      placeholder="Enter SutraNet Individual Profile ID"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleConnectSutraNetProfile(m)}
                    disabled={lookingUpId === m.id}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
                  >
                    {lookingUpId === m.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Search className="h-3.5 w-3.5" />
                    )}
                    <span>Fetch & Link Profile</span>
                  </button>
                </div>

                {feedback && (
                  <p
                    className={`text-[11px] font-mono wrap-break-word ${
                      feedback.type === "success"
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {feedback.text}
                  </p>
                )}
              </div>

              {/* রো ১: Person Name, Designation & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                <FormInput
                  label="Person Name"
                  value={m.name}
                  onChange={(val) => updateMember(m.id, "name", val)}
                  placeholder="Enter member full name"
                />

                <FormSelectWithOther
                  label="Designation"
                  value={m.designation}
                  options={TEAM_DESIGNATIONS}
                  placeholder="Select designation"
                  otherPlaceholder="Enter custom designation"
                  onChange={(val) => updateMember(m.id, "designation", val)}
                />

                <FormSelectWithOther
                  label="Department"
                  value={m.department}
                  options={TEAM_DEPARTMENTS}
                  placeholder="Select department"
                  otherPlaceholder="Enter custom department"
                  onChange={(val) => updateMember(m.id, "department", val)}
                />
              </div>

              {/* রো ২: Professional Introduction */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Professional Introduction
                </label>
                <textarea
                  rows={2}
                  value={m.intro}
                  onChange={(e) => updateMember(m.id, "intro", e.target.value)}
                  placeholder="Enter a short professional introduction or role summary"
                  className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
