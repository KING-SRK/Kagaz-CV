// app/create-cv/components/CvPreview.tsx
"use client";

import { ShieldCheck } from "lucide-react";
import { CvData, CvTemplateType } from "../types";

interface Props {
  data: CvData;
  template: CvTemplateType;
}

export default function CvPreview({ data, template }: Props) {
  const { visibility } = data;

  const fontClass =
    template === "classic"
      ? "font-serif"
      : template === "mono"
        ? "font-mono"
        : "font-sans";

  const hasHeaderContact =
    data.email ||
    data.phone ||
    data.location ||
    (visibility.socialLinks && data.socialLinks.length > 0);

  const hasPersonalDetails =
    data.personalDetails.dob ||
    data.personalDetails.gender ||
    data.personalDetails.nationality ||
    data.personalDetails.noticePeriod;

  return (
    <div
      id="cv-printable-area"
      className={`bg-white text-neutral-900 w-full min-h-[297mm] shadow-lg border border-neutral-300 p-6 sm:p-10 lg:p-12 print:w-full print:max-w-none print:min-h-0 print:shadow-none print:border-none print:p-0 ${fontClass}`}
    >
      {/* ১. HEADER SECTION */}
      <header
        className={`pb-5 mb-6 ${
          template === "classic"
            ? "border-b-2 border-neutral-900"
            : template === "mono"
              ? "border-b border-dashed border-neutral-500"
              : "border-b border-neutral-300"
        }`}
      >
        <div className="flex items-start justify-between gap-5">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
                {data.fullName || "Your Full Name"}
              </h1>

              {visibility.sutraNetBadge && data.kagazId && (
                <a
                  href={`/p/${data.kagazId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-[10px] font-mono text-neutral-800 rounded-xs hover:bg-neutral-200 transition-colors"
                >
                  {data.isVerified && (
                    <ShieldCheck className="h-3 w-3 text-emerald-700" />
                  )}
                  <span>SutraNet ID: {data.kagazId}</span>
                </a>
              )}
            </div>

            {data.title && (
              <p className="text-base font-medium text-neutral-700">
                {data.title}
              </p>
            )}

            {hasHeaderContact && (
              <div className="pt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-sans text-neutral-600">
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
            <div className="h-22 w-22 rounded-xs border border-neutral-300 overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.avatarUrl}
                alt={data.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </header>

      {/* ২. CAREER OBJECTIVE */}
      {visibility.objective && data.objective.trim() && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
            Career Objective
          </h2>
          <p className="text-xs sm:text-[13px] font-sans text-neutral-800 leading-relaxed whitespace-pre-line">
            {data.objective}
          </p>
        </section>
      )}

      {/* ৩. PROFESSIONAL SUMMARY */}
      {visibility.summary && data.summary.trim() && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs sm:text-[13px] font-sans text-neutral-800 leading-relaxed whitespace-pre-line">
            {data.summary}
          </p>
        </section>
      )}

      {/* ৪. WORK EXPERIENCE */}
      {visibility.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
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
                <p className="text-xs font-sans font-semibold text-neutral-700">
                  {exp.company}
                  {exp.employmentType ? ` (${exp.employmentType})` : ""}
                </p>
                {exp.responsibilities && (
                  <p className="text-xs font-sans text-neutral-700 leading-relaxed whitespace-pre-line pt-0.5">
                    {exp.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ৫. KEY PROJECTS */}
      {visibility.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-3">
            Key Projects
          </h2>
          <div className="space-y-3.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
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
                  <p className="text-xs font-sans text-neutral-700 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ৬. EDUCATION */}
      {visibility.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="flex flex-wrap items-baseline justify-between gap-2"
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-950">
                    {edu.degree}
                  </h3>
                  <p className="text-xs font-sans text-neutral-700">
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

      {/* ৭. SKILLS, LANGUAGES & HOBBIES */}
      {((visibility.skills && data.skills.length > 0) ||
        (visibility.languages && data.languages.length > 0) ||
        (visibility.hobbies && data.hobbies.length > 0)) && (
        <section className="mb-6 space-y-3">
          {visibility.skills && data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                Core Skills
              </h2>
              <p className="text-xs font-sans text-neutral-800 leading-relaxed">
                {data.skills.join("  •  ")}
              </p>
            </div>
          )}

          {visibility.languages && data.languages.length > 0 && (
            <div className="pt-1">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                Languages
              </h2>
              <p className="text-xs font-sans text-neutral-800">
                {data.languages.join(", ")}
              </p>
            </div>
          )}

          {visibility.hobbies && data.hobbies.length > 0 && (
            <div className="pt-1">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                Extracurricular Activities &amp; Hobbies
              </h2>
              <p className="text-xs font-sans text-neutral-800">
                {data.hobbies.join("  •  ")}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ৮. CERTIFICATIONS */}
      {visibility.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
            Certifications
          </h2>
          <div className="space-y-1.5">
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-baseline justify-between text-xs font-sans"
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

      {/* ৯. ACHIEVEMENTS & AWARDS */}
      {visibility.achievements && data.achievements.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
            Achievements &amp; Awards
          </h2>
          <div className="space-y-1.5">
            {data.achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-baseline justify-between text-xs font-sans"
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

      {/* ১০. VOLUNTEER & LEADERSHIP */}
      {visibility.volunteer && data.volunteer.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
            Volunteer Experience &amp; Leadership
          </h2>
          <div className="space-y-3">
            {data.volunteer.map((vol) => (
              <div key={vol.id} className="space-y-0.5 text-xs font-sans">
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

      {/* ১১. PUBLICATIONS & RESEARCH */}
      {visibility.publications && data.publications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
            Publications &amp; Research
          </h2>
          <div className="space-y-2 text-xs font-sans">
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

      {/* ১২. CUSTOM SECTION */}
      {visibility.customSection && data.customSectionContent.trim() && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
            {data.customSectionTitle || "Additional Information"}
          </h2>
          <p className="text-xs font-sans text-neutral-800 leading-relaxed whitespace-pre-line">
            {data.customSectionContent}
          </p>
        </section>
      )}

      {/* ১৩. REFERENCES */}
      {visibility.references && data.references.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
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

      {/* ১৪. PERSONAL DETAILS */}
      {visibility.personalDetails && hasPersonalDetails && (
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
            Personal Details
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-sans">
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

      {/* ১৫. DECLARATION */}
      {visibility.declaration && data.declarationText.trim() && (
        <section className="pt-3 border-t border-neutral-200 mt-6">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-900 mb-1.5">
            Declaration
          </h2>
          <p className="text-xs font-sans text-neutral-700 leading-relaxed mb-5">
            {data.declarationText}
          </p>
          <div className="flex items-end justify-between text-xs font-mono text-neutral-800 pt-2">
            <span>Place: {data.location || "India"}</span>
            <span className="border-t border-neutral-400 pt-1 px-3">
              {data.fullName || "Signature"}
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
