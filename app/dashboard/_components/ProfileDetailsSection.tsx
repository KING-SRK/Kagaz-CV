// app/dashboard/_components/ProfileDetailsSection.tsx
"use client";

import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Wrench,
  ShieldCheck,
  ChevronDown,
  Save,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export default function ProfileDetailsSection() {
  const [activeId, setActiveId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // কোন সেকশনটি বর্তমানে ওপেন আছে (accordion active item)
  const [openSection, setOpenSection] = useState<string>("about");

  // ১. About
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");

  // ২. Location
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  // ৩. Education
  const [educationList, setEducationList] = useState<EducationItem[]>([
    { degree: "", institution: "", year: "", grade: "" },
  ]);

  // ৪. Skills
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");

  // ৫. Govt ID Badge
  const [govtDocType, setGovtDocType] = useState("Aadhaar");
  const [govtDocLast4, setGovtDocLast4] = useState("");

  useEffect(() => {
    async function loadData() {
      // ক্লায়েন্ট ব্রাউজারে localStorage থেকে রিড
      const id = localStorage.getItem("kagaz_active_id");
      if (!id) {
        setLoading(false);
        return;
      }

      // অ্যাসিনক্রোনাস ফাংশনের ভেতর কল করলে লিন্টার এরর আসবে না
      setActiveId(id);

      const { data } = await supabase
        .from("profiles")
        .select("bio, qr_data")
        .eq("kagaz_id", id)
        .maybeSingle();

      if (data) {
        setBio(data.bio || "");
        const qr = data.qr_data || {};
        setHeadline(qr.headline || qr.title || "");
        setWebsite(qr.website || "");
        setGithub(qr.github || "");
        setCity(qr.city || "");
        setStateName(qr.stateName || "");
        setPincode(qr.pincode || "");
        setFullAddress(qr.address || "");
        if (
          qr.education &&
          Array.isArray(qr.education) &&
          qr.education.length > 0
        ) {
          setEducationList(qr.education);
        }
        setSkills(qr.skills || "");
        setExperienceLevel(qr.experienceLevel || "Intermediate");
        setGovtDocType(qr.govtDocType || "Aadhaar");
        setGovtDocLast4(qr.govtDocLast4 || "");
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const toggleSection = (sectionName: string) => {
    setOpenSection(openSection === sectionName ? "" : sectionName);
  };

  // এডুকেশন হ্যান্ডলার
  const addEducation = () => {
    setEducationList((prev) => [
      ...prev,
      { degree: "", institution: "", year: "", grade: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationItem,
    val: string,
  ) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

  // সম্পূর্ণ ডেটা সেভ
  const handleSave = async () => {
    if (!activeId) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { data: current } = await supabase
        .from("profiles")
        .select("qr_data")
        .eq("kagaz_id", activeId)
        .maybeSingle();

      const existingQr = current?.qr_data || {};

      const updatedQr = {
        ...existingQr,
        headline,
        website,
        github,
        city,
        stateName,
        pincode,
        address: fullAddress,
        education: educationList,
        skills,
        experienceLevel,
        govtDocType,
        govtDocLast4,
      };

      const { error } = await supabase
        .from("profiles")
        .update({
          bio,
          qr_data: updatedQr,
        })
        .eq("kagaz_id", activeId);

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save dossier details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200/80 p-6 h-60 animate-pulse rounded" />
    );
  }

  return (
    <div className="space-y-4">
      {/* অ্যাকর্ডিয়ন প্যানেল হেডার ও গ্লোবাল সেভ বাটন */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200/80 px-6 py-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-semibold block">
            Profile Record Center
          </span>
          <h2 className="text-lg font-serif text-neutral-950">
            Identity Dossier & Comprehensive Details
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {saveSuccess ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>All Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? "Saving..." : "Save All Changes"}</span>
            </>
          )}
        </button>
      </div>

      {/* অ্যাকর্ডিয়ন গ্রুপ */}
      <div className="space-y-2.5">
        {/* ১. ABOUT SECTION */}
        <div className="border border-neutral-200/80 bg-white shadow-xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection("about")}
            className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50/70"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center bg-neutral-100 rounded text-neutral-800">
                <User className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950">
                  1. About & Professional Overview
                </h3>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${openSection === "about" ? "rotate-180 text-neutral-950" : ""}`}
            />
          </button>

          {openSection === "about" && (
            <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Professional Headline / Title
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full-Stack Web Developer & Co-Founder"
                  className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  About / Bio (Who you are)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your professional story, goals, and core philosophy..."
                  className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Portfolio / Website Link
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    GitHub / Social URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ২. LOCATION & ADDRESS */}
        <div className="border border-neutral-200/80 bg-white shadow-xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection("location")}
            className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50/70"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center bg-neutral-100 rounded text-neutral-800">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950">
                  2. Location & Residential Address
                </h3>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${openSection === "location" ? "rotate-180 text-neutral-950" : ""}`}
            />
          </button>

          {openSection === "location" && (
            <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kolkata"
                    className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. West Bengal"
                    className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    PIN / Postal Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 700014"
                    className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="e.g. 24 Quarters Road, Factory Complex, Sealdah"
                  className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* ৩. EDUCATION */}
        <div className="border border-neutral-200/80 bg-white shadow-xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection("education")}
            className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50/70"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center bg-neutral-100 rounded text-neutral-800">
                <GraduationCap className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950">
                  3. Academic & Educational History
                </h3>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${openSection === "education" ? "rotate-180 text-neutral-950" : ""}`}
            />
          </button>

          {openSection === "education" && (
            <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-neutral-700 hover:text-neutral-950 bg-neutral-100 px-3 py-1.5 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Qualification
                </button>
              </div>

              <div className="space-y-3">
                {educationList.map((edu, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-3 items-end p-3.5 bg-neutral-50/60 border border-neutral-200/80"
                  >
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        Degree / Standard
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(idx, "degree", e.target.value)
                        }
                        placeholder="e.g. B.Sc Undergraduate"
                        className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            idx,
                            "institution",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. College in Sealdah"
                        className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                      />
                    </div>

                    <div className="w-full md:w-32">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        Session / Year
                      </label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) =>
                          handleEducationChange(idx, "year", e.target.value)
                        }
                        placeholder="2023 - 2026"
                        className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                      />
                    </div>

                    {educationList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ৪. SKILLS */}
        <div className="border border-neutral-200/80 bg-white shadow-xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection("skills")}
            className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50/70"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center bg-neutral-100 rounded text-neutral-800">
                <Wrench className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950">
                  4. Skills, Stack & Expertise
                </h3>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${openSection === "skills" ? "rotate-180 text-neutral-950" : ""}`}
            />
          </button>

          {openSection === "skills" && (
            <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Proficiency Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Next.js, React, Tailwind CSS, TypeScript, Supabase, Electronics Repair"
                  className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Overall Seniority / Experience Tier
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                >
                  <option value="Beginner / Fresher">
                    Beginner / Entry Level
                  </option>
                  <option value="Intermediate">
                    Intermediate Practitioner
                  </option>
                  <option value="Advanced / Lead">
                    Advanced / Professional Lead
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ৫. GOVT VERIFICATION */}
        <div className="border border-neutral-200/80 bg-white shadow-xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection("govt")}
            className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50/70"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center bg-neutral-100 rounded text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950">
                  5. Government ID Verification (Masked Privacy Badge)
                </h3>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${openSection === "govt" ? "rotate-180 text-neutral-950" : ""}`}
            />
          </button>

          {openSection === "govt" && (
            <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Select Document
                  </label>
                  <select
                    value={govtDocType}
                    onChange={(e) => setGovtDocType(e.target.value)}
                    className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  >
                    <option value="Aadhaar">Aadhaar (UIDAI)</option>
                    <option value="PAN">PAN (Income Tax Dept)</option>
                    <option value="Voter ID">Voter ID (ECI)</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Last 4 Digits Only
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={govtDocLast4}
                    onChange={(e) =>
                      setGovtDocLast4(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="e.g. 4321"
                    className="w-full border border-neutral-200 bg-neutral-50/40 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 text-[11px] font-mono text-neutral-600">
                🔒 <strong>Privacy Assurance:</strong> SutraNet সম্পূর্ণ সরকারি
                আইডি নম্বর স্টোর করে না। এটি শুধুমাত্র প্রোফাইলে ভেরিফায়েড
                ব্যাজ হিসেবে{" "}
                <span className="font-semibold text-neutral-900">
                  {govtDocType} (•••• {govtDocLast4 || "XXXX"})
                </span>{" "}
                দেখাবে।
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
