// app/p/[kagazId]/components/PublicIndividualView.tsx
"use client";

import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Sparkles,
  User,
  Download,
  Calendar,
  Droplet,
  Languages,
  Users,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import {
  DEFAULT_INDIVIDUAL_VISIBILITY,
  IndividualVisibility,
} from "@/app/dashboard/individual/components/IndividualPrivacyModal";

interface SocialLink {
  id?: string;
  platform?: string;
  url?: string;
}

interface ExperienceItem {
  id?: string;
  company?: string;
  designation?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  responsibilities?: string;
}

interface EducationItem {
  id?: string;
  degree?: string;
  institution?: string;
  university?: string;
  start_year?: string;
  end_year?: string;
  grade?: string;
}

interface ProjectItem {
  id?: string;
  title?: string;
  description?: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
}

interface CertificationItem {
  id?: string;
  title?: string;
  name?: string;
  issuer?: string;
  date?: string;
}

interface AchievementItem {
  id?: string;
  title?: string;
  description?: string;
}

interface FamilyItem {
  id?: string;
  relation?: string;
  name?: string;
  occupation?: string;
  contact?: string;
}

interface ReferenceItem {
  id?: string;
  name?: string;
  designation?: string;
  relation?: string;
  contact?: string;
}

export interface PublicProfileData {
  kagaz_id: string;
  full_name?: string;
  title?: string;
  sector?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  dob?: string;
  gender?: string;
  blood_group?: string;
  is_verified?: boolean;
  nationality?: string;
  languages?: string;
  address_line?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  skills?: string[];
  interests?: string[];
  social_links?: SocialLink[];
  experience?: ExperienceItem[];
  profile_education?: EducationItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  family?: FamilyItem[];
  references_list?: ReferenceItem[];
  career_preferences?: {
    lookingForJob?: boolean;
    availableForFreelance?: boolean;
    noticePeriod?: string;
  };
  public_visibility?: Partial<IndividualVisibility>;
}

