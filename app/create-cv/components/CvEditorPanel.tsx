// app/create-cv/components/CvEditorPanel.tsx
"use client";

import { useState, useRef, Dispatch, SetStateAction, ChangeEvent } from "react";
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  User,
  Upload,
  X,
} from "lucide-react";
import { CvData, CvSectionVisibility } from "../types";

interface Props {
  cvData: CvData;
  setCvData: Dispatch<SetStateAction<CvData>>;
}

// প্রতিটি সেকশনের আইটেম ও ক্যারেক্টারের হার্ড লিমিট কনফিগারেশন
const SECTION_LIMITS = {
  experience: 4,
  projects: 4,
  education: 3,
  skills: 15,
  socialLinks: 4,
  certifications: 4,
  languages: 5,
  achievements: 3,
  volunteer: 3,
  publications: 3,
  hobbies: 6,
  references: 2,
};

const CHAR_LIMITS = {
  summary: 320,
  responsibilities: 220,
  projectDescription: 200,
  objective: 200,
  volunteerDescription: 160,
  customSectionContent: 300,
  declarationText: 180,
};

function HardLimitHint({ current, max }: { current: number; max: number }) {
  const isMaxed = current >= max;

  return (
    <div className="flex items-center justify-between gap-2 text-[10px] font-mono pt-0.5">
      <span
        className={isMaxed ? "text-red-600 font-semibold" : "text-neutral-400"}
      >
        {isMaxed ? "Character limit reached" : `Max ${max} characters allowed`}
      </span>
      <span
        className={isMaxed ? "text-red-600 font-semibold" : "text-neutral-400"}
      >
        {current}/{max}
      </span>
    </div>
  );
}

