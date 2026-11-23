// app/create-cv/components/CvPreview.tsx
"use client";

import { CvData, CvTemplateType } from "../types";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MonoTemplate from "./templates/MonoTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";

interface Props {
  data: CvData;
  template: CvTemplateType;
}

// কারও ব্যক্তিগত তথ্য ছাড়া একদম সাধারণ স্যাম্পল ডেটা (শুধু প্রিভিউর জন্য)
export const SAMPLE_CV_DATA: CvData = {
  ...({} as CvData),
  fullName: "Your Full Name",
  title: "Your Role / Target Position",
  email: "your.email@example.com",
  phone: "+91 00000 00000",
  location: "City, State",
  kagazId: "SN-00000-00000",
  isVerified: true,
  avatarUrl: "",
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

export function getResolvedCvData(data: CvData): CvData {
  return {
    ...SAMPLE_CV_DATA,
    ...data,
    fullName: data.fullName.trim() ? data.fullName : SAMPLE_CV_DATA.fullName,
    title: data.title.trim() ? data.title : SAMPLE_CV_DATA.title,
    email: data.email.trim() ? data.email : SAMPLE_CV_DATA.email,
    phone: data.phone.trim() ? data.phone : SAMPLE_CV_DATA.phone,
    location: data.location.trim() ? data.location : SAMPLE_CV_DATA.location,
    kagazId: data.kagazId || SAMPLE_CV_DATA.kagazId,
    isVerified:
      typeof data.isVerified === "boolean"
        ? data.isVerified
        : SAMPLE_CV_DATA.isVerified,
    avatarUrl: data.avatarUrl || SAMPLE_CV_DATA.avatarUrl,
    socialLinks:
      data.socialLinks.length > 0
        ? data.socialLinks
        : SAMPLE_CV_DATA.socialLinks,
    objective: data.objective.trim()
      ? data.objective
      : SAMPLE_CV_DATA.objective,
    summary: data.summary.trim() ? data.summary : SAMPLE_CV_DATA.summary,
    experience:
      data.experience.length > 0 ? data.experience : SAMPLE_CV_DATA.experience,
    projects:
      data.projects.length > 0 ? data.projects : SAMPLE_CV_DATA.projects,
    education:
      data.education.length > 0 ? data.education : SAMPLE_CV_DATA.education,
    skills: data.skills.length > 0 ? data.skills : SAMPLE_CV_DATA.skills,
    languages:
      data.languages.length > 0 ? data.languages : SAMPLE_CV_DATA.languages,
    hobbies: data.hobbies.length > 0 ? data.hobbies : SAMPLE_CV_DATA.hobbies,
    certifications:
      data.certifications.length > 0
        ? data.certifications
        : SAMPLE_CV_DATA.certifications,
    declarationText: data.declarationText.trim()
      ? data.declarationText
      : SAMPLE_CV_DATA.declarationText,
    personalDetails: {
      ...SAMPLE_CV_DATA.personalDetails,
      ...data.personalDetails,
    },
    visibility: {
      ...SAMPLE_CV_DATA.visibility,
      ...(data.visibility || {}),
    },
  };
}

export default function CvPreview({ data, template }: Props) {
  switch (template) {
    case "classic":
      return <ClassicTemplate rawData={data} />;
    case "mono":
      return <MonoTemplate rawData={data} />;
    case "minimal":
      return <MinimalTemplate rawData={data} />;
    case "modern":
    default:
      return <ModernTemplate rawData={data} />;
  }
}
