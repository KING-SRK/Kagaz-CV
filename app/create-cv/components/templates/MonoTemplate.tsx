// app/create-cv/components/templates/MonoTemplate.tsx
"use client";

import { ShieldCheck } from "lucide-react";
import { CvData } from "../../types";

interface Props {
  rawData: CvData;
}

const SAMPLE_DATA: CvData = {
  ...({} as CvData),
  fullName: "Your Full Name",
  title: "Your Role / Target Position",
  email: "your.email@example.com",
  phone: "+91 00000 00000",
  location: "City, State",
  kagazId: "SN-00000-00000",
  isVerified: true,
  avatarUrl:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f5f5f5'/><circle cx='50' cy='38' r='16' fill='%23d4d4d4'/><path d='M22 86c0-15.5 12.5-26 28-26s28 10.5 28 26' fill='%23d4d4d4'/></svg>",
  socialLinks: [
    { id: "s1", platform: "Portfolio", url: "https://example.com" },
    { id: "s2", platform: "GitHub", url: "https://github.com/username" },
  ],
  objective:
    "Write a short objective about the role you are aiming for and what you can contribute.",
  summary:
    "Write a brief summary of your experience, core skills, and key highlights.",
  experience: [
    {
      id: "e1",
      designation: "Role / Job Title",
      company: "Company / Organization",
      employmentType: "Full-time",
      startDate: "Start",
      endDate: "",
      isCurrent: true,
      responsibilities:
        "• Main responsibility or task you handled.\n• Key result or improvement you delivered.",
    },
  ],
  projects: [
    {
      id: "p1",
      title: "Sample Project Title",
      projectUrl: "https://example.com/project",
      technologies: "Tech A, Tech B, Tech C",
      description: "Short note on what this project builds and why it matters.",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "Degree / Course Title",
      institution: "Institution / College Name",
      university: "Board / University",
      startYear: "Start",
      endYear: "End",
      grade: "Grade / Score",
    },
  ],
  skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  languages: ["Language 1", "Language 2"],
  hobbies: ["Hobby 1", "Hobby 2"],
  certifications: [
    { id: "c1", title: "Certificate Name", issuer: "Issuer", date: "Year" },
  ],
  achievements: [],
  volunteer: [],
  publications: [],
  customSectionTitle: "",
  customSectionContent: "",
  references: [],
  personalDetails: { dob: "", gender: "", nationality: "", noticePeriod: "" },
  declarationText:
    "I hereby declare that the above information is true and accurate to the best of my knowledge.",
  visibility: {
    photo: true,
    sutraNetBadge: true,
    socialLinks: true,
    objective: true,
    summary: true,
    experience: true,
    projects: true,
    education: true,
    skills: true,
    languages: true,
    hobbies: false,
    certifications: true,
    achievements: false,
    volunteer: false,
    publications: false,
    customSection: false,
    references: false,
    personalDetails: false,
    declaration: true,
  },
};

