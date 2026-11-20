// app/create-cv/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  CvData,
  CvSectionVisibility,
  CvTemplateType,
  EMPTY_CV_DATA,
  mapProfileToCvData,
} from "./types";
import CvPreview from "./components/CvPreview";

export default function CreateCvPage() {
  const [cvData, setCvData] = useState<CvData>(EMPTY_CV_DATA);
  const [template, setTemplate] = useState<CvTemplateType>("classic");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasSutraNetAccount, setHasSutraNetAccount] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  // লগইন করা থাকলে SutraNet প্রোফাইল থেকে অটো-ফিল করা
  const fetchSutraNetData = useCallback(async () => {
    const activeId =
      typeof window !== "undefined"
        ? localStorage.getItem("kagaz_active_id")
        : null;

    if (!activeId) {
      return { found: false, data: null };
    }

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        activeId,
      );
    const column = isUuid ? "id" : "kagaz_id";

    const { data, error } = await supabase
      .from("profiles")
      .select("*, profile_education(*)")
      .eq(column, activeId)
      .maybeSingle();

    if (!error && data) {
      return { found: true, data: data as Record<string, unknown> };
    }
    return { found: false, data: null };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchSutraNetData().then((res) => {
      if (!isMounted) return;
      if (res.found && res.data) {
        setHasSutraNetAccount(true);
        setCvData(mapProfileToCvData(res.data));
      } else {
        setHasSutraNetAccount(false);
      }
      setLoadingProfile(false);
    });

    return () => {
      isMounted = false;
    };
  }, [fetchSutraNetData]);

  // Reload Profile বাটনের জন্য হ্যান্ডলার
  const loadFromSutraNet = async () => {
    setLoadingProfile(true);
    const res = await fetchSutraNetData();
    if (res.found && res.data) {
      setHasSutraNetAccount(true);
      setCvData(mapProfileToCvData(res.data));
    }
    setLoadingProfile(false);
  };

  // সেকশন টগল সুইচ
  const toggleVisibility = (key: keyof CvSectionVisibility) => {
    setCvData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: !prev.visibility[key],
      },
    }));
  };

  // প্রিন্ট / PDF ডাউনলোড
  const handlePrintPdf = () => {
    window.print();
  };

  // স্কিল ও ভাষা যোগ করা
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || cvData.skills.includes(trimmed)) return;
    setCvData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput("");
  };

  const addLanguage = () => {
    const trimmed = langInput.trim();
    if (!trimmed || cvData.languages.includes(trimmed)) return;
    setCvData((prev) => ({
      ...prev,
      languages: [...prev.languages, trimmed],
    }));
    setLangInput("");
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col">
      {/* প্রিন্ট করার সময় শুধু A4 সিভিটাই বেরোনোর জন্য স্পেশাল স্টাইল */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-printable-area,
          #cv-printable-area * {
            visibility: visible;
          }
          #cv-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 12mm;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* TOP TOOLBAR */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-300 px-4 py-3 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={hasSutraNetAccount ? "/dashboard/individual" : "/"}
              className="p-2 border border-neutral-300 rounded-xs hover:bg-neutral-100 text-neutral-700"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-serif font-bold text-neutral-950">
                  SutraNet Smart CV Builder
                </h1>
                {hasSutraNetAccount ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono uppercase rounded-xs">
                    <UserCheck className="h-3 w-3" />
                    <span>Auto-Synced</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-600 text-[10px] font-mono uppercase rounded-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>Guest Mode</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 hidden sm:block">
                Customize sections, toggle visibility &amp; export ATS-ready PDF
              </p>
            </div>
          </div>

          {/* টেমপ্লেট সুইচার ও অ্যাকশন বাটন */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Template Switcher */}
            <div className="flex items-center border border-neutral-300 rounded-xs overflow-hidden bg-neutral-50">
              {(["classic", "modern", "mono"] as CvTemplateType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTemplate(t)}
                  className={`px-2.5 py-1.5 text-[10px] font-mono uppercase cursor-pointer transition-colors ${
                    template === t
                      ? "bg-neutral-900 text-white font-bold"
                      : "text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {hasSutraNetAccount && (
              <button
                type="button"
                onClick={loadFromSutraNet}
                title="Reload original data from SutraNet profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 bg-white text-[11px] font-mono uppercase text-neutral-800 hover:bg-neutral-100 rounded-xs cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Reload Profile</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-neutral-950 text-white text-[11px] font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* মোবাইল ভিউ সুইচার */}
        <div className="flex lg:hidden mt-3 pt-2 border-t border-neutral-200 gap-2">
          <button
            type="button"
            onClick={() => setMobileView("editor")}
            className={`flex-1 py-1.5 text-xs font-mono uppercase rounded-xs border ${
              mobileView === "editor"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300"
            }`}
          >
            Edit &amp; Toggle
          </button>
          <button
            type="button"
            onClick={() => setMobileView("preview")}
            className={`flex-1 py-1.5 text-xs font-mono uppercase rounded-xs border ${
              mobileView === "preview"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300"
            }`}
          >
            Live CV Preview
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE: LEFT EDITOR + RIGHT LIVE PREVIEW */}
      {loadingProfile ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
          <p className="text-xs font-mono uppercase text-neutral-500">
            Preparing CV Workspace...
          </p>
        </div>
      ) : (
        <div className="max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: EDITOR & SECTION TOGGLES */}
          <div
            className={`lg:col-span-5 space-y-5 print:hidden ${
              mobileView === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* ১. BASIC IDENTITY */}
            <div className="bg-white border border-neutral-300 p-4 rounded-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                  1. Header &amp; Contact
                </h2>
                <div className="flex items-center gap-2">
                  {cvData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => toggleVisibility("photo")}
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase border rounded-xs cursor-pointer ${
                        cvData.visibility.photo
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-neutral-100 border-neutral-300 text-neutral-500"
                      }`}
                    >
                      Photo: {cvData.visibility.photo ? "ON" : "OFF"}
                    </button>
                  )}
                  {cvData.kagazId && (
                    <button
                      type="button"
                      onClick={() => toggleVisibility("sutraNetBadge")}
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase border rounded-xs cursor-pointer ${
                        cvData.visibility.sutraNetBadge
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-neutral-100 border-neutral-300 text-neutral-500"
                      }`}
                    >
                      ID Badge: {cvData.visibility.sutraNetBadge ? "ON" : "OFF"}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={cvData.fullName}
                  onChange={(e) =>
                    setCvData({ ...cvData, fullName: e.target.value })
                  }
                  className="border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
                />
                <input
                  type="text"
                  placeholder="Professional Title (e.g. Web Developer)"
                  value={cvData.title}
                  onChange={(e) =>
                    setCvData({ ...cvData, title: e.target.value })
                  }
                  className="border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={cvData.email}
                  onChange={(e) =>
                    setCvData({ ...cvData, email: e.target.value })
                  }
                  className="border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={cvData.phone}
                  onChange={(e) =>
                    setCvData({ ...cvData, phone: e.target.value })
                  }
                  className="border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
                />
                <input
                  type="text"
                  placeholder="Location (City, State)"
                  value={cvData.location}
                  onChange={(e) =>
                    setCvData({ ...cvData, location: e.target.value })
                  }
                  className="sm:col-span-2 border border-neutral-300 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* ২. SUMMARY */}
            <div className="bg-white border border-neutral-300 p-4 rounded-xs space-y-2.5">
              <SectionHeaderToggle
                title="2. Professional Summary"
                isOn={cvData.visibility.summary}
                onToggle={() => toggleVisibility("summary")}
              />
              {cvData.visibility.summary && (
                <textarea
                  rows={3}
                  placeholder="Write a concise summary about your background and strengths..."
                  value={cvData.summary}
                  onChange={(e) =>
                    setCvData({ ...cvData, summary: e.target.value })
                  }
                  className="w-full border border-neutral-300 p-2.5 text-xs rounded-xs focus:outline-none focus:border-neutral-900"
                />
              )}
            </div>

            {/* ৩. WORK EXPERIENCE */}
            <div className="bg-white border border-neutral-300 p-4 rounded-xs space-y-3">
              <SectionHeaderToggle
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
                            experience: cvData.experience.filter(
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                        className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-5">
                        <input
                          type="text"
                          placeholder="Role / Designation"
                          value={exp.designation}
                          onChange={(e) => {
                            const updated = [...cvData.experience];
                            updated[idx].designation = e.target.value;
                            setCvData({ ...cvData, experience: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...cvData.experience];
                            updated[idx].company = e.target.value;
                            setCvData({ ...cvData, experience: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="Start (e.g. Jul 2025)"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = [...cvData.experience];
                            updated[idx].startDate = e.target.value;
                            setCvData({ ...cvData, experience: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="End (or Present)"
                          value={exp.isCurrent ? "Present" : exp.endDate}
                          onChange={(e) => {
                            const updated = [...cvData.experience];
                            updated[idx].isCurrent = false;
                            updated[idx].endDate = e.target.value;
                            setCvData({ ...cvData, experience: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Key responsibilities & achievements..."
                        value={exp.responsibilities}
                        onChange={(e) => {
                          const updated = [...cvData.experience];
                          updated[idx].responsibilities = e.target.value;
                          setCvData({ ...cvData, experience: updated });
                        }}
                        className="w-full border border-neutral-300 bg-white p-2 text-xs rounded-xs"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
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
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-mono text-neutral-800 hover:underline cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>
              )}
            </div>

            {/* ৪. PROJECTS */}
            <div className="bg-white border border-neutral-300 p-4 rounded-xs space-y-3">
              <SectionHeaderToggle
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
                            projects: cvData.projects.filter(
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                        className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-5">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...cvData.projects];
                            updated[idx].title = e.target.value;
                            setCvData({ ...cvData, projects: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="Tech Stack (e.g. Next.js, Supabase)"
                          value={proj.technologies}
                          onChange={(e) => {
                            const updated = [...cvData.projects];
                            updated[idx].technologies = e.target.value;
                            setCvData({ ...cvData, projects: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Short description of what you built..."
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx].description = e.target.value;
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className="w-full border border-neutral-300 bg-white p-2 text-xs rounded-xs"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
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
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-mono text-neutral-800 hover:underline cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
              )}
            </div>

            {/* ৫. EDUCATION */}
            <div className="bg-white border border-neutral-300 p-4 rounded-xs space-y-3">
              <SectionHeaderToggle
                title="5. Education"
                isOn={cvData.visibility.education}
                onToggle={() => toggleVisibility("education")}
              />
              {cvData.visibility.education && (
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
                            education: cvData.education.filter(
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                        className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-5">
                        <input
                          type="text"
                          placeholder="Degree / Class (e.g. B.A. / HS)"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...cvData.education];
                            updated[idx].degree = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="School / College Name"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...cvData.education];
                            updated[idx].institution = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="Start Year"
                          value={edu.startYear}
                          onChange={(e) => {
                            const updated = [...cvData.education];
                            updated[idx].startYear = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                        <input
                          type="text"
                          placeholder="End Year"
                          value={edu.endYear}
                          onChange={(e) => {
                            const updated = [...cvData.education];
                            updated[idx].endYear = e.target.value;
                            setCvData({ ...cvData, education: updated });
                          }}
                          className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs rounded-xs"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
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
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-mono text-neutral-800 hover:underline cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Education</span>
                  </button>
                </div>
              )}
            </div>

            {/* ৬. SKILLS & LANGUAGES */}
            <div className="bg-white border border-neutral-300 p-4 rounded-xs space-y-4">
              {/* Skills */}
              <div className="space-y-2">
                <SectionHeaderToggle
                  title="6. Skills"
                  isOn={cvData.visibility.skills}
                  onToggle={() => toggleVisibility("skills")}
                />
                {cvData.visibility.skills && (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a skill (press Enter)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        className="flex-1 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cvData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-xs rounded-xs"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setCvData({
                                ...cvData,
                                skills: cvData.skills.filter(
                                  (s) => s !== skill,
                                ),
                              })
                            }
                            className="text-neutral-500 hover:text-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Languages */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <SectionHeaderToggle
                  title="7. Languages"
                  isOn={cvData.visibility.languages}
                  onToggle={() => toggleVisibility("languages")}
                />
                {cvData.visibility.languages && (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add language (e.g. Bengali, English)"
                        value={langInput}
                        onChange={(e) => setLangInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addLanguage();
                          }
                        }}
                        className="flex-1 border border-neutral-300 px-2.5 py-1.5 text-xs rounded-xs"
                      />
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cvData.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-xs rounded-xs"
                        >
                          <span>{lang}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setCvData({
                                ...cvData,
                                languages: cvData.languages.filter(
                                  (l) => l !== lang,
                                ),
                              })
                            }
                            className="text-neutral-500 hover:text-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: LIVE A4 PAPER PREVIEW */}
          <div
            className={`lg:col-span-7 overflow-x-auto ${
              mobileView === "editor" ? "hidden lg:block" : "block"
            }`}
          >
            <CvPreview data={cvData} template={template} />
          </div>
        </div>
      )}
    </div>
  );
}

// সেকশন হেডার ও অন/অফ টগল কম্পোনেন্ট
function SectionHeaderToggle({
  title,
  isOn,
  onToggle,
}: {
  title: string;
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
        {title}
      </h2>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase border rounded-xs cursor-pointer transition-colors ${
          isOn
            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
            : "bg-neutral-100 border-neutral-300 text-neutral-500"
        }`}
      >
        {isOn ? (
          <>
            <Eye className="h-3 w-3" />
            <span>Visible</span>
          </>
        ) : (
          <>
            <EyeOff className="h-3 w-3" />
            <span>Hidden</span>
          </>
        )}
      </button>
    </div>
  );
}
