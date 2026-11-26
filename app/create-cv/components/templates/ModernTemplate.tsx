// app/create-cv/components/templates/ModernTemplate.tsx
"use client";

import { ShieldCheck } from "lucide-react";
import { CvData } from "../../types";
import { getResolvedCvData } from "../CvPreview";

interface Props {
  rawData: CvData;
}

export default function ModernTemplate({ rawData }: Props) {
  const hasAnyInput = Boolean(
    rawData.avatarUrl ||
    rawData.fullName?.trim() ||
    rawData.title?.trim() ||
    rawData.email?.trim() ||
    rawData.phone?.trim() ||
    rawData.location?.trim() ||
    rawData.objective?.trim() ||
    rawData.summary?.trim() ||
    rawData.experience?.some(
      (e) =>
        e.designation?.trim() ||
        e.company?.trim() ||
        e.responsibilities?.trim(),
    ) ||
    rawData.projects?.some((p) => p.title?.trim() || p.description?.trim()) ||
    rawData.education?.some(
      (ed) => ed.degree?.trim() || ed.institution?.trim(),
    ) ||
    rawData.skills?.some((s) => s.trim()),
  );

  // খালি ফিল্ড ও স্যাম্পল ফলব্যাক পরিষ্কারভাবে হ্যান্ডেল করা হচ্ছে
  const data: CvData = getResolvedCvData(rawData);

  const { visibility } = data;
  const hasContact =
    data.email ||
    data.phone ||
    data.location ||
    (visibility.socialLinks && data.socialLinks.length > 0);
  const hasPersonal =
    data.personalDetails.dob ||
    data.personalDetails.gender ||
    data.personalDetails.nationality ||
    data.personalDetails.noticePeriod;

  const sectionTitleClass =
    "text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-900 bg-neutral-100 px-2.5 py-1 border-l-2 border-neutral-900 mb-3";

  return (
    <div
      id="cv-printable-area"
      className="relative bg-white text-neutral-900 font-sans w-full min-h-[297mm] shadow-lg border border-neutral-300 p-6 sm:p-10 lg:p-12 flex flex-col print:w-full print:max-w-none print:min-h-[270mm] print:shadow-none print:border-none print:p-0"
    >
      {!hasAnyInput && (
        <div className="mb-4 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono uppercase tracking-wider flex items-center justify-between rounded-xs print:hidden">
          <span>Modern Template Preview</span>
          <span>Type in any field on the left to update live</span>
        </div>
      )}

      {/* HEADER */}
      <div className="pb-5 mb-6 border-b-2 border-neutral-900 flex items-start justify-between gap-5">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
              {data.fullName}
            </h1>
            {visibility.sutraNetBadge && data.kagazId && (
              <a
                href={`/p/${data.kagazId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono rounded-xs hover:bg-neutral-800 transition-colors"
              >
                {data.isVerified && (
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                )}
                <span>ID: {data.kagazId}</span>
              </a>
            )}
          </div>

          {data.title && (
            <p className="text-sm font-semibold text-neutral-700">
              {data.title}
            </p>
          )}

          {hasContact && (
            <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600">
              {data.phone && <span>{data.phone}</span>}
              {data.phone && data.email && <span>•</span>}
              {data.email && <span>{data.email}</span>}
              {(data.phone || data.email) && data.location && <span>•</span>}
              {data.location && <span>{data.location}</span>}
            </div>
          )}

          {visibility.socialLinks && data.socialLinks.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-neutral-700">
              {data.socialLinks.map((link) => (
                <span key={link.id}>
                  <strong>{link.platform}:</strong>{" "}
                  {link.url.replace(/^https?:\/\//, "")}
                </span>
              ))}
            </div>
          )}
        </div>

        {visibility.photo && data.avatarUrl && (
          <div className="h-22 w-22 rounded-md border border-neutral-300 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.avatarUrl}
              alt={data.fullName || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* OBJECTIVE & SUMMARY */}
      {visibility.objective && data.objective.trim() && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Career Objective</h2>
          <p className="text-xs sm:text-[13px] text-neutral-800 leading-relaxed whitespace-pre-line">
            {data.objective}
          </p>
        </section>
      )}

      {visibility.summary && data.summary.trim() && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Professional Summary</h2>
          <p className="text-xs sm:text-[13px] text-neutral-800 leading-relaxed whitespace-pre-line">
            {data.summary}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {visibility.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Work Experience</h2>
          <div className="space-y-3.5">
            {data.experience.map((exp) => (
              <div
                key={exp.id}
                className="pl-3 border-l border-neutral-300 space-y-1"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-neutral-950">
                    {exp.designation || exp.company}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-600">
                    {exp.startDate}
                    {(exp.startDate || exp.isCurrent) && " — "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-700">
                  {exp.company}
                  {exp.employmentType ? ` (${exp.employmentType})` : ""}
                </p>
                {exp.responsibilities && (
                  <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line pt-0.5">
                    {exp.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {visibility.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Key Projects</h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="pl-3 border-l border-neutral-300 space-y-1"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-neutral-950">
                    {proj.title}
                  </h3>
                  {proj.projectUrl && (
                    <span className="text-[11px] font-mono text-neutral-600">
                      {proj.projectUrl.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] font-mono text-neutral-600">
                    Tech: {proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {visibility.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Education</h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="flex flex-wrap items-baseline justify-between gap-2 pl-3 border-l border-neutral-300"
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-950">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-neutral-700">
                    {edu.institution}
                    {edu.university ? ` — ${edu.university}` : ""}
                    {edu.grade ? ` • Grade: ${edu.grade}` : ""}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-neutral-600">
                  {edu.startYear}
                  {edu.startYear ? " - " : ""}
                  {edu.endYear || "Present"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS, LANGUAGES & HOBBIES */}
      {((visibility.skills && data.skills.length > 0) ||
        (visibility.languages && data.languages.length > 0) ||
        (visibility.hobbies && data.hobbies.length > 0)) && (
        <section className="mb-6 space-y-3">
          {visibility.skills && data.skills.length > 0 && (
            <div>
              <h2 className={sectionTitleClass}>Core Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="text-xs px-2.5 py-0.5 rounded-xs bg-neutral-100 border border-neutral-300 text-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibility.languages && data.languages.length > 0 && (
            <div>
              <h2 className={sectionTitleClass}>Languages</h2>
              <p className="text-xs text-neutral-800">
                {data.languages.join(", ")}
              </p>
            </div>
          )}

          {visibility.hobbies && data.hobbies.length > 0 && (
            <div>
              <h2 className={sectionTitleClass}>
                Extracurricular Activities &amp; Hobbies
              </h2>
              <p className="text-xs text-neutral-800">
                {data.hobbies.join("  •  ")}
              </p>
            </div>
          )}
        </section>
      )}

      {/* EXTRA SECTIONS */}
      {visibility.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Certifications</h2>
          <div className="space-y-1.5">
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-baseline justify-between text-xs"
              >
                <span>
                  <strong className="text-neutral-900">{cert.title}</strong>
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                </span>
                {cert.date && (
                  <span className="text-[11px] font-mono text-neutral-500">
                    {cert.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.achievements && data.achievements.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Achievements &amp; Awards</h2>
          <div className="space-y-1.5">
            {data.achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-baseline justify-between text-xs"
              >
                <span>
                  <strong className="text-neutral-900">{ach.title}</strong>
                  {ach.issuer ? ` — ${ach.issuer}` : ""}
                </span>
                {ach.date && (
                  <span className="text-[11px] font-mono text-neutral-500">
                    {ach.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.volunteer && data.volunteer.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>
            Volunteer Experience &amp; Leadership
          </h2>
          <div className="space-y-2.5">
            {data.volunteer.map((vol) => (
              <div key={vol.id} className="space-y-0.5 text-xs">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-neutral-950">
                    {vol.role}
                    {vol.organization ? ` — ${vol.organization}` : ""}
                  </span>
                  {vol.duration && (
                    <span className="text-[11px] font-mono text-neutral-500">
                      {vol.duration}
                    </span>
                  )}
                </div>
                {vol.description && (
                  <p className="text-neutral-700 leading-relaxed">
                    {vol.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.publications && data.publications.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Publications &amp; Research</h2>
          <div className="space-y-2 text-xs">
            {data.publications.map((pub) => (
              <div
                key={pub.id}
                className="flex items-baseline justify-between gap-2"
              >
                <div>
                  <strong className="text-neutral-950">{pub.title}</strong>
                  {pub.publisher && (
                    <span className="text-neutral-700"> — {pub.publisher}</span>
                  )}
                  {pub.url && (
                    <span className="block text-[11px] font-mono text-neutral-500">
                      {pub.url.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
                {pub.year && (
                  <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                    {pub.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.customSection && data.customSectionContent.trim() && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>
            {data.customSectionTitle || "Additional Information"}
          </h2>
          <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
            {data.customSectionContent}
          </p>
        </section>
      )}

      {visibility.references && data.references.length > 0 && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>References</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5">
                <p className="font-bold text-neutral-950">{ref.name}</p>
                {ref.designation && (
                  <p className="text-neutral-700">{ref.designation}</p>
                )}
                {ref.contact && (
                  <p className="text-[11px] font-mono text-neutral-600">
                    {ref.contact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.personalDetails && hasPersonal && (
        <section className="mb-6">
          <h2 className={sectionTitleClass}>Personal Details</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {data.personalDetails.dob && (
              <p>
                <span className="text-neutral-500">Date of Birth:</span>{" "}
                <strong className="text-neutral-900">
                  {data.personalDetails.dob}
                </strong>
              </p>
            )}
            {data.personalDetails.gender && (
              <p>
                <span className="text-neutral-500">Gender:</span>{" "}
                <strong className="text-neutral-900">
                  {data.personalDetails.gender}
                </strong>
              </p>
            )}
            {data.personalDetails.nationality && (
              <p>
                <span className="text-neutral-500">Nationality:</span>{" "}
                <strong className="text-neutral-900">
                  {data.personalDetails.nationality}
                </strong>
              </p>
            )}
            {data.personalDetails.noticePeriod && (
              <p>
                <span className="text-neutral-500">Notice Period:</span>{" "}
                <strong className="text-neutral-900">
                  {data.personalDetails.noticePeriod}
                </strong>
              </p>
            )}
          </div>
        </section>
      )}

      <style jsx>{`
        #cv-printable-area::after {
          content: "${visibility.declaration && data.declarationText.trim()
            ? `Declaration: ${data.declarationText.replace(/"/g, '\\"').replace(/\n/g, " ")}\\A`
            : ""}Generated via SutraNet ${data.kagazId
            ? `• ID: ${data.kagazId}  |  Verify at sutranet.in/p/${data.kagazId}`
            : "• Connected Digital Identity Network"}";
          display: block;
          white-space: pre-line;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #e5e5e5;
          font-family: monospace;
          font-size: 9.5px;
          line-height: 1.55;
          color: #737373;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
