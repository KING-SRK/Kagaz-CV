// app/dashboard/individual/tabs/CredentialsTab.tsx
"use client";

import { useEffect } from "react";
import { Award, Trophy, UserCheck, Plus, Trash2 } from "lucide-react";

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  designation: string;
  organization: string;
  contact: string;
  consentGiven: boolean;
}

interface Props {
  isEditing: boolean;
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  references: ReferenceItem[];
  onChange: (updated: {
    certifications?: CertificationItem[];
    achievements?: AchievementItem[];
    references?: ReferenceItem[];
  }) => void;
}

const createDefaultCert = (): CertificationItem => ({
  id: `cert-${Date.now()}`,
  name: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
});

const createDefaultAchievement = (): AchievementItem => ({
  id: `ach-${Date.now()}`,
  title: "",
  organization: "",
  date: "",
  description: "",
});

const createDefaultReference = (): ReferenceItem => ({
  id: `ref-${Date.now()}`,
  name: "",
  designation: "",
  organization: "",
  contact: "",
  consentGiven: true,
});

export default function CredentialsTab({
  isEditing,
  certifications = [],
  achievements = [],
  references = [],
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing) {
      const updates: {
        certifications?: CertificationItem[];
        achievements?: AchievementItem[];
        references?: ReferenceItem[];
      } = {};

      let hasChanges = false;
      if (certifications.length === 0) {
        updates.certifications = [createDefaultCert()];
        hasChanges = true;
      }
      if (achievements.length === 0) {
        updates.achievements = [createDefaultAchievement()];
        hasChanges = true;
      }
      if (references.length === 0) {
        updates.references = [createDefaultReference()];
        hasChanges = true;
      }

      if (hasChanges) {
        onChange(updates);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const displayCerts =
    certifications.length > 0 ? certifications : [createDefaultCert()];
  const displayAchievements =
    achievements.length > 0 ? achievements : [createDefaultAchievement()];
  const displayReferences =
    references.length > 0 ? references : [createDefaultReference()];

  const addCert = () => {
    onChange({
      certifications: [...displayCerts, createDefaultCert()],
    });
  };

  const addAchievement = () => {
    onChange({
      achievements: [...displayAchievements, createDefaultAchievement()],
    });
  };

  const addReference = () => {
    onChange({
      references: [...displayReferences, createDefaultReference()],
    });
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-5 sm:space-y-6 animate-in fade-in-50 duration-200">
        {/* ১. সার্টিফিকেশন */}
        <div className="space-y-2.5">
          <h3 className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Certifications ({certifications.length})</span>
          </h3>
          {certifications.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400">
              No certifications added.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {certifications.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1 min-w-0"
                >
                  <p className="text-xs font-bold text-neutral-900 truncate">
                    {c.name || "Untitled Certificate"}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-600 truncate">
                    {c.issuer || "Issuer Not Set"} •{" "}
                    {c.issueDate || "Date Not Set"}
                  </p>
                  {c.credentialId && (
                    <p className="text-[10px] font-mono text-neutral-400 truncate">
                      ID: {c.credentialId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ২. অ্যাচিভমেন্ট */}
        <div className="space-y-2.5 border-t border-neutral-100 pt-4">
          <h3 className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Honors & Achievements ({achievements.length})</span>
          </h3>
          {achievements.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400">
              No achievements added.
            </p>
          ) : (
            <div className="space-y-2">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1 min-w-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-xs">
                    <span className="font-bold text-neutral-900 truncate">
                      {a.title || "Untitled Achievement"}
                    </span>
                    <span className="font-mono text-[11px] sm:text-xs text-neutral-500 shrink-0">
                      {a.date || "Date Not Set"}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-600 truncate">
                    {a.organization || "Organization Not Set"}
                  </p>
                  {a.description && (
                    <p className="text-xs text-neutral-700 mt-1 wrap-break-word">
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ৩. রেফারেন্স */}
        <div className="space-y-2.5 border-t border-neutral-100 pt-4">
          <h3 className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>Professional References ({references.length})</span>
          </h3>
          {references.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400">
              No references added.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {references.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1 min-w-0"
                >
                  <p className="text-xs font-bold text-neutral-900 truncate">
                    {r.name || "Reference Name Not Set"}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-600 truncate">
                    {r.designation || "Designation"},{" "}
                    {r.organization || "Organization"}
                  </p>
                  {r.consentGiven && r.contact && (
                    <p className="text-[10.5px] font-mono text-neutral-500 mt-1 truncate">
                      Contact: {r.contact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in-50 duration-200">
      {/* ১. সার্টিফিকেশন এডিট */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700">
            1. Certifications ({displayCerts.length})
          </span>
          <button
            type="button"
            onClick={addCert}
            className="inline-flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white px-2.5 py-1.5 sm:py-1 text-[10px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Certificate
          </button>
        </div>

        {displayCerts.map((cert, idx) => (
          <div
            key={cert.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                Certificate #{idx + 1}
              </span>
              {displayCerts.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      certifications: displayCerts.filter(
                        (c) => c.id !== cert.id,
                      ),
                    })
                  }
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Enter certificate name"
                value={cert.name}
                onChange={(e) =>
                  onChange({
                    certifications: displayCerts.map((c) =>
                      c.id === cert.id ? { ...c, name: e.target.value } : c,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="text"
                placeholder="Enter issuing organization"
                value={cert.issuer}
                onChange={(e) =>
                  onChange({
                    certifications: displayCerts.map((c) =>
                      c.id === cert.id ? { ...c, issuer: e.target.value } : c,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="month"
                value={cert.issueDate}
                onChange={(e) =>
                  onChange({
                    certifications: displayCerts.map((c) =>
                      c.id === cert.id
                        ? { ...c, issueDate: e.target.value }
                        : c,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="text"
                placeholder="Enter credential ID (Optional)"
                value={cert.credentialId}
                onChange={(e) =>
                  onChange({
                    certifications: displayCerts.map((c) =>
                      c.id === cert.id
                        ? { ...c, credentialId: e.target.value }
                        : c,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ২. অ্যাচিভমেন্ট এডিট */}
      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700">
            2. Achievements ({displayAchievements.length})
          </span>
          <button
            type="button"
            onClick={addAchievement}
            className="inline-flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white px-2.5 py-1.5 sm:py-1 text-[10px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Achievement
          </button>
        </div>

        {displayAchievements.map((ach, idx) => (
          <div
            key={ach.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                Achievement #{idx + 1}
              </span>
              {displayAchievements.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      achievements: displayAchievements.filter(
                        (a) => a.id !== ach.id,
                      ),
                    })
                  }
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Enter achievement title"
                value={ach.title}
                onChange={(e) =>
                  onChange({
                    achievements: displayAchievements.map((a) =>
                      a.id === ach.id ? { ...a, title: e.target.value } : a,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="text"
                placeholder="Enter organization"
                value={ach.organization}
                onChange={(e) =>
                  onChange({
                    achievements: displayAchievements.map((a) =>
                      a.id === ach.id
                        ? { ...a, organization: e.target.value }
                        : a,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="month"
                value={ach.date}
                onChange={(e) =>
                  onChange({
                    achievements: displayAchievements.map((a) =>
                      a.id === ach.id ? { ...a, date: e.target.value } : a,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
            <input
              type="text"
              placeholder="Enter brief description"
              value={ach.description}
              onChange={(e) =>
                onChange({
                  achievements: displayAchievements.map((a) =>
                    a.id === ach.id ? { ...a, description: e.target.value } : a,
                  ),
                })
              }
              className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
            />
          </div>
        ))}
      </div>

      {/* ৩. রেফারেন্স এডিট */}
      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700">
            3. References ({displayReferences.length})
          </span>
          <button
            type="button"
            onClick={addReference}
            className="inline-flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white px-2.5 py-1.5 sm:py-1 text-[10px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Reference
          </button>
        </div>

        {displayReferences.map((ref, idx) => (
          <div
            key={ref.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                Reference #{idx + 1}
              </span>
              {displayReferences.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      references: displayReferences.filter(
                        (r) => r.id !== ref.id,
                      ),
                    })
                  }
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Enter reference person's name"
                value={ref.name}
                onChange={(e) =>
                  onChange({
                    references: displayReferences.map((r) =>
                      r.id === ref.id ? { ...r, name: e.target.value } : r,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="text"
                placeholder="Enter designation"
                value={ref.designation}
                onChange={(e) =>
                  onChange({
                    references: displayReferences.map((r) =>
                      r.id === ref.id
                        ? { ...r, designation: e.target.value }
                        : r,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="text"
                placeholder="Enter organization"
                value={ref.organization}
                onChange={(e) =>
                  onChange({
                    references: displayReferences.map((r) =>
                      r.id === ref.id
                        ? { ...r, organization: e.target.value }
                        : r,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
              <input
                type="text"
                placeholder="Enter contact email or phone"
                value={ref.contact}
                onChange={(e) =>
                  onChange({
                    references: displayReferences.map((r) =>
                      r.id === ref.id ? { ...r, contact: e.target.value } : r,
                    ),
                  })
                }
                className="w-full border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
            <label className="flex items-start sm:items-center gap-2 text-[11px] font-mono text-neutral-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={ref.consentGiven}
                onChange={(e) =>
                  onChange({
                    references: displayReferences.map((r) =>
                      r.id === ref.id
                        ? { ...r, consentGiven: e.target.checked }
                        : r,
                    ),
                  })
                }
                className="mt-0.5 sm:mt-0 shrink-0"
              />
              <span>I confirm I have consent to display this contact info</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