export default function MonoTemplate({ rawData }: Props) {
  const hasAnyInput =
    Boolean(rawData.avatarUrl) ||
    Boolean(rawData.fullName.trim()) ||
    Boolean(rawData.title.trim()) ||
    Boolean(rawData.email.trim()) ||
    Boolean(rawData.phone.trim()) ||
    Boolean(rawData.location.trim()) ||
    Boolean(rawData.objective.trim()) ||
    Boolean(rawData.summary.trim()) ||
    rawData.socialLinks.length > 0 ||
    rawData.experience.length > 0 ||
    rawData.projects.length > 0 ||
    rawData.education.length > 0 ||
    rawData.skills.length > 0 ||
    rawData.languages.length > 0 ||
    rawData.hobbies.length > 0 ||
    rawData.certifications.length > 0 ||
    rawData.achievements.length > 0 ||
    rawData.volunteer.length > 0 ||
    rawData.publications.length > 0 ||
    Boolean(rawData.customSectionContent.trim()) ||
    rawData.references.length > 0 ||
    Boolean(
      rawData.personalDetails.dob ||
      rawData.personalDetails.gender ||
      rawData.personalDetails.nationality ||
      rawData.personalDetails.noticePeriod,
    );

  const data: CvData = {
    ...SAMPLE_DATA,
    ...rawData,
    fullName: rawData.fullName.trim() ? rawData.fullName : SAMPLE_DATA.fullName,
    title: rawData.title.trim() ? rawData.title : SAMPLE_DATA.title,
    email: rawData.email.trim() ? rawData.email : SAMPLE_DATA.email,
    phone: rawData.phone.trim() ? rawData.phone : SAMPLE_DATA.phone,
    location: rawData.location.trim() ? rawData.location : SAMPLE_DATA.location,
    kagazId: rawData.kagazId || SAMPLE_DATA.kagazId,
    isVerified:
      typeof rawData.isVerified === "boolean"
        ? rawData.isVerified
        : SAMPLE_DATA.isVerified,
    avatarUrl: rawData.avatarUrl || SAMPLE_DATA.avatarUrl,
    socialLinks:
      rawData.socialLinks.length > 0
        ? rawData.socialLinks
        : SAMPLE_DATA.socialLinks,
    objective: rawData.objective.trim()
      ? rawData.objective
      : SAMPLE_DATA.objective,
    summary: rawData.summary.trim() ? rawData.summary : SAMPLE_DATA.summary,
    experience:
      rawData.experience.length > 0
        ? rawData.experience
        : SAMPLE_DATA.experience,
    projects:
      rawData.projects.length > 0 ? rawData.projects : SAMPLE_DATA.projects,
    education:
      rawData.education.length > 0 ? rawData.education : SAMPLE_DATA.education,
    skills: rawData.skills.length > 0 ? rawData.skills : SAMPLE_DATA.skills,
    languages:
      rawData.languages.length > 0 ? rawData.languages : SAMPLE_DATA.languages,
    hobbies: rawData.hobbies.length > 0 ? rawData.hobbies : SAMPLE_DATA.hobbies,
    certifications:
      rawData.certifications.length > 0
        ? rawData.certifications
        : SAMPLE_DATA.certifications,
    declarationText: rawData.declarationText.trim()
      ? rawData.declarationText
      : SAMPLE_DATA.declarationText,
    personalDetails: {
      ...SAMPLE_DATA.personalDetails,
      ...rawData.personalDetails,
    },
    visibility: {
      ...SAMPLE_DATA.visibility,
      ...(rawData.visibility || {}),
    },
  };

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

  const headingClass =
    "text-[10.5px] font-mono font-bold uppercase tracking-widest text-neutral-900 border-b border-dashed border-neutral-400 pb-0.5 mb-2";
  const boxClass =
    "p-2 bg-white border border-dashed border-neutral-300 rounded-xs space-y-0.5";

  return (
    <div
      id="cv-printable-area"
      className="relative bg-neutral-50/60 text-neutral-900 font-mono w-full min-h-[297mm] shadow-lg border border-neutral-300 p-5 sm:p-7 lg:p-8 flex flex-col print:w-full print:max-w-none print:min-h-[270mm] print:shadow-none print:border-none print:p-0"
    >
      {!hasAnyInput && (
        <div className="mb-3 px-2.5 py-1 bg-amber-50 border border-dashed border-amber-300 text-amber-800 text-[10px] font-mono uppercase tracking-wider flex items-center justify-between print:hidden">
          <span>Mono Template Preview</span>
          <span>Type in any field on the left to update live</span>
        </div>
      )}

      {/* TOP PROFILE BLOCK (DIV) */}
      <div className="p-3 mb-3.5 bg-white border border-dashed border-neutral-400 rounded-xs flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-950">
              {data.fullName}
            </h1>
            {visibility.sutraNetBadge && data.kagazId && (
              <a
                href={`/p/${data.kagazId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-neutral-100 border border-dashed border-neutral-500 text-[9.5px] text-neutral-900 hover:bg-neutral-200 transition-colors"
              >
                {data.isVerified && (
                  <ShieldCheck className="h-3 w-3 text-emerald-700" />
                )}
                <span>ID: {data.kagazId}</span>
              </a>
            )}
          </div>

          {data.title && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
              {data.title}
            </p>
          )}

          {hasContact && (
            <div className="pt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10.5px] text-neutral-700">
              {data.phone && <span>{data.phone}</span>}
              {data.phone && data.email && <span>||</span>}
              {data.email && <span>{data.email}</span>}
              {(data.phone || data.email) && data.location && <span>||</span>}
              {data.location && <span>{data.location}</span>}
            </div>
          )}

          {visibility.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-neutral-700">
              {data.socialLinks.map((link) => (
                <span key={link.id}>
                  [{link.platform}] {link.url.replace(/^https?:\/\//, "")}
                </span>
              ))}
            </div>
          )}
        </div>

        {visibility.photo && data.avatarUrl && (
          <div
            className={`h-16 w-16 border border-dashed border-neutral-500 overflow-hidden shrink-0 bg-neutral-100 ${
              !rawData.avatarUrl ? "print:hidden" : ""
            }`}
          >
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
        <section className="mb-3.5">
          <h2 className={headingClass}>Objective</h2>
          <p className="text-[11px] text-neutral-800 leading-snug whitespace-pre-line">
            {data.objective}
          </p>
        </section>
      )}

      {visibility.summary && data.summary.trim() && (
        <section className="mb-3.5">
          <h2 className={headingClass}>Summary</h2>
          <p className="text-[11px] text-neutral-800 leading-snug whitespace-pre-line">
            {data.summary}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {visibility.experience && data.experience.length > 0 && (
        <section className="mb-3.5">
          <h2 className={headingClass}>Experience</h2>
          <div className="space-y-2">
            {data.experience.map((exp) => (
              <div key={exp.id} className={boxClass}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xs font-bold text-neutral-950">
                    {exp.designation || exp.company}
                  </h3>
                  <span className="text-[10px] text-neutral-600">
                    {exp.startDate}
                    {(exp.startDate || exp.isCurrent) && " -> "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-[10.5px] text-neutral-700">
                  {exp.company}
                  {exp.employmentType ? ` (${exp.employmentType})` : ""}
                </p>
                {exp.responsibilities && (
                  <p className="text-[10.5px] text-neutral-700 leading-snug whitespace-pre-line pt-0.5">
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
        <section className="mb-3.5">
          <h2 className={headingClass}>Projects</h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className={boxClass}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xs font-bold text-neutral-950">
                    {proj.title}
                  </h3>
                  {proj.projectUrl && (
                    <span className="text-[10px] text-neutral-600">
                      {proj.projectUrl.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[10px] text-neutral-600">
                    Stack: {proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="text-[10.5px] text-neutral-700 leading-snug">
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
        <section className="mb-3.5">
          <h2 className={headingClass}>Education</h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className={`${boxClass} flex flex-wrap items-baseline justify-between gap-2`}
              >
                <div>
                  <h3 className="text-xs font-bold text-neutral-950">
                    {edu.degree}
                  </h3>
                  <p className="text-[10.5px] text-neutral-700">
                    {edu.institution}
                    {edu.university ? ` — ${edu.university}` : ""}
                    {edu.grade ? ` • ${edu.grade}` : ""}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-600">
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
        <section className="mb-3.5 space-y-2.5">
          {visibility.skills && data.skills.length > 0 && (
            <div>
              <h2 className={headingClass}>Skills</h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="text-[10px] px-1.5 py-0.5 bg-white border border-dashed border-neutral-400 text-neutral-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {visibility.languages && data.languages.length > 0 && (
            <div>
              <h2 className={headingClass}>Languages</h2>
              <p className="text-[11px] text-neutral-800">
                {data.languages.join(" | ")}
              </p>
            </div>
          )}

          {visibility.hobbies && data.hobbies.length > 0 && (
            <div>
              <h2 className={headingClass}>Hobbies &amp; Activities</h2>
              <p className="text-[11px] text-neutral-800">
                {data.hobbies.join(" | ")}
              </p>
            </div>
          )}
        </section>
      )}

      {/* EXTRA SECTIONS */}
      {visibility.certifications && data.certifications.length > 0 && (
        <section className="mb-3.5">
          <h2 className={headingClass}>Certifications</h2>
          <div className="space-y-1 text-[11px]">
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-baseline justify-between gap-2"
              >
                <span>
                  <strong>{cert.title}</strong>
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                </span>
                {cert.date && (
                  <span className="text-[10px] text-neutral-600">
                    {cert.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.achievements && data.achievements.length > 0 && (
        <section className="mb-3.5">
          <h2 className={headingClass}>Achievements</h2>
          <div className="space-y-1 text-[11px]">
            {data.achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-baseline justify-between gap-2"
              >
                <span>
                  <strong>{ach.title}</strong>
                  {ach.issuer ? ` — ${ach.issuer}` : ""}
                </span>
                {ach.date && (
                  <span className="text-[10px] text-neutral-600">
                    {ach.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.volunteer && data.volunteer.length > 0 && (
        <section className="mb-3.5">
          <h2 className={headingClass}>Volunteer &amp; Leadership</h2>
          <div className="space-y-1.5 text-[11px]">
            {data.volunteer.map((vol) => (
              <div key={vol.id} className="space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold">
                    {vol.role}
                    {vol.organization ? ` — ${vol.organization}` : ""}
                  </span>
                  {vol.duration && (
                    <span className="text-[10px] text-neutral-600">
                      {vol.duration}
                    </span>
                  )}
                </div>
                {vol.description && (
                  <p className="text-[10.5px] text-neutral-700 leading-snug">
                    {vol.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.publications && data.publications.length > 0 && (
        <section className="mb-3.5">
          <h2 className={headingClass}>Publications</h2>
          <div className="space-y-1.5 text-[11px]">
            {data.publications.map((pub) => (
              <div
                key={pub.id}
                className="flex items-baseline justify-between gap-2"
              >
                <div>
                  <strong>{pub.title}</strong>
                  {pub.publisher && <span> — {pub.publisher}</span>}
                  {pub.url && (
                    <span className="block text-[10px] text-neutral-600">
                      {pub.url.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
                {pub.year && (
                  <span className="text-[10px] text-neutral-600 shrink-0">
                    {pub.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.customSection && data.customSectionContent.trim() && (
        <section className="mb-3.5">
          <h2 className={headingClass}>
            {data.customSectionTitle || "Additional Information"}
          </h2>
          <p className="text-[11px] text-neutral-800 leading-snug whitespace-pre-line">
            {data.customSectionContent}
          </p>
        </section>
      )}

      {visibility.references && data.references.length > 0 && (
        <section className="mb-3.5">
          <h2 className={headingClass}>References</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {data.references.map((ref) => (
              <div key={ref.id} className={boxClass}>
                <p className="font-bold">{ref.name}</p>
                {ref.designation && (
                  <p className="text-[10.5px] text-neutral-700">
                    {ref.designation}
                  </p>
                )}
                {ref.contact && (
                  <p className="text-[10px] text-neutral-600">{ref.contact}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibility.personalDetails && hasPersonal && (
        <section className="mb-3.5">
          <h2 className={headingClass}>Personal Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            {data.personalDetails.dob && (
              <p>
                <span className="text-neutral-600">DOB:</span>{" "}
                <strong>{data.personalDetails.dob}</strong>
              </p>
            )}
            {data.personalDetails.gender && (
              <p>
                <span className="text-neutral-600">Gender:</span>{" "}
                <strong>{data.personalDetails.gender}</strong>
              </p>
            )}
            {data.personalDetails.nationality && (
              <p>
                <span className="text-neutral-600">Nationality:</span>{" "}
                <strong>{data.personalDetails.nationality}</strong>
              </p>
            )}
            {data.personalDetails.noticePeriod && (
              <p>
                <span className="text-neutral-600">Notice:</span>{" "}
                <strong>{data.personalDetails.noticePeriod}</strong>
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
