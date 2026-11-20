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
}

export interface CvCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface CvAchievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface CvVolunteer {
  id: string;
  role: string;
  organization: string;
  duration: string;
  description: string;
}

export interface CvPublication {
  id: string;
  title: string;
  publisher: string;
  year: string;
  url?: string;
}

export interface CvReference {
  id: string;
  name: string;
  designation: string;
  contact: string;
}

export interface CvSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CvPersonalDetails {
  dob: string;
  gender: string;
  nationality: string;
  noticePeriod: string;
}

export interface CvSectionVisibility {
  photo: boolean;
  sutraNetBadge: boolean;
  objective: boolean;
  summary: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  skills: boolean;
  languages: boolean;
  socialLinks: boolean;
  certifications: boolean;
  achievements: boolean;
  volunteer: boolean;
  publications: boolean;
  hobbies: boolean;
  references: boolean;
  personalDetails: boolean;
  customSection: boolean;
  declaration: boolean;
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
  objective: string;
  summary: string;
  skills: string[];
  languages: string[];
  hobbies: string[];
  socialLinks: CvSocialLink[];
  experience: CvExperience[];
  education: CvEducation[];
  projects: CvProject[];
  certifications: CvCertification[];
  achievements: CvAchievement[];
  volunteer: CvVolunteer[];
  publications: CvPublication[];
  references: CvReference[];
  personalDetails: CvPersonalDetails;
  declarationText: string;
  customSectionTitle: string;
  customSectionContent: string;
  visibility: CvSectionVisibility;
}

export const DEFAULT_CV_VISIBILITY: CvSectionVisibility = {
  photo: true,
  sutraNetBadge: true,
  objective: false,
  summary: true,
  experience: true,
  projects: true,
  education: true,
  skills: true,
  languages: true,
  socialLinks: true,
  certifications: true,
  achievements: false,
  volunteer: false,
  publications: false,
  hobbies: false,
  references: false,
  personalDetails: false,
  customSection: false,
  declaration: false,
};

export const DEFAULT_DECLARATION =
  "I hereby declare that all the information furnished above is true, complete, and correct to the best of my knowledge and belief.";

export const EMPTY_CV_DATA: CvData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  avatarUrl: "",
  objective: "",
  summary: "",
  skills: [],
  languages: [],
  hobbies: [],
  socialLinks: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
  volunteer: [],
  publications: [],
  references: [],
  personalDetails: {
    dob: "",
    gender: "",
    nationality: "Indian",
    noticePeriod: "",
  },
  declarationText: DEFAULT_DECLARATION,
  customSectionTitle: "Additional Information",
  customSectionContent: "",
  visibility: { ...DEFAULT_CV_VISIBILITY },
};

export function mapProfileToCvData(profile: Record<string, unknown>): CvData {
  const location = [profile.city, profile.state, profile.country]
    .filter((v) => typeof v === "string" && v.trim())
    .join(", ");

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

  return {
    fullName: String(profile.full_name || ""),
    title: String(profile.title || ""),
    email: String(profile.email || ""),
    phone: String(profile.phone || ""),
    location,
    avatarUrl: String(profile.avatar_url || ""),
    kagazId: profile.kagaz_id ? String(profile.kagaz_id) : undefined,
    isVerified: Boolean(profile.is_verified),
    objective: "",
    summary: String(profile.bio || ""),
    skills: Array.isArray(profile.skills) ? profile.skills.map(String) : [],
    languages: parsedLanguages,
    hobbies: Array.isArray(profile.interests)
      ? profile.interests.map(String)
      : [],
    socialLinks: (Array.isArray(profile.social_links)
      ? profile.social_links
      : []
    )
      .filter((s: Record<string, unknown>) => s.url)
      .map((s: Record<string, unknown>, i: number) => ({
        id: String(s.id || `link-${i}`),
        platform: String(s.platform || "Link"),
        url: String(s.url || ""),
      })),
    experience: (Array.isArray(profile.experience) ? profile.experience : [])
      .filter((e: Record<string, unknown>) => e.company || e.designation)
      .map((e: Record<string, unknown>, i: number) => ({
        id: String(e.id || `exp-${i}`),
        company: String(e.company || ""),
        designation: String(e.designation || ""),
        employmentType: String(e.employmentType || "Full-time"),
        startDate: String(e.startDate || ""),
        endDate: String(e.endDate || ""),
        isCurrent: Boolean(e.isCurrent),
        responsibilities: String(e.responsibilities || ""),
      })),
    education: (Array.isArray(profile.profile_education)
      ? profile.profile_education
      : []
    )
      .filter((ed: Record<string, unknown>) => ed.degree || ed.institution)
      .map((ed: Record<string, unknown>, i: number) => ({
        id: String(ed.id || `edu-${i}`),
        degree: String(ed.degree || ""),
        institution: String(ed.institution || ""),
        university: ed.university ? String(ed.university) : undefined,
        startYear: String(ed.start_year || ""),
        endYear: String(ed.end_year || ""),
        grade: ed.grade ? String(ed.grade) : undefined,
      })),
    projects: (Array.isArray(profile.projects) ? profile.projects : [])
      .filter((p: Record<string, unknown>) => p.title)
      .map((p: Record<string, unknown>, i: number) => ({
        id: String(p.id || `proj-${i}`),
        title: String(p.title || ""),
        description: String(p.description || ""),
        technologies: String(p.technologies || ""),
        projectUrl: p.projectUrl ? String(p.projectUrl) : undefined,
      })),
    certifications: (Array.isArray(profile.certifications)
      ? profile.certifications
      : []
    )
      .filter((c: Record<string, unknown>) => c.title || c.name)
      .map((c: Record<string, unknown>, i: number) => ({
        id: String(c.id || `cert-${i}`),
        title: String(c.title || c.name || ""),
        issuer: String(c.issuer || ""),
        date: String(c.date || ""),
      })),
    achievements: (Array.isArray(profile.achievements)
      ? profile.achievements
      : []
    )
      .filter((a: Record<string, unknown>) => a.title)
      .map((a: Record<string, unknown>, i: number) => ({
        id: String(a.id || `ach-${i}`),
        title: String(a.title || ""),
        issuer: String(a.issuer || ""),
        date: String(a.date || ""),
      })),
    volunteer: [],
    publications: [],
    references: (Array.isArray(profile.references_list)
      ? profile.references_list
      : []
    )
      .filter((r: Record<string, unknown>) => r.name)
      .map((r: Record<string, unknown>, i: number) => ({
        id: String(r.id || `ref-${i}`),
        name: String(r.name || ""),
        designation: String(r.designation || ""),
        contact: String(r.contact || ""),
      })),
    personalDetails: {
      dob: String(profile.dob || ""),
      gender: String(profile.gender || ""),
      nationality: String(profile.nationality || "Indian"),
      noticePeriod: "",
    },
    declarationText: DEFAULT_DECLARATION,
    customSectionTitle: "Additional Information",
    customSectionContent: "",
    visibility: { ...DEFAULT_CV_VISIBILITY },
  };
}
