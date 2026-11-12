"use client";

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

export default function CredentialsTab({
  isEditing,
  certifications = [],
  achievements = [],
  references = [],
  onChange,
}: Props) {
  // ---- Certification Handlers ----
  const addCert = () => {
    onChange({
      certifications: [
        ...certifications,
        {
          id: Date.now().toString(),
          name: "",
          issuer: "",
          issueDate: "",
          credentialId: "",
        },
      ],
    });
  };

  // ---- Achievement Handlers ----
  const addAchievement = () => {
    onChange({
      achievements: [
        ...achievements,
        {
          id: Date.now().toString(),
          title: "",
          organization: "",
          date: "",
          description: "",
        },
      ],
    });
  };

  // ---- Reference Handlers ----
  const addReference = () => {
    onChange({
      references: [
        ...references,
        {
          id: Date.now().toString(),
          name: "",
          designation: "",
          organization: "",
          contact: "",
          consentGiven: true,
        },
      ],
    });
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* ১. সার্টিফিকেশন */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-emerald-600" /> Certifications (
            {certifications.length})
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
                  className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs"
                >
                  <p className="text-xs font-bold text-neutral-900">{c.name}</p>
                  <p className="text-[11px] font-mono text-neutral-600">
                    {c.issuer} • {c.issueDate}
                  </p>
                  {c.credentialId && (
                    <p className="text-[10px] font-mono text-neutral-400 mt-1">
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
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-500" /> Honors &
            Achievements ({achievements.length})
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
                  className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-neutral-900">
                      {a.title}
                    </span>
                    <span className="font-mono text-neutral-500">{a.date}</span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-600">
                    {a.organization}
                  </p>
                  {a.description && (
                    <p className="text-xs text-neutral-700 mt-1">
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
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-blue-600" /> Professional
            References ({references.length})
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
                  className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs"
                >
                  <p className="text-xs font-bold text-neutral-900">{r.name}</p>
                  <p className="text-[11px] font-mono text-neutral-600">
                    {r.designation}, {r.organization}
                  </p>
                  {r.consentGiven && r.contact && (
                    <p className="text-[10.5px] font-mono text-neutral-500 mt-1">
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
    <div className="space-y-6">
      {/* ১. সার্টিফিকেশন এডিট */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            1. Certifications
          </span>
          <button
            type="button"
            onClick={addCert}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Certificate
          </button>
        </div>

        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    certifications: certifications.filter(
                      (c) => c.id !== cert.id,
                    ),
                  })
                }
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Certificate Name"
                value={cert.name}
                onChange={(e) =>
                  onChange({
                    certifications: certifications.map((c) =>
                      c.id === cert.id ? { ...c, name: e.target.value } : c,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Issuing Organization (e.g. Meta)"
                value={cert.issuer}
                onChange={(e) =>
                  onChange({
                    certifications: certifications.map((c) =>
                      c.id === cert.id ? { ...c, issuer: e.target.value } : c,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="month"
                value={cert.issueDate}
                onChange={(e) =>
                  onChange({
                    certifications: certifications.map((c) =>
                      c.id === cert.id
                        ? { ...c, issueDate: e.target.value }
                        : c,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Credential ID (Optional)"
                value={cert.credentialId}
                onChange={(e) =>
                  onChange({
                    certifications: certifications.map((c) =>
                      c.id === cert.id
                        ? { ...c, credentialId: e.target.value }
                        : c,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ২. অ্যাচিভমেন্ট এডিট */}
      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            2. Achievements
          </span>
          <button
            type="button"
            onClick={addAchievement}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Achievement
          </button>
        </div>

        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    achievements: achievements.filter((a) => a.id !== ach.id),
                  })
                }
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Achievement Title"
                value={ach.title}
                onChange={(e) =>
                  onChange({
                    achievements: achievements.map((a) =>
                      a.id === ach.id ? { ...a, title: e.target.value } : a,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Organization"
                value={ach.organization}
                onChange={(e) =>
                  onChange({
                    achievements: achievements.map((a) =>
                      a.id === ach.id
                        ? { ...a, organization: e.target.value }
                        : a,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="month"
                value={ach.date}
                onChange={(e) =>
                  onChange({
                    achievements: achievements.map((a) =>
                      a.id === ach.id ? { ...a, date: e.target.value } : a,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
            <input
              type="text"
              placeholder="Short description..."
              value={ach.description}
              onChange={(e) =>
                onChange({
                  achievements: achievements.map((a) =>
                    a.id === ach.id ? { ...a, description: e.target.value } : a,
                  ),
                })
              }
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>
        ))}
      </div>

      {/* ৩. রেফারেন্স এডিট */}
      <div className="space-y-3 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            3. References (Consent-based)
          </span>
          <button
            type="button"
            onClick={addReference}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Reference
          </button>
        </div>

        {references.map((ref) => (
          <div
            key={ref.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    references: references.filter((r) => r.id !== ref.id),
                  })
                }
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Reference Person's Name"
                value={ref.name}
                onChange={(e) =>
                  onChange({
                    references: references.map((r) =>
                      r.id === ref.id ? { ...r, name: e.target.value } : r,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Designation"
                value={ref.designation}
                onChange={(e) =>
                  onChange({
                    references: references.map((r) =>
                      r.id === ref.id
                        ? { ...r, designation: e.target.value }
                        : r,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Organization"
                value={ref.organization}
                onChange={(e) =>
                  onChange({
                    references: references.map((r) =>
                      r.id === ref.id
                        ? { ...r, organization: e.target.value }
                        : r,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Contact Email / Phone (Optional)"
                value={ref.contact}
                onChange={(e) =>
                  onChange({
                    references: references.map((r) =>
                      r.id === ref.id ? { ...r, contact: e.target.value } : r,
                    ),
                  })
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
            <label className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={ref.consentGiven}
                onChange={(e) =>
                  onChange({
                    references: references.map((r) =>
                      r.id === ref.id
                        ? { ...r, consentGiven: e.target.checked }
                        : r,
                    ),
                  })
                }
              />
              <span>I confirm I have consent to display this contact info</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
