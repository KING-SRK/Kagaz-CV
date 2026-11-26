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

// কারও ব্যক্তিগত তথ্য ছাড়া একদম সাধারণ স্যাম্পল ডেটা (শুধু একদম খালি অবস্থায় প্রিভিউর জন্য)
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
  // যেসব আইটেমে কোনো লেখা নেই, সেগুলো ফিল্টার করে বাদ দেওয়া হচ্ছে
  const validExperience = (data.experience || []).filter(
    (exp) =>
      exp.designation?.trim() ||
      exp.company?.trim() ||
      exp.responsibilities?.trim(),
  );

  const validProjects = (data.projects || []).filter(
    (proj) =>
      proj.title?.trim() ||
      proj.description?.trim() ||
      proj.technologies?.trim(),
  );

  const validEducation = (data.education || []).filter(
    (edu) => edu.degree?.trim() || edu.institution?.trim(),
  );

  const validSocialLinks = (data.socialLinks || []).filter(
    (link) => link.platform?.trim() || link.url?.trim(),
  );

  const validCertifications = (data.certifications || []).filter(
    (cert) => cert.title?.trim() || cert.issuer?.trim(),
  );

  const validAchievements = (data.achievements || []).filter(
    (ach) => ach.title?.trim() || ach.issuer?.trim(),
  );

  const validVolunteer = (data.volunteer || []).filter(
    (vol) =>
      vol.role?.trim() || vol.organization?.trim() || vol.description?.trim(),
  );

  const validPublications = (data.publications || []).filter(
    (pub) => pub.title?.trim() || pub.publisher?.trim(),
  );

  const validReferences = (data.references || []).filter(
    (ref) => ref.name?.trim() || ref.designation?.trim() || ref.contact?.trim(),
  );

  const validSkills = (data.skills || []).filter((s) => s.trim());
  const validLanguages = (data.languages || []).filter((l) => l.trim());
  const validHobbies = (data.hobbies || []).filter((h) => h.trim());

  // ইউজার এখনো ফর্মে আদৌ কিছু লিখেছে কি না তা চেক করা হচ্ছে
  const hasUserStartedEditing = Boolean(
    data.fullName?.trim() ||
    data.title?.trim() ||
    data.email?.trim() ||
    data.phone?.trim() ||
    data.location?.trim() ||
    data.summary?.trim() ||
    data.objective?.trim() ||
    validExperience.length > 0 ||
    validProjects.length > 0 ||
    validEducation.length > 0 ||
    validSkills.length > 0,
  );

  // যদি ইউজার একদমই কিছু না লিখে থাকে, তবেই কেবল ডেমো স্যাম্পল দেখাবে
  if (!hasUserStartedEditing) {
    return {
      ...SAMPLE_CV_DATA,
      kagazId: data.kagazId || SAMPLE_CV_DATA.kagazId,
      isVerified:
        typeof data.isVerified === "boolean"
          ? data.isVerified
          : SAMPLE_CV_DATA.isVerified,
      avatarUrl: data.avatarUrl || "",
      visibility: {
        ...SAMPLE_CV_DATA.visibility,
        ...(data.visibility || {}),
      },
    };
  }

  // ইউজার লেখা শুরু করলে শুধুমাত্র তার দেওয়া আসল ডেটাই দেখাবে, ফাঁকাগুলো দেখাবে না
  const hasPersonalDetails = Boolean(
    data.personalDetails?.dob?.trim() ||
    data.personalDetails?.gender?.trim() ||
    data.personalDetails?.nationality?.trim() ||
    data.personalDetails?.noticePeriod?.trim(),
  );

  const hasCustomSection = Boolean(
    data.customSectionTitle?.trim() || data.customSectionContent?.trim(),
  );

  return {
    ...data,
    fullName: data.fullName?.trim() || "Your Name",
    title: data.title?.trim() || "",
    email: data.email?.trim() || "",
    phone: data.phone?.trim() || "",
    location: data.location?.trim() || "",
    kagazId: data.kagazId || "",
    isVerified: Boolean(data.isVerified),
    avatarUrl: data.avatarUrl || "",
    summary: data.summary?.trim() || "",
    objective: data.objective?.trim() || "",
    experience: validExperience,
    projects: validProjects,
    education: validEducation,
    skills: validSkills,
    socialLinks: validSocialLinks,
    certifications: validCertifications,
    languages: validLanguages,
    achievements: validAchievements,
    volunteer: validVolunteer,
    publications: validPublications,
    hobbies: validHobbies,
    references: validReferences,
    customSectionTitle: data.customSectionTitle?.trim() || "",
    customSectionContent: data.customSectionContent?.trim() || "",
    declarationText: data.declarationText?.trim() || "",
    personalDetails: {
      dob: data.personalDetails?.dob?.trim() || "",
      gender: data.personalDetails?.gender?.trim() || "",
      nationality: data.personalDetails?.nationality?.trim() || "",
      noticePeriod: data.personalDetails?.noticePeriod?.trim() || "",
    },
    visibility: {
      ...(data.visibility || SAMPLE_CV_DATA.visibility),
      photo: Boolean(data.visibility?.photo && data.avatarUrl),
      sutraNetBadge: Boolean(data.visibility?.sutraNetBadge && data.kagazId),
      summary: Boolean(data.summary?.trim()),
      objective: Boolean(data.visibility?.objective && data.objective?.trim()),
      experience: Boolean(
        data.visibility?.experience && validExperience.length > 0,
      ),
      projects: Boolean(data.visibility?.projects && validProjects.length > 0),
      education: validEducation.length > 0,
      skills: validSkills.length > 0,
      socialLinks: Boolean(
        data.visibility?.socialLinks && validSocialLinks.length > 0,
      ),
      certifications: Boolean(
        data.visibility?.certifications && validCertifications.length > 0,
      ),
      languages: Boolean(
        data.visibility?.languages && validLanguages.length > 0,
      ),
      achievements: Boolean(
        data.visibility?.achievements && validAchievements.length > 0,
      ),
      volunteer: Boolean(
        data.visibility?.volunteer && validVolunteer.length > 0,
      ),
      publications: Boolean(
        data.visibility?.publications && validPublications.length > 0,
      ),
      hobbies: Boolean(data.visibility?.hobbies && validHobbies.length > 0),
      references: Boolean(
        data.visibility?.references && validReferences.length > 0,
      ),
      personalDetails: Boolean(
        data.visibility?.personalDetails && hasPersonalDetails,
      ),
      customSection: Boolean(
        data.visibility?.customSection && hasCustomSection,
      ),
      declaration: Boolean(
        data.visibility?.declaration && data.declarationText?.trim(),
      ),
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
