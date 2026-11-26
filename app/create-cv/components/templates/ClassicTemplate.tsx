// app/create-cv/components/templates/ClassicTemplate.tsx
"use client";

import { ShieldCheck } from "lucide-react";
import { CvData } from "../../types";
import { getResolvedCvData } from "../CvPreview";

interface Props {
  rawData: CvData;
}

export default function ClassicTemplate({ rawData }: Props) {
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

  // এটিই ঠিক করে দেবে: একদম খালি থাকলে স্যাম্পল দেখাবে, আর লেখা শুরু করলে ফাঁকা সেকশনগুলো দেখাবে না
  const data: CvData = getResolvedCvData(rawData);

  const { visibility } = data;
  const hasContact = Boolean(data.email || data.phone || data.location);
  const hasPersonal = Boolean(
    data.personalDetails.dob ||
    data.personalDetails.gender ||
    data.personalDetails.nationality ||
    data.personalDetails.noticePeriod,
  );

  const sideHeadingClass =
    "text-[10.5px] font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2";
  const mainHeadingClass =
    "text-xs font-mono font-bold uppercase tracking-widest text-neutral-950 border-b-2 border-neutral-800 pb-1 mb-2.5";

  return (
    <div
      id="cv-printable-area"
      className="relative bg-white text-neutral-900 font-sans w-full min-h-[297mm] shadow-lg border border-neutral-300 flex flex-col print:w-full print:max-w-none print:min-h-[270mm] print:shadow-none print:border-none"
    >
      {!hasAnyInput && (
        <div className="m-4 mb-0 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono uppercase tracking-wider flex items-center justify-between rounded-xs print:hidden">
          <span>Two-Column Style Preview</span>
          <span>Type in any field on the left to update live</span>
        </div>
      )}

      {/* TWO-COLUMN SPLIT BODY */}
      <div className="grid grid-cols-12 flex-1 min-w-0">
        {/* LEFT SIDEBAR COLUMN */}
        <div className="col-span-4 min-w-0 bg-neutral-100 border-r border-neutral-200 p-4 sm:p-5 space-y-4">
          {visibility.photo && data.avatarUrl && (
            <div className="mx-auto h-22 w-22 rounded-md border border-neutral-300 overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.avatarUrl}
                alt={data.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {visibility.sutraNetBadge && data.kagazId && (
            <div>
              <a
                href={`/p/${data.kagazId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-900 text-white text-[10px] font-mono rounded-xs hover:bg-neutral-800 transition-colors"
              >
                {data.isVerified && (
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                )}
                <span>ID: {data.kagazId}</span>
              </a>
            </div>
          )}

          {hasContact && (
            <div>
              <h2 className={sideHeadingClass}>Contact</h2>
              <div className="space-y-1 text-[11px] text-neutral-700 wrap-break-word">
                {data.phone && <p>{data.phone}</p>}
                {data.email && <p>{data.email}</p>}
                {data.location && <p>{data.location}</p>}
              </div>
            </div>
          )}

          {visibility.socialLinks && data.socialLinks.length > 0 && (
            <div>
              <h2 className={sideHeadingClass}>Links</h2>
              <div className="space-y-1 text-[10.5px] font-mono text-neutral-700 wrap-break-word">
                {data.socialLinks.map((link) => (
                  <p key={link.id}>
                    <strong>{link.platform}:</strong>{" "}
                    {link.url.replace(/^https?:\/\//, "")}
                  </p>
                ))}
              </div>
            </div>
          )}

          {visibility.skills && data.skills.length > 0 && (
            <div>
              <h2 className={sideHeadingClass}>Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="text-[10.5px] px-2 py-0.5 bg-white border border-neutral-300 text-neutral-800 rounded-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibility.languages && data.languages.length > 0 && (
            <div>
              <h2 className={sideHeadingClass}>Languages</h2>
              <p className="text-[11px] text-neutral-800 leading-relaxed wrap-break-word">
                {data.languages.join(", ")}
              </p>
            </div>
          )}

          {visibility.hobbies && data.hobbies.length > 0 && (
            <div>
              <h2 className={sideHeadingClass}>Hobbies</h2>
              <p className="text-[11px] text-neutral-800 leading-relaxed wrap-break-word">
                {data.hobbies.join(", ")}
              </p>
            </div>
          )}

          {visibility.personalDetails && hasPersonal && (
            <div>
              <h2 className={sideHeadingClass}>Personal Details</h2>
              <div className="space-y-1 text-[11px] text-neutral-800 wrap-break-word">
                {data.personalDetails.dob && (
                  <p>
                    <span className="text-neutral-500">DOB:</span>{" "}
                    <strong>{data.personalDetails.dob}</strong>
                  </p>
                )}
                {data.personalDetails.gender && (
                  <p>
                    <span className="text-neutral-500">Gender:</span>{" "}
                    <strong>{data.personalDetails.gender}</strong>
                  </p>
                )}
                {data.personalDetails.nationality && (
                  <p>
                    <span className="text-neutral-500">Nationality:</span>{" "}
                    <strong>{data.personalDetails.nationality}</strong>
                  </p>
                )}
                {data.personalDetails.noticePeriod && (
                  <p>
                    <span className="text-neutral-500">Notice:</span>{" "}
                    <strong>{data.personalDetails.noticePeriod}</strong>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT MAIN COLUMN */}
        <div className="col-span-8 min-w-0 p-5 sm:p-7 flex flex-col space-y-5">
          {/* NAME & ROLE BLOCK */}
          <div className="pb-4 border-b border-neutral-200">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 wrap-break-word">
              {data.fullName}
            </h1>
            {data.title && (
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 mt-1 wrap-break-word">
                {data.title}
              </p>
            )}
          </div>

          {visibility.objective && data.objective.trim() && (
            <section>
              <h2 className={mainHeadingClass}>Career Objective</h2>
              <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
                {data.objective}
              </p>
            </section>
          )}

          {visibility.summary && data.summary.trim() && (
            <section>
              <h2 className={mainHeadingClass}>Summary</h2>
              <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
                {data.summary}
              </p>
            </section>
          )}

          {visibility.experience && data.experience.length > 0 && (
            <section>
              <h2 className={mainHeadingClass}>Work Experience</h2>
              <div className="space-y-3">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-950">
                        {exp.designation || exp.company}
                      </h3>
                      <span className="text-[10.5px] font-mono text-neutral-500">
                        {exp.startDate}
                        {(exp.startDate || exp.isCurrent) && " — "}
                        {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-neutral-700">
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

          {visibility.projects && data.projects.length > 0 && (
            <section>
              <h2 className={mainHeadingClass}>Projects</h2>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="space-y-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-950">
                        {proj.title}
                      </h3>
                      {proj.projectUrl && (
                        <span className="text-[10.5px] font-mono text-neutral-500">
                          {proj.projectUrl.replace(/^https?:\/\//, "")}
                        </span>
                      )}
                    </div>
                    {proj.technologies && (
                      <p className="text-[10.5px] font-mono text-neutral-600">
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

          {visibility.education && data.education.length > 0 && (
            <section>
              <h2 className={mainHeadingClass}>Education</h2>
              <div className="space-y-2">
                {data.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex flex-wrap items-baseline justify-between gap-2"
                  >
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-950">
                        {edu.degree}
                      </h3>
                      <p className="text-[11px] text-neutral-700">
                        {edu.institution}
                        {edu.university ? ` — ${edu.university}` : ""}
                        {edu.grade ? ` • ${edu.grade}` : ""}
                      </p>
                    </div>
                    <span className="text-[10.5px] font-mono text-neutral-500">
                      {edu.startYear}
                      {edu.startYear ? " - " : ""}
                      {edu.endYear || "Present"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className={mainHeadingClass}>Certifications</h2>
              <div className="space-y-1 text-xs">
                {data.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <span>
                      <strong className="text-neutral-900">{cert.title}</strong>
                      {cert.issuer ? ` — ${cert.issuer}` : ""}
                    </span>
                    {cert.date && (
                      <span className="text-[10.5px] font-mono text-neutral-500">
                        {cert.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.achievements && data.achievements.length > 0 && (
            <section>
              <h2 className={mainHeadingClass}>Achievements</h2>
              <div className="space-y-1 text-xs">
                {data.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <span>
                      <strong className="text-neutral-900">{ach.title}</strong>
                      {ach.issuer ? ` — ${ach.issuer}` : ""}
                    </span>
                    {ach.date && (
                      <span className="text-[10.5px] font-mono text-neutral-500">
                        {ach.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.volunteer && data.volunteer.length > 0 && (
            <section>
              <h2 className={mainHeadingClass}>Volunteer &amp; Leadership</h2>
              <div className="space-y-2 text-xs">
                {data.volunteer.map((vol) => (
                  <div key={vol.id} className="space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-neutral-950">
                        {vol.role}
                        {vol.organization ? ` — ${vol.organization}` : ""}
                      </span>
                      {vol.duration && (
                        <span className="text-[10.5px] font-mono text-neutral-500">
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
            <section>
              <h2 className={mainHeadingClass}>Publications</h2>
              <div className="space-y-1.5 text-xs">
                {data.publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <div>
                      <strong className="text-neutral-950">{pub.title}</strong>
                      {pub.publisher && (
                        <span className="text-neutral-700">
                          {" "}
                          — {pub.publisher}
                        </span>
                      )}
                      {pub.url && (
                        <span className="block text-[10.5px] font-mono text-neutral-500">
                          {pub.url.replace(/^https?:\/\//, "")}
                        </span>
                      )}
                    </div>
                    {pub.year && (
                      <span className="text-[10.5px] font-mono text-neutral-500 shrink-0">
                        {pub.year}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibility.customSection && data.customSectionContent.trim() && (
            <section>
              <h2 className={mainHeadingClass}>
                {data.customSectionTitle || "Additional Information"}
              </h2>
              <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
                {data.customSectionContent}
              </p>
            </section>
          )}

          {visibility.references && data.references.length > 0 && (
            <section>
              <h2 className={mainHeadingClass}>References</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {data.references.map((ref) => (
                  <div key={ref.id} className="space-y-0.5">
                    <p className="font-bold text-neutral-950">{ref.name}</p>
                    {ref.designation && (
                      <p className="text-neutral-700">{ref.designation}</p>
                    )}
                    {ref.contact && (
                      <p className="text-[10.5px] font-mono text-neutral-600">
                        {ref.contact}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

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