export default function CvEditorPanel({ cvData, setCvData }: Props) {
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const toggleVisibility = (key: keyof CvSectionVisibility) => {
    setCvData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: !prev.visibility[key],
      },
    }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCvData((prev) => ({
          ...prev,
          avatarUrl: reader.result as string,
          visibility: {
            ...prev.visibility,
            photo: true,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setCvData((prev) => ({
      ...prev,
      avatarUrl: "",
    }));
  };

  const addTag = (
    field: "skills" | "languages" | "hobbies",
    value: string,
    clearFn: (v: string) => void,
    maxLimit: number,
  ) => {
    const trimmed = value.trim();
    if (
      !trimmed ||
      cvData[field].includes(trimmed) ||
      cvData[field].length >= maxLimit
    )
      return;
    setCvData((prev) => ({ ...prev, [field]: [...prev[field], trimmed] }));
    clearFn("");
  };

  const activeOptionalCount = [
    cvData.visibility.languages,
    cvData.visibility.objective,
    cvData.visibility.achievements,
    cvData.visibility.volunteer,
    cvData.visibility.publications,
    cvData.visibility.hobbies,
    cvData.visibility.references,
    cvData.visibility.personalDetails,
    cvData.visibility.customSection,
    cvData.visibility.declaration,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3.5 sm:space-y-4 w-full">
      {/* ১. HEADER & CONTACT */}
      <div className="bg-white border border-neutral-300 p-3.5 sm:p-4 rounded-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
            1. Header &amp; Contact
          </h2>
          <div className="flex items-center gap-1.5">
            {cvData.avatarUrl && (
              <MiniToggle
                label="Photo"
                isOn={cvData.visibility.photo}
                onToggle={() => toggleVisibility("photo")}
              />
            )}
            {cvData.kagazId && (
              <MiniToggle
                label="ID Badge"
                isOn={cvData.visibility.sutraNetBadge}
                onToggle={() => toggleVisibility("sutraNetBadge")}
              />
            )}
          </div>
        </div>

        {/* প্রোফাইল ফটো আপলোড ও খালি আইকন প্রিভিউ */}
        <div className="flex items-center gap-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs">
          <div className="h-12 w-12 rounded-xs border border-neutral-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
            {cvData.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cvData.avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-neutral-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono font-semibold text-neutral-800">
              Profile Photo (Optional)
            </p>
            <p className="text-[10px] text-neutral-500 truncate">
              {cvData.avatarUrl
                ? "Photo added to CV preview"
                : "No photo added — leave empty or upload"}
            </p>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 text-white text-[10px] font-mono uppercase rounded-xs hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Upload className="h-3 w-3" />
              <span>{cvData.avatarUrl ? "Change" : "Add Photo"}</span>
            </button>

            {cvData.avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                title="Remove photo"
                className="p-1.5 border border-neutral-300 bg-white text-neutral-500 hover:text-red-600 hover:border-red-300 rounded-xs transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            type="text"
            maxLength={50}
            placeholder="Full Name *"
            value={cvData.fullName}
            onChange={(e) =>
              setCvData({ ...cvData, fullName: e.target.value.slice(0, 50) })
            }
            className="w-full min-w-0 border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
          />
          <input
            type="text"
            maxLength={60}
            placeholder="Professional Title"
            value={cvData.title}
            onChange={(e) =>
              setCvData({ ...cvData, title: e.target.value.slice(0, 60) })
            }
            className="w-full min-w-0 border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
          />
          <input
            type="email"
            maxLength={60}
            placeholder="Email Address"
            value={cvData.email}
            onChange={(e) =>
              setCvData({ ...cvData, email: e.target.value.slice(0, 60) })
            }
            className="w-full min-w-0 border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
          />
          <input
            type="text"
            maxLength={25}
            placeholder="Phone Number"
            value={cvData.phone}
            onChange={(e) =>
              setCvData({ ...cvData, phone: e.target.value.slice(0, 25) })
            }
            className="w-full min-w-0 border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
          />
          <input
            type="text"
            maxLength={60}
            placeholder="Location (City, State)"
            value={cvData.location}
            onChange={(e) =>
              setCvData({ ...cvData, location: e.target.value.slice(0, 60) })
            }
            className="w-full min-w-0 sm:col-span-2 border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* ২. PROFESSIONAL SUMMARY */}
      <div className="bg-white border border-neutral-300 p-3.5 sm:p-4 rounded-xs space-y-2.5">
        <SectionHeader title="2. Professional Summary" />
        <div className="space-y-1">
          <textarea
            rows={3}
            maxLength={CHAR_LIMITS.summary}
            placeholder="Write a concise summary about your background..."
            value={cvData.summary}
            onChange={(e) =>
              setCvData({
                ...cvData,
                summary: e.target.value.slice(0, CHAR_LIMITS.summary),
              })
            }
            className="w-full border border-neutral-300 p-2.5 text-xs rounded-xs focus:outline-none focus:border-neutral-900 resize-none"
          />
          <HardLimitHint
            current={cvData.summary.length}
            max={CHAR_LIMITS.summary}
          />
        </div>
      </div>

      {/* ৩. WORK EXPERIENCE */}
      <div className="bg-white border border-neutral-300 p-3.5 sm:p-4 rounded-xs space-y-3">
        <SectionToggle
          title="3. Work Experience"
          isOn={cvData.visibility.experience}
          onToggle={() => toggleVisibility("experience")}
        />
        {cvData.visibility.experience && (
          <div className="space-y-3">
            {cvData.experience.map((exp, idx) => (
              <div
                key={exp.id}
                className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2 relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCvData({
                      ...cvData,
                      experience: cvData.experience.filter((_, i) => i !== idx),
                    })
                  }
                  className="absolute top-2.5 right-2.5 p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Designation"
                    value={exp.designation}
                    onChange={(e) => {
                      const updated = [...cvData.experience];
                      updated[idx].designation = e.target.value.slice(0, 60);
                      setCvData({ ...cvData, experience: updated });
                    }}
                    className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...cvData.experience];
                      updated[idx].company = e.target.value.slice(0, 60);
                      setCvData({ ...cvData, experience: updated });
                    }}
                    className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    maxLength={25}
                    placeholder="Start (e.g. Jul 2025)"
                    value={exp.startDate}
                    onChange={(e) => {
                      const updated = [...cvData.experience];
                      updated[idx].startDate = e.target.value.slice(0, 25);
                      setCvData({ ...cvData, experience: updated });
                    }}
                    className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    maxLength={25}
                    placeholder="End (or Present)"
                    value={exp.isCurrent ? "Present" : exp.endDate}
                    onChange={(e) => {
                      const updated = [...cvData.experience];
                      const val = e.target.value.slice(0, 25);
                      updated[idx].isCurrent =
                        val.trim().toLowerCase() === "present";
                      updated[idx].endDate = val;
                      setCvData({ ...cvData, experience: updated });
                    }}
                    className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                </div>
                <div className="space-y-1">
                  <textarea
                    rows={2}
                    maxLength={CHAR_LIMITS.responsibilities}
                    placeholder="Key responsibilities..."
                    value={exp.responsibilities}
                    onChange={(e) => {
                      const updated = [...cvData.experience];
                      updated[idx].responsibilities = e.target.value.slice(
                        0,
                        CHAR_LIMITS.responsibilities,
                      );
                      setCvData({ ...cvData, experience: updated });
                    }}
                    className="w-full border border-neutral-300 bg-white p-2 text-xs rounded-xs resize-none"
                  />
                  <HardLimitHint
                    current={exp.responsibilities.length}
                    max={CHAR_LIMITS.responsibilities}
                  />
                </div>
              </div>
            ))}
            <AddBtn
              label="Add Experience"
              currentCount={cvData.experience.length}
              maxLimit={SECTION_LIMITS.experience}
              onClick={() => {
                if (cvData.experience.length >= SECTION_LIMITS.experience)
                  return;
                setCvData({
                  ...cvData,
                  experience: [
                    ...cvData.experience,
                    {
                      id: `exp-${Date.now()}`,
                      company: "",
                      designation: "",
                      employmentType: "Full-time",
                      startDate: "",
                      endDate: "",
                      isCurrent: false,
                      responsibilities: "",
                    },
                  ],
                });
              }}
            />
          </div>
        )}
      </div>

      {/* ৪. KEY PROJECTS */}
      <div className="bg-white border border-neutral-300 p-3.5 sm:p-4 rounded-xs space-y-3">
        <SectionToggle
          title="4. Key Projects"
          isOn={cvData.visibility.projects}
          onToggle={() => toggleVisibility("projects")}
        />
        {cvData.visibility.projects && (
          <div className="space-y-3">
            {cvData.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2 relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCvData({
                      ...cvData,
                      projects: cvData.projects.filter((_, i) => i !== idx),
                    })
                  }
                  className="absolute top-2.5 right-2.5 p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...cvData.projects];
                      updated[idx].title = e.target.value.slice(0, 60);
                      setCvData({ ...cvData, projects: updated });
                    }}
                    className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    maxLength={70}
                    placeholder="Tech Stack"
                    value={proj.technologies}
                    onChange={(e) => {
                      const updated = [...cvData.projects];
                      updated[idx].technologies = e.target.value.slice(0, 70);
                      setCvData({ ...cvData, projects: updated });
                    }}
                    className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                </div>
                <div className="space-y-1">
                  <textarea
                    rows={2}
                    maxLength={CHAR_LIMITS.projectDescription}
                    placeholder="Project description..."
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...cvData.projects];
                      updated[idx].description = e.target.value.slice(
                        0,
                        CHAR_LIMITS.projectDescription,
                      );
                      setCvData({ ...cvData, projects: updated });
                    }}
                    className="w-full border border-neutral-300 bg-white p-2 text-xs rounded-xs resize-none"
                  />
                  <HardLimitHint
                    current={proj.description.length}
                    max={CHAR_LIMITS.projectDescription}
                  />
                </div>
              </div>
            ))}
            <AddBtn
              label="Add Project"
              currentCount={cvData.projects.length}
              maxLimit={SECTION_LIMITS.projects}
              onClick={() => {
                if (cvData.projects.length >= SECTION_LIMITS.projects) return;
                setCvData({
                  ...cvData,
                  projects: [
                    ...cvData.projects,
                    {
                      id: `proj-${Date.now()}`,
                      title: "",
                      description: "",
                      technologies: "",
                    },
                  ],
                });
              }}
            />
          </div>
        )}
      </div>

      {/* ৫. EDUCATION */}
      <div className="bg-white border border-neutral-300 p-3.5 sm:p-4 rounded-xs space-y-3">
        <SectionHeader title="5. Education" />
        <div className="space-y-3">
          {cvData.education.map((edu, idx) => (
            <div
              key={edu.id}
              className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2 relative"
            >
              <button
                type="button"
                onClick={() =>
                  setCvData({
                    ...cvData,
                    education: cvData.education.filter((_, i) => i !== idx),
                  })
                }
                className="absolute top-2.5 right-2.5 p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                <input
                  type="text"
                  maxLength={60}
                  placeholder="Degree / Class"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...cvData.education];
                    updated[idx].degree = e.target.value.slice(0, 60);
                    setCvData({ ...cvData, education: updated });
                  }}
                  className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                />
                <input
                  type="text"
                  maxLength={70}
                  placeholder="School / College"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...cvData.education];
                    updated[idx].institution = e.target.value.slice(0, 70);
                    setCvData({ ...cvData, education: updated });
                  }}
                  className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                />
                <input
                  type="text"
                  maxLength={15}
                  placeholder="Start Year"
                  value={edu.startYear}
                  onChange={(e) => {
                    const updated = [...cvData.education];
                    updated[idx].startYear = e.target.value.slice(0, 15);
                    setCvData({ ...cvData, education: updated });
                  }}
                  className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                />
                <input
                  type="text"
                  maxLength={15}
                  placeholder="End Year"
                  value={edu.endYear}
                  onChange={(e) => {
                    const updated = [...cvData.education];
                    updated[idx].endYear = e.target.value.slice(0, 15);
                    setCvData({ ...cvData, education: updated });
                  }}
                  className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                />
              </div>
            </div>
          ))}
          <AddBtn
            label="Add Education"
            currentCount={cvData.education.length}
            maxLimit={SECTION_LIMITS.education}
            onClick={() => {
              if (cvData.education.length >= SECTION_LIMITS.education) return;
              setCvData({
                ...cvData,
                education: [
                  ...cvData.education,
                  {
                    id: `edu-${Date.now()}`,
                    degree: "",
                    institution: "",
                    startYear: "",
                    endYear: "",
                  },
                ],
              });
            }}
          />
        </div>
      </div>

      {/* ৬. CORE SKILLS */}
      <div className="bg-white border border-neutral-300 p-3.5 sm:p-4 rounded-xs">
        <TagManager
          title="6. Core Skills"
          placeholder="Add skill & press Enter"
          items={cvData.skills}
          maxLimit={SECTION_LIMITS.skills}
          inputVal={skillInput}
          setInputVal={setSkillInput}
          onAdd={() =>
            addTag("skills", skillInput, setSkillInput, SECTION_LIMITS.skills)
          }
          onRemove={(item) =>
            setCvData({
              ...cvData,
              skills: cvData.skills.filter((s) => s !== item),
            })
          }
        />
      </div>

      {/* ৭. SOCIAL & PORTFOLIO LINKS + ৮. CERTIFICATIONS */}
      <div className="bg-white border border-neutral-300 p-3.5 sm:p-4 rounded-xs space-y-4">
        <div className="space-y-2.5">
          <SectionToggle
            title="7. Social & Portfolio Links"
            isOn={cvData.visibility.socialLinks}
            onToggle={() => toggleVisibility("socialLinks")}
          />
          {cvData.visibility.socialLinks && (
            <div className="space-y-2.5">
              {cvData.socialLinks.map((link, idx) => (
                <div
                  key={link.id}
                  className="p-2.5 sm:p-0 bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xs flex flex-col sm:flex-row gap-2 sm:items-center"
                >
                  <input
                    type="text"
                    maxLength={25}
                    placeholder="Platform (GitHub)"
                    value={link.platform}
                    onChange={(e) => {
                      const updated = [...cvData.socialLinks];
                      updated[idx].platform = e.target.value.slice(0, 25);
                      setCvData({ ...cvData, socialLinks: updated });
                    }}
                    className="w-full sm:w-1/3 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <div className="flex gap-2 items-center flex-1 min-w-0">
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...cvData.socialLinks];
                        updated[idx].url = e.target.value.slice(0, 80);
                        setCvData({ ...cvData, socialLinks: updated });
                      }}
                      className="flex-1 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          socialLinks: cvData.socialLinks.filter(
                            (_, i) => i !== idx,
                          ),
                        })
                      }
                      className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <AddBtn
                label="Add Link"
                currentCount={cvData.socialLinks.length}
                maxLimit={SECTION_LIMITS.socialLinks}
                onClick={() => {
                  if (cvData.socialLinks.length >= SECTION_LIMITS.socialLinks)
                    return;
                  setCvData({
                    ...cvData,
                    socialLinks: [
                      ...cvData.socialLinks,
                      { id: `link-${Date.now()}`, platform: "", url: "" },
                    ],
                  });
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2.5 pt-2 border-t border-neutral-200">
          <SectionToggle
            title="8. Certifications"
            isOn={cvData.visibility.certifications}
            onToggle={() => toggleVisibility("certifications")}
          />
          {cvData.visibility.certifications && (
            <div className="space-y-2.5">
              {cvData.certifications.map((cert, idx) => (
                <div
                  key={cert.id}
                  className="p-2.5 sm:p-0 bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xs flex flex-col sm:flex-row gap-2 sm:items-center"
                >
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Certificate Title"
                    value={cert.title}
                    onChange={(e) => {
                      const updated = [...cvData.certifications];
                      updated[idx].title = e.target.value.slice(0, 60);
                      setCvData({ ...cvData, certifications: updated });
                    }}
                    className="w-full sm:flex-1 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <div className="flex gap-2 items-center w-full sm:w-2/5 min-w-0">
                    <input
                      type="text"
                      maxLength={40}
                      placeholder="Issuer"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...cvData.certifications];
                        updated[idx].issuer = e.target.value.slice(0, 40);
                        setCvData({ ...cvData, certifications: updated });
                      }}
                      className="flex-1 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          certifications: cvData.certifications.filter(
                            (_, i) => i !== idx,
                          ),
                        })
                      }
                      className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <AddBtn
                label="Add Certification"
                currentCount={cvData.certifications.length}
                maxLimit={SECTION_LIMITS.certifications}
                onClick={() => {
                  if (
                    cvData.certifications.length >=
                    SECTION_LIMITS.certifications
                  )
                    return;
                  setCvData({
                    ...cvData,
                    certifications: [
                      ...cvData.certifications,
                      {
                        id: `cert-${Date.now()}`,
                        title: "",
                        issuer: "",
                        date: "",
                      },
                    ],
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* কলাপসিবল OPTIONAL SECTIONS DRAWER */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowOptional((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-neutral-300 hover:border-neutral-900 rounded-xs transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
            <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
            <span>
              {showOptional
                ? "Hide Optional Sections"
                : "More Optional Sections"}
            </span>
            {activeOptionalCount > 0 && (
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] rounded-full">
                {activeOptionalCount} Active
              </span>
            )}
          </span>
          {showOptional ? (
            <ChevronUp className="h-4 w-4 text-neutral-600 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-600 shrink-0" />
          )}
        </button>

        {showOptional && (
          <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* LANGUAGES */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs">
              <TagManager
                title="Languages"
                placeholder="Add language (e.g. Bengali, English)"
                isOn={cvData.visibility.languages}
                onToggle={() => toggleVisibility("languages")}
                items={cvData.languages}
                maxLimit={SECTION_LIMITS.languages}
                inputVal={langInput}
                setInputVal={setLangInput}
                onAdd={() =>
                  addTag(
                    "languages",
                    langInput,
                    setLangInput,
                    SECTION_LIMITS.languages,
                  )
                }
                onRemove={(item) =>
                  setCvData({
                    ...cvData,
                    languages: cvData.languages.filter((l) => l !== item),
                  })
                }
              />
            </div>

            {/* CAREER OBJECTIVE */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs space-y-2">
              <SectionToggle
                title="Career Objective"
                isOn={cvData.visibility.objective}
                onToggle={() => toggleVisibility("objective")}
              />
              {cvData.visibility.objective && (
                <div className="space-y-1">
                  <textarea
                    rows={2}
                    maxLength={CHAR_LIMITS.objective}
                    placeholder="Seeking a role as..."
                    value={cvData.objective}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        objective: e.target.value.slice(
                          0,
                          CHAR_LIMITS.objective,
                        ),
                      })
                    }
                    className="w-full border border-neutral-300 p-2 text-xs rounded-xs resize-none"
                  />
                  <HardLimitHint
                    current={cvData.objective.length}
                    max={CHAR_LIMITS.objective}
                  />
                </div>
              )}
            </div>

            {/* ACHIEVEMENTS */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs space-y-2">
              <SectionToggle
                title="Achievements & Awards"
                isOn={cvData.visibility.achievements}
                onToggle={() => toggleVisibility("achievements")}
              />
              {cvData.visibility.achievements && (
                <div className="space-y-2.5">
                  {cvData.achievements.map((ach, idx) => (
                    <div
                      key={ach.id}
                      className="p-2.5 sm:p-0 bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xs flex flex-col sm:flex-row gap-2 sm:items-center"
                    >
                      <input
                        type="text"
                        maxLength={60}
                        placeholder="Award Title"
                        value={ach.title}
                        onChange={(e) => {
                          const updated = [...cvData.achievements];
                          updated[idx].title = e.target.value.slice(0, 60);
                          setCvData({ ...cvData, achievements: updated });
                        }}
                        className="w-full sm:flex-1 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                      />
                      <div className="flex gap-2 items-center w-full sm:w-2/5 min-w-0">
                        <input
                          type="text"
                          maxLength={40}
                          placeholder="Issuer / Year"
                          value={ach.issuer}
                          onChange={(e) => {
                            const updated = [...cvData.achievements];
                            updated[idx].issuer = e.target.value.slice(0, 40);
                            setCvData({ ...cvData, achievements: updated });
                          }}
                          className="flex-1 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              achievements: cvData.achievements.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <AddBtn
                    label="Add Achievement"
                    currentCount={cvData.achievements.length}
                    maxLimit={SECTION_LIMITS.achievements}
                    onClick={() => {
                      if (
                        cvData.achievements.length >=
                        SECTION_LIMITS.achievements
                      )
                        return;
                      setCvData({
                        ...cvData,
                        achievements: [
                          ...cvData.achievements,
                          {
                            id: `ach-${Date.now()}`,
                            title: "",
                            issuer: "",
                            date: "",
                          },
                        ],
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* VOLUNTEER & LEADERSHIP */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs space-y-2">
              <SectionToggle
                title="Volunteer & Leadership"
                isOn={cvData.visibility.volunteer}
                onToggle={() => toggleVisibility("volunteer")}
              />
              {cvData.visibility.volunteer && (
                <div className="space-y-2">
                  {cvData.volunteer.map((vol, idx) => (
                    <div
                      key={vol.id}
                      className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setCvData({
                            ...cvData,
                            volunteer: cvData.volunteer.filter(
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                        className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                        <input
                          type="text"
                          maxLength={50}
                          placeholder="Role (e.g. Coordinator)"
                          value={vol.role}
                          onChange={(e) => {
                            const updated = [...cvData.volunteer];
                            updated[idx].role = e.target.value.slice(0, 50);
                            setCvData({ ...cvData, volunteer: updated });
                          }}
                          className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          maxLength={60}
                          placeholder="Organization / Event"
                          value={vol.organization}
                          onChange={(e) => {
                            const updated = [...cvData.volunteer];
                            updated[idx].organization = e.target.value.slice(
                              0,
                              60,
                            );
                            setCvData({ ...cvData, volunteer: updated });
                          }}
                          className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                      </div>
                      <input
                        type="text"
                        maxLength={CHAR_LIMITS.volunteerDescription}
                        placeholder="Short description..."
                        value={vol.description}
                        onChange={(e) => {
                          const updated = [...cvData.volunteer];
                          updated[idx].description = e.target.value.slice(
                            0,
                            CHAR_LIMITS.volunteerDescription,
                          );
                          setCvData({ ...cvData, volunteer: updated });
                        }}
                        className="w-full border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                      />
                    </div>
                  ))}
                  <AddBtn
                    label="Add Volunteer Role"
                    currentCount={cvData.volunteer.length}
                    maxLimit={SECTION_LIMITS.volunteer}
                    onClick={() => {
                      if (cvData.volunteer.length >= SECTION_LIMITS.volunteer)
                        return;
                      setCvData({
                        ...cvData,
                        volunteer: [
                          ...cvData.volunteer,
                          {
                            id: `vol-${Date.now()}`,
                            role: "",
                            organization: "",
                            duration: "",
                            description: "",
                          },
                        ],
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* PUBLICATIONS & RESEARCH */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs space-y-2">
              <SectionToggle
                title="Publications & Research"
                isOn={cvData.visibility.publications}
                onToggle={() => toggleVisibility("publications")}
              />
              {cvData.visibility.publications && (
                <div className="space-y-2.5">
                  {cvData.publications.map((pub, idx) => (
                    <div
                      key={pub.id}
                      className="p-2.5 sm:p-0 bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xs flex flex-col sm:flex-row gap-2 sm:items-center"
                    >
                      <input
                        type="text"
                        maxLength={70}
                        placeholder="Paper / Article Title"
                        value={pub.title}
                        onChange={(e) => {
                          const updated = [...cvData.publications];
                          updated[idx].title = e.target.value.slice(0, 70);
                          setCvData({ ...cvData, publications: updated });
                        }}
                        className="w-full sm:flex-1 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                      />
                      <div className="flex gap-2 items-center w-full sm:w-2/5 min-w-0">
                        <input
                          type="text"
                          maxLength={40}
                          placeholder="Journal / Year"
                          value={pub.publisher}
                          onChange={(e) => {
                            const updated = [...cvData.publications];
                            updated[idx].publisher = e.target.value.slice(
                              0,
                              40,
                            );
                            setCvData({ ...cvData, publications: updated });
                          }}
                          className="flex-1 min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              publications: cvData.publications.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <AddBtn
                    label="Add Publication"
                    currentCount={cvData.publications.length}
                    maxLimit={SECTION_LIMITS.publications}
                    onClick={() => {
                      if (
                        cvData.publications.length >=
                        SECTION_LIMITS.publications
                      )
                        return;
                      setCvData({
                        ...cvData,
                        publications: [
                          ...cvData.publications,
                          {
                            id: `pub-${Date.now()}`,
                            title: "",
                            publisher: "",
                            year: "",
                          },
                        ],
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* HOBBIES & ACTIVITIES */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs">
              <TagManager
                title="Hobbies & Activities"
                placeholder="Add hobby (e.g. Chess, Video Editing)"
                isOn={cvData.visibility.hobbies}
                onToggle={() => toggleVisibility("hobbies")}
                items={cvData.hobbies}
                maxLimit={SECTION_LIMITS.hobbies}
                inputVal={hobbyInput}
                setInputVal={setHobbyInput}
                onAdd={() =>
                  addTag(
                    "hobbies",
                    hobbyInput,
                    setHobbyInput,
                    SECTION_LIMITS.hobbies,
                  )
                }
                onRemove={(item) =>
                  setCvData({
                    ...cvData,
                    hobbies: cvData.hobbies.filter((h) => h !== item),
                  })
                }
              />
            </div>

            {/* REFERENCES */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs space-y-2">
              <SectionToggle
                title="References"
                isOn={cvData.visibility.references}
                onToggle={() => toggleVisibility("references")}
              />
              {cvData.visibility.references && (
                <div className="space-y-2.5">
                  {cvData.references.map((ref, idx) => (
                    <div
                      key={ref.id}
                      className="p-2.5 sm:p-0 bg-neutral-50 sm:bg-transparent border sm:border-0 border-neutral-200 rounded-xs grid grid-cols-1 sm:grid-cols-3 gap-2"
                    >
                      <input
                        type="text"
                        maxLength={45}
                        placeholder="Name"
                        value={ref.name}
                        onChange={(e) => {
                          const updated = [...cvData.references];
                          updated[idx].name = e.target.value.slice(0, 45);
                          setCvData({ ...cvData, references: updated });
                        }}
                        className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                      />
                      <input
                        type="text"
                        maxLength={50}
                        placeholder="Role / Org"
                        value={ref.designation}
                        onChange={(e) => {
                          const updated = [...cvData.references];
                          updated[idx].designation = e.target.value.slice(
                            0,
                            50,
                          );
                          setCvData({ ...cvData, references: updated });
                        }}
                        className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                      />
                      <div className="flex gap-2 items-center min-w-0">
                        <input
                          type="text"
                          maxLength={50}
                          placeholder="Phone/Email"
                          value={ref.contact}
                          onChange={(e) => {
                            const updated = [...cvData.references];
                            updated[idx].contact = e.target.value.slice(0, 50);
                            setCvData({ ...cvData, references: updated });
                          }}
                          className="w-full min-w-0 border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              references: cvData.references.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <AddBtn
                    label="Add Reference"
                    currentCount={cvData.references.length}
                    maxLimit={SECTION_LIMITS.references}
                    onClick={() => {
                      if (cvData.references.length >= SECTION_LIMITS.references)
                        return;
                      setCvData({
                        ...cvData,
                        references: [
                          ...cvData.references,
                          {
                            id: `ref-${Date.now()}`,
                            name: "",
                            designation: "",
                            contact: "",
                          },
                        ],
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* PERSONAL DETAILS */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs space-y-2">
              <SectionToggle
                title="Personal Details"
                isOn={cvData.visibility.personalDetails}
                onToggle={() => toggleVisibility("personalDetails")}
              />
              {cvData.visibility.personalDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    maxLength={25}
                    placeholder="Date of Birth"
                    value={cvData.personalDetails.dob}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalDetails: {
                          ...cvData.personalDetails,
                          dob: e.target.value.slice(0, 25),
                        },
                      })
                    }
                    className="w-full min-w-0 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Gender"
                    value={cvData.personalDetails.gender}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalDetails: {
                          ...cvData.personalDetails,
                          gender: e.target.value.slice(0, 20),
                        },
                      })
                    }
                    className="w-full min-w-0 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="Nationality"
                    value={cvData.personalDetails.nationality}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalDetails: {
                          ...cvData.personalDetails,
                          nationality: e.target.value.slice(0, 30),
                        },
                      })
                    }
                    className="w-full min-w-0 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="Notice Period"
                    value={cvData.personalDetails.noticePeriod}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalDetails: {
                          ...cvData.personalDetails,
                          noticePeriod: e.target.value.slice(0, 30),
                        },
                      })
                    }
                    className="w-full min-w-0 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs"
                  />
                </div>
              )}
            </div>

            {/* CUSTOM SECTION & DECLARATION */}
            <div className="bg-white border border-neutral-300 p-3.5 rounded-xs space-y-3">
              <div className="space-y-2">
                <SectionToggle
                  title="Custom Section"
                  isOn={cvData.visibility.customSection}
                  onToggle={() => toggleVisibility("customSection")}
                />
                {cvData.visibility.customSection && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      maxLength={45}
                      placeholder="Section Heading"
                      value={cvData.customSectionTitle}
                      onChange={(e) =>
                        setCvData({
                          ...cvData,
                          customSectionTitle: e.target.value.slice(0, 45),
                        })
                      }
                      className="w-full min-w-0 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs"
                    />
                    <div className="space-y-1">
                      <textarea
                        rows={2}
                        maxLength={CHAR_LIMITS.customSectionContent}
                        placeholder="Details..."
                        value={cvData.customSectionContent}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            customSectionContent: e.target.value.slice(
                              0,
                              CHAR_LIMITS.customSectionContent,
                            ),
                          })
                        }
                        className="w-full border border-neutral-300 p-2 text-xs rounded-xs resize-none"
                      />
                      <HardLimitHint
                        current={cvData.customSectionContent.length}
                        max={CHAR_LIMITS.customSectionContent}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <SectionToggle
                  title="Declaration & Signature"
                  isOn={cvData.visibility.declaration}
                  onToggle={() => toggleVisibility("declaration")}
                />
                {cvData.visibility.declaration && (
                  <div className="space-y-1">
                    <textarea
                      rows={2}
                      maxLength={CHAR_LIMITS.declarationText}
                      value={cvData.declarationText}
                      onChange={(e) =>
                        setCvData({
                          ...cvData,
                          declarationText: e.target.value.slice(
                            0,
                            CHAR_LIMITS.declarationText,
                          ),
                        })
                      }
                      className="w-full border border-neutral-300 p-2 text-xs rounded-xs resize-none"
                    />
                    <HardLimitHint
                      current={cvData.declarationText.length}
                      max={CHAR_LIMITS.declarationText}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- ছোট হেল্পার কম্পোনেন্টগুলো ---

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2">
      <h2 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 truncate">
        {title}
      </h2>
    </div>
  );
}

function SectionToggle({
  title,
  isOn,
  onToggle,
}: {
  title: string;
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2">
      <h2 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 truncate">
        {title}
      </h2>
      <button
        type="button"
        onClick={onToggle}
        title={isOn ? "Click to hide from CV" : "Click to show in CV"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase border rounded-xs cursor-pointer transition-colors shrink-0 ${
          isOn
            ? "bg-neutral-100 border-neutral-300 text-neutral-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            : "bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold hover:bg-emerald-100"
        }`}
      >
        {isOn ? (
          <>
            <EyeOff className="h-3 w-3" />
            <span>Hide</span>
          </>
        ) : (
          <>
            <Eye className="h-3 w-3" />
            <span>Show</span>
          </>
        )}
      </button>
    </div>
  );
}

function MiniToggle({
  label,
  isOn,
  onToggle,
}: {
  label: string;
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-2 py-0.5 text-[10px] font-mono uppercase border rounded-xs cursor-pointer shrink-0 ${
        isOn
          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
          : "bg-neutral-100 border-neutral-300 text-neutral-500"
      }`}
    >
      {label}: {isOn ? "ON" : "OFF"}
    </button>
  );
}

function AddBtn({
  label,
  onClick,
  currentCount,
  maxLimit,
}: {
  label: string;
  onClick: () => void;
  currentCount: number;
  maxLimit: number;
}) {
  const isMaxed = currentCount >= maxLimit;

  return (
    <div className="flex items-center justify-between pt-1">
      <button
        type="button"
        disabled={isMaxed}
        onClick={onClick}
        className={`inline-flex items-center gap-1 text-xs font-mono ${
          isMaxed
            ? "text-neutral-400 cursor-not-allowed"
            : "text-neutral-800 hover:underline cursor-pointer"
        }`}
      >
        <Plus className="h-3.5 w-3.5" />
        <span>
          {isMaxed ? `Max Limit Reached (${maxLimit}/${maxLimit})` : label}
        </span>
      </button>
      <span
        className={`text-[10px] font-mono ${
          isMaxed ? "text-amber-700 font-semibold" : "text-neutral-400"
        }`}
      >
        {currentCount}/{maxLimit}
      </span>
    </div>
  );
}

function TagManager({
  title,
  placeholder,
  isOn,
  onToggle,
  items,
  maxLimit,
  inputVal,
  setInputVal,
  onAdd,
  onRemove,
}: {
  title: string;
  placeholder: string;
  isOn?: boolean;
  onToggle?: () => void;
  items: string[];
  maxLimit: number;
  inputVal: string;
  setInputVal: (v: string) => void;
  onAdd: () => void;
  onRemove: (item: string) => void;
}) {
  const showContent = isOn !== undefined ? isOn : true;
  const isMaxed = items.length >= maxLimit;

  return (
    <div className="space-y-2">
      {isOn !== undefined && onToggle ? (
        <SectionToggle title={title} isOn={isOn} onToggle={onToggle} />
      ) : (
        <SectionHeader title={title} />
      )}
      {showContent && (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={30}
              disabled={isMaxed}
              placeholder={
                isMaxed
                  ? `Limit reached (${maxLimit}/${maxLimit})`
                  : placeholder
              }
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.slice(0, 30))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAdd();
                }
              }}
              className="flex-1 min-w-0 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs disabled:bg-neutral-100 disabled:text-neutral-400"
            />
            <button
              type="button"
              disabled={isMaxed}
              onClick={onAdd}
              className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs cursor-pointer shrink-0 disabled:bg-neutral-400 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>
              {isMaxed ? "Maximum items added" : `Add up to ${maxLimit} items`}
            </span>
            <span className={isMaxed ? "text-amber-700 font-semibold" : ""}>
              {items.length}/{maxLimit}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-xs rounded-xs max-w-full"
              >
                <span className="truncate">{item}</span>
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  className="text-neutral-500 hover:text-red-600 cursor-pointer shrink-0"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