export default function PublicIndividualView({
  profile,
}: {
  profile: PublicProfileData;
}) {
  const vis: IndividualVisibility = {
    ...DEFAULT_INDIVIDUAL_VISIBILITY,
    ...(profile.public_visibility || {}),
  };

  const fullAddress = [
    profile.address_line,
    profile.city,
    profile.state,
    profile.pincode,
    profile.country,
  ]
    .filter(Boolean)
    .join(", ");

  const parsedLanguages = (() => {
    if (!profile.languages) return [];
    try {
      const parsed =
        typeof profile.languages === "string"
          ? JSON.parse(profile.languages)
          : profile.languages;
      if (Array.isArray(parsed)) {
        return parsed.map((l: { name?: string }) => l.name).filter(Boolean);
      }
      return [String(profile.languages)];
    } catch {
      return [String(profile.languages)];
    }
  })();

  const handleDownloadVCard = () => {
    const vcardLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.full_name || "SutraNet Member"}`,
      profile.title ? `TITLE:${profile.title}` : "",
      vis.phone && profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
      vis.email && profile.email ? `EMAIL:${profile.email}` : "",
      vis.address && fullAddress ? `ADR:;;${fullAddress}` : "",
      `NOTE:SutraNet ID: ${profile.kagaz_id}`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([vcardLines], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.full_name || profile.kagaz_id}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasPersonalMeta =
    (vis.dob && profile.dob) ||
    (vis.gender && profile.gender) ||
    (vis.blood_group && profile.blood_group) ||
    (vis.nationality && profile.nationality) ||
    (vis.languages && parsedLanguages.length > 0);

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* ১. হিরো প্রোফাইল কার্ড */}
      <div className="bg-white border border-neutral-300 rounded-sm shadow-xs overflow-hidden">
        <div className="h-20 sm:h-32 bg-linear-to-r from-neutral-950 via-neutral-800 to-neutral-900 relative" />

        <div className="px-4 sm:px-8 pb-5 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 -mt-10 sm:-mt-14 mb-4 relative z-20">
            <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full border-4 border-white bg-neutral-100 shadow-md overflow-hidden flex items-center justify-center shrink-0 relative z-20">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-400" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 sm:px-3 py-1.5 bg-neutral-100 border border-neutral-300 text-[11px] sm:text-xs font-mono font-bold text-neutral-900 rounded-xs">
                ID: {profile.kagaz_id}
              </span>
              <button
                onClick={handleDownloadVCard}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-neutral-900 text-white text-[11px] sm:text-xs font-mono uppercase rounded-xs hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save Contact</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-serif font-bold text-neutral-950 wrap-break-word">
                {profile.full_name || "SutraNet Member"}
              </h1>
              {profile.is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold uppercase rounded-full shrink-0">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>

            {(profile.title || profile.sector) && (
              <p className="text-xs sm:text-sm font-mono text-neutral-600 wrap-break-word">
                {profile.title}
                {profile.title && profile.sector ? " • " : ""}
                {profile.sector && (
                  <span className="text-neutral-500">{profile.sector}</span>
                )}
              </p>
            )}
          </div>

          {((vis.phone && profile.phone) ||
            (vis.email && profile.email) ||
            (vis.address && fullAddress)) && (
            <div className="mt-4 sm:mt-5 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-xs font-mono text-neutral-700">
              {vis.phone && profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xs hover:border-neutral-400 transition-colors w-full sm:w-auto"
                >
                  <Phone className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                  <span className="truncate">{profile.phone}</span>
                </a>
              )}
              {vis.email && profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xs hover:border-neutral-400 transition-colors w-full sm:w-auto min-w-0"
                >
                  <Mail className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                  <span className="break-all sm:break-normal">
                    {profile.email}
                  </span>
                </a>
              )}
              {vis.address && fullAddress && (
                <span className="inline-flex items-start sm:items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xs w-full sm:w-auto">
                  <MapPin className="h-3.5 w-3.5 text-neutral-600 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="wrap-break-word">{fullAddress}</span>
                </span>
              )}
            </div>
          )}

          {vis.social_links &&
            Array.isArray(profile.social_links) &&
            profile.social_links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.social_links.map((link, idx) =>
                  link.url ? (
                    <a
                      key={link.id || idx}
                      href={
                        link.url.startsWith("http")
                          ? link.url
                          : `https://${link.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-300 text-[11px] font-mono text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors rounded-xs"
                    >
                      <Globe className="h-3 w-3 shrink-0" />
                      <span>{link.platform || "Website"}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  ) : null,
                )}
              </div>
            )}
        </div>
      </div>

      {/* ২. About / Bio */}
      {vis.bio && profile.bio && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            About
          </h2>
          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line wrap-break-word">
            {profile.bio}
          </p>
        </section>
      )}

      {/* ৩. Personal Details Grid */}
      {hasPersonalMeta && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
            {vis.dob && profile.dob && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-neutral-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Date of Birth
                  </p>
                  <p className="font-semibold text-neutral-900 truncate">
                    {profile.dob}
                  </p>
                </div>
              </div>
            )}
            {vis.gender && profile.gender && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center gap-2.5">
                <User className="h-4 w-4 text-neutral-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Gender
                  </p>
                  <p className="font-semibold text-neutral-900 truncate">
                    {profile.gender}
                  </p>
                </div>
              </div>
            )}
            {vis.blood_group && profile.blood_group && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center gap-2.5">
                <Droplet className="h-4 w-4 text-red-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Blood Group
                  </p>
                  <p className="font-semibold text-neutral-900 truncate">
                    {profile.blood_group}
                  </p>
                </div>
              </div>
            )}
            {vis.nationality && profile.nationality && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-neutral-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Nationality
                  </p>
                  <p className="font-semibold text-neutral-900 truncate">
                    {profile.nationality}
                  </p>
                </div>
              </div>
            )}
            {vis.languages && parsedLanguages.length > 0 && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center gap-2.5 sm:col-span-2">
                <Languages className="h-4 w-4 text-neutral-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase text-neutral-500">
                    Languages
                  </p>
                  <p className="font-semibold text-neutral-900 wrap-break-word">
                    {parsedLanguages.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ৪. Skills & Interests */}
      {((vis.skills &&
        Array.isArray(profile.skills) &&
        profile.skills.length > 0) ||
        (vis.interests &&
          Array.isArray(profile.interests) &&
          profile.interests.length > 0)) && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
          {vis.skills &&
            Array.isArray(profile.skills) &&
            profile.skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                  Skills &amp; Expertise
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-neutral-900 text-white text-[11px] sm:text-xs font-mono rounded-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {vis.interests &&
            Array.isArray(profile.interests) &&
            profile.interests.length > 0 && (
              <div className="space-y-2 pt-2">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {profile.interests.map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] sm:text-xs font-mono rounded-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </section>
      )}

      {/* ৫. Work Experience */}
      {vis.experience &&
        Array.isArray(profile.experience) &&
        profile.experience.filter((e) => e.company || e.designation).length >
          0 && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-neutral-700 shrink-0" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                Experience
              </h2>
            </div>
            <div className="space-y-4 divide-y divide-neutral-200">
              {profile.experience
                .filter((e) => e.company || e.designation)
                .map((exp, idx) => (
                  <div key={exp.id || idx} className={idx > 0 ? "pt-4" : ""}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-neutral-950">
                        {exp.designation || exp.company}
                      </h3>
                      {exp.employmentType && (
                        <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs shrink-0">
                          {exp.employmentType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-neutral-600 mt-0.5">
                      {exp.company}
                      {(exp.startDate || exp.isCurrent) &&
                        ` • ${exp.startDate || ""} — ${
                          exp.isCurrent ? "Present" : exp.endDate || ""
                        }`}
                    </p>
                    {exp.responsibilities && (
                      <p className="text-xs text-neutral-700 mt-2 leading-relaxed whitespace-pre-line wrap-break-word">
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

      {/* ৬. Education */}
      {vis.education &&
        Array.isArray(profile.profile_education) &&
        profile.profile_education.length > 0 && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-neutral-700 shrink-0" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                Education
              </h2>
            </div>
            <div className="space-y-3 divide-y divide-neutral-200">
              {profile.profile_education.map((edu, idx) => (
                <div key={edu.id || idx} className={idx > 0 ? "pt-3" : ""}>
                  <h3 className="text-sm font-bold text-neutral-950">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-neutral-700">
                    {edu.institution}
                    {edu.university ? ` (${edu.university})` : ""}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    {edu.start_year} - {edu.end_year || "Present"}
                    {edu.grade ? ` • Grade: ${edu.grade}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* ৭. Projects */}
      {vis.projects &&
        Array.isArray(profile.projects) &&
        profile.projects.filter((p) => p.title?.trim()).length > 0 && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-neutral-700 shrink-0" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                Projects
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {profile.projects
                .filter((p) => p.title?.trim())
                .map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-3.5 sm:p-4 border border-neutral-200 bg-neutral-50 rounded-xs flex flex-col justify-between space-y-3 min-w-0"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-neutral-950 wrap-break-word">
                        {proj.title}
                      </h3>
                      {proj.description && (
                        <p className="text-xs text-neutral-600 leading-relaxed wrap-break-word">
                          {proj.description}
                        </p>
                      )}
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.split(",").map((tech, i) =>
                            tech.trim() ? (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs"
                              >
                                {tech.trim()}
                              </span>
                            ) : null,
                          )}
                        </div>
                      )}
                    </div>

                    {(proj.projectUrl || proj.githubUrl) && (
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-200/70">
                        {proj.projectUrl && (
                          <a
                            href={
                              proj.projectUrl.startsWith("http")
                                ? proj.projectUrl
                                : `https://${proj.projectUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-900 hover:underline"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={
                              proj.githubUrl.startsWith("http")
                                ? proj.githubUrl
                                : `https://${proj.githubUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-700 hover:text-neutral-950 hover:underline"
                          >
                            <span>Source Code</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

      {/* ৮. Certifications & Achievements */}
      {((vis.certifications &&
        Array.isArray(profile.certifications) &&
        profile.certifications.filter((c) => (c.title || c.name)?.trim())
          .length > 0) ||
        (vis.achievements &&
          Array.isArray(profile.achievements) &&
          profile.achievements.filter((a) => a.title?.trim()).length > 0)) && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-neutral-700 shrink-0" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
              Certifications &amp; Achievements
            </h2>
          </div>
          <div className="space-y-2.5 sm:space-y-3">
            {vis.certifications &&
              Array.isArray(profile.certifications) &&
              profile.certifications
                .filter((c) => (c.title || c.name)?.trim())
                .map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-3 border border-neutral-200 rounded-xs bg-neutral-50"
                  >
                    <p className="text-xs font-bold text-neutral-900 wrap-break-word">
                      {cert.title || cert.name}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-600 mt-0.5">
                      {cert.issuer} {cert.date ? `• ${cert.date}` : ""}
                    </p>
                  </div>
                ))}
            {vis.achievements &&
              Array.isArray(profile.achievements) &&
              profile.achievements
                .filter((a) => a.title?.trim())
                .map((ach, idx) => (
                  <div
                    key={ach.id || idx}
                    className="p-3 border border-neutral-200 rounded-xs bg-neutral-50 flex items-start gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 wrap-break-word">
                        {ach.title}
                      </p>
                      {ach.description && (
                        <p className="text-[11px] text-neutral-600 mt-0.5 wrap-break-word">
                          {ach.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* ৯. Career Preferences */}
      {vis.career_preferences &&
        profile.career_preferences &&
        (profile.career_preferences.lookingForJob ||
          profile.career_preferences.availableForFreelance ||
          profile.career_preferences.noticePeriod?.trim()) && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              Career Availability
            </h2>
            <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs font-mono">
              {profile.career_preferences.lookingForJob && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Open to Job
                  Opportunities
                </span>
              )}
              {profile.career_preferences.availableForFreelance && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-300 text-blue-800 rounded-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Available
                  for Freelance
                </span>
              )}
              {profile.career_preferences.noticePeriod && (
                <span className="px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-xs">
                  Notice: {profile.career_preferences.noticePeriod}
                </span>
              )}
            </div>
          </section>
        )}

      {/* ১০. Family & References */}
      {vis.family &&
        Array.isArray(profile.family) &&
        profile.family.filter((f) => f.name?.trim()).length > 0 && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-neutral-700 shrink-0" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                Family Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              {profile.family
                .filter((f) => f.name?.trim())
                .map((fam, idx) => (
                  <div
                    key={fam.id || idx}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1"
                  >
                    <p className="text-[10px] font-mono uppercase text-neutral-500">
                      {fam.relation}
                    </p>
                    <p className="font-bold text-neutral-900">{fam.name}</p>
                    {fam.occupation && (
                      <p className="text-neutral-600">{fam.occupation}</p>
                    )}
                    {fam.contact?.trim() && (
                      <a
                        href={`tel:${fam.contact}`}
                        className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-neutral-800 hover:text-emerald-700 hover:underline"
                      >
                        <Phone className="h-3 w-3 text-neutral-500 shrink-0" />
                        <span>{fam.contact}</span>
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

      {vis.references_list &&
        Array.isArray(profile.references_list) &&
        profile.references_list.filter((r) => r.name?.trim()).length > 0 && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              References
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              {profile.references_list
                .filter((r) => r.name?.trim())
                .map((ref, idx) => (
                  <div
                    key={ref.id || idx}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs min-w-0"
                  >
                    <p className="font-bold text-neutral-900">{ref.name}</p>
                    <p className="text-neutral-600">
                      {ref.designation || ref.relation}
                    </p>
                    {ref.contact && (
                      <p className="font-mono text-neutral-700 mt-1 break-all sm:break-normal">
                        {ref.contact}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}
    </div>
  );
}
