// app/create-cv/types.ts

export type CvTemplateType = "classic" | "modern" | "mono";

export interface CvExperience {
  id: string;
  company: string;
  designation: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
}

export interface CvEducation {
  id: string;
  degree: string;
  institution: string;
  university?: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

export interface CvProject {
  id: string;
  title: string;
  description: string;
  technologies: string;
  projectUrl?: string;
  githubUrl?: string;
}

export interface CvCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface CvSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CvSectionVisibility {
  photo: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
  languages: boolean;
  socialLinks: boolean;
  sutraNetBadge: boolean;
}

export interface CvData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  kagazId?: string;
  isVerified?: boolean;
  summary: string;
  skills: string[];
  languages: string[];
  socialLinks: CvSocialLink[];
  experience: CvExperience[];
  education: CvEducation[];
  projects: CvProject[];
  certifications: CvCertification[];
  visibility: CvSectionVisibility;
}

export const DEFAULT_CV_VISIBILITY: CvSectionVisibility = {
  photo: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: true,
  languages: true,
  socialLinks: true,
  sutraNetBadge: true,
};

export const EMPTY_CV_DATA: CvData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  avatarUrl: "",
  summary: "",
  skills: [],
  languages: [],
  socialLinks: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  visibility: { ...DEFAULT_CV_VISIBILITY },
};

// Supabase-এর profiles ডাটা থেকে অটোমেটিক CvData তৈরি করার ফাংশন
export function mapProfileToCvData(profile: Record<string, unknown>): CvData {
  const city = typeof profile.city === "string" ? profile.city : "";
  const state = typeof profile.state === "string" ? profile.state : "";
  const country = typeof profile.country === "string" ? profile.country : "";
  const location = [city, state, country].filter(Boolean).join(", ");

  // Languages JSON পার্স করা
  let parsedLanguages: string[] = [];
  if (profile.languages) {
    try {
      const raw =
        typeof profile.languages === "string"
          ? JSON.parse(profile.languages)
          : profile.languages;
      if (Array.isArray(raw)) {
        parsedLanguages = raw
          .map((l: { name?: string } | string) =>
            typeof l === "string" ? l : l?.name || "",
          )
          .filter(Boolean);
      }
    } catch {
      if (typeof profile.languages === "string") {
        parsedLanguages = profile.languages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  }

  // Experience ম্যাপ করা
  const rawExp = Array.isArray(profile.experience) ? profile.experience : [];
  const experience: CvExperience[] = rawExp
    .filter((e: Record<string, unknown>) => e.company || e.designation)
    .map((e: Record<string, unknown>, idx: number) => ({
      id: String(e.id || `exp-${idx}`),
      company: String(e.company || ""),
      designation: String(e.designation || ""),
      employmentType: String(e.employmentType || "Full-time"),
      startDate: String(e.startDate || ""),
      endDate: String(e.endDate || ""),
      isCurrent: Boolean(e.isCurrent),
      responsibilities: String(e.responsibilities || ""),
    }));

  // Education ম্যাপ করা
  const rawEdu = Array.isArray(profile.profile_education)
    ? profile.profile_education
    : [];
  const education: CvEducation[] = rawEdu
    .filter((ed: Record<string, unknown>) => ed.degree || ed.institution)
    .map((ed: Record<string, unknown>, idx: number) => ({
      id: String(ed.id || `edu-${idx}`),
      degree: String(ed.degree || ""),
      institution: String(ed.institution || ""),
      university: ed.university ? String(ed.university) : undefined,
      startYear: String(ed.start_year || ""),
      endYear: String(ed.end_year || ""),
      grade: ed.grade ? String(ed.grade) : undefined,
    }));

  // Projects ম্যাপ করা
  const rawProj = Array.isArray(profile.projects) ? profile.projects : [];
  const projects: CvProject[] = rawProj
    .filter((p: Record<string, unknown>) => p.title)
    .map((p: Record<string, unknown>, idx: number) => ({
      id: String(p.id || `proj-${idx}`),
      title: String(p.title || ""),
      description: String(p.description || ""),
      technologies: String(p.technologies || ""),
      projectUrl: p.projectUrl ? String(p.projectUrl) : undefined,
      githubUrl: p.githubUrl ? String(p.githubUrl) : undefined,
    }));

  // Certifications ম্যাপ করা
  const rawCert = Array.isArray(profile.certifications)
    ? profile.certifications
    : [];
  const certifications: CvCertification[] = rawCert
    .filter((c: Record<string, unknown>) => c.title || c.name)
    .map((c: Record<string, unknown>, idx: number) => ({
      id: String(c.id || `cert-${idx}`),
      title: String(c.title || c.name || ""),
      issuer: String(c.issuer || ""),
      date: String(c.date || ""),
    }));

  // Social Links ম্যাপ করা
  const rawLinks = Array.isArray(profile.social_links)
    ? profile.social_links
    : [];
  const socialLinks: CvSocialLink[] = rawLinks
    .filter((s: Record<string, unknown>) => s.url)
    .map((s: Record<string, unknown>, idx: number) => ({
      id: String(s.id || `link-${idx}`),
      platform: String(s.platform || "Link"),
      url: String(s.url || ""),
    }));

  return {
    fullName: String(profile.full_name || ""),
    title: String(profile.title || ""),
    email: String(profile.email || ""),
    phone: String(profile.phone || ""),
    location,
    avatarUrl: String(profile.avatar_url || ""),
    kagazId: profile.kagaz_id ? String(profile.kagaz_id) : undefined,
    isVerified: Boolean(profile.is_verified),
    summary: String(profile.bio || ""),
    skills: Array.isArray(profile.skills) ? profile.skills.map(String) : [],
    languages: parsedLanguages,
    socialLinks,
    experience,
    education,
    projects,
    certifications,
    visibility: { ...DEFAULT_CV_VISIBILITY },
  };
}
