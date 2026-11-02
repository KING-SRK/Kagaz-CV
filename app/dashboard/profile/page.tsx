// app/dashboard/profile/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Check,
  User,
  Briefcase,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface MasterProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  location: string;
  avatarUrl: string;
  bio: string;
  skills: string;
  experienceTitle: string;
  experienceCompany: string;
  experienceDesc: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const kagazId = useRef("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState<MasterProfile>({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    location: "",
    avatarUrl: "",
    bio: "",
    skills: "",
    experienceTitle: "",
    experienceCompany: "",
    experienceDesc: "",
  });

  useEffect(() => {
    const activeId = localStorage.getItem("kagaz_active_id");
    if (!activeId) {
      router.push("/auth?mode=login");
      return;
    }

    kagazId.current = activeId;

    async function loadData() {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, role, bio, qr_data")
        .eq("kagaz_id", activeId)
        .maybeSingle();

      if (data) {
        const extra = data.qr_data || {};
        setForm({
          fullName: data.full_name || "",
          title: extra.title || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: extra.dob || "",
          gender: extra.gender || "",
          location: extra.location || "",
          avatarUrl: extra.avatarUrl || "",
          bio: data.bio || extra.bio || "",
          skills: extra.skills || "",
          experienceTitle: extra.experienceTitle || "",
          experienceCompany: extra.experienceCompany || "",
          experienceDesc: extra.experienceDesc || "",
        });
      }
      setLoading(false);
    }

    loadData();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: form.fullName,
          phone: form.phone,
          bio: form.bio,
          qr_data: {
            title: form.title,
            dob: form.dob,
            gender: form.gender,
            location: form.location,
            avatarUrl: form.avatarUrl,
            skills: form.skills,
            experienceTitle: form.experienceTitle,
            experienceCompany: form.experienceCompany,
            experienceDesc: form.experienceDesc,
          },
        })
        .eq("kagaz_id", kagazId.current);

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save profile. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center font-mono text-xs text-neutral-500">
        Loading Master Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pb-20">
      {/* টপ ন্যাভবার */}
      <header className="h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Hub</span>
          </Link>
          <div className="h-4 w-px bg-neutral-200" />
          <span className="text-sm font-medium">SutraNet Master Profile</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-5 py-2 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {saveSuccess ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? "Saving..." : "Save Profile"}</span>
            </>
          )}
        </button>
      </header>

      {/* মূল ফর্ম কনটেইনার */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSave} className="space-y-10">
          {/* হেডিং */}
          <div className="border-b border-neutral-200 pb-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-semibold">
              Single Source of Truth
            </span>
            <h1 className="text-2xl font-serif text-neutral-950 mt-1">
              Personal & Professional Profile
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              This master data will reflect on your SutraNet Card and
              automatically populate any CV you generate.
            </p>
          </div>

          {/* ১. বেসিক আইডেন্টিটি */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-950 font-bold flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Core Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Joy Thayal"
                  className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Web Developer"
                  className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, State, Country"
                className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                About / Bio
              </label>
              <textarea
                rows={3}
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="A short summary of who you are and your passions..."
                className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 resize-none"
              />
            </div>
          </div>

          {/* ২. স্কিলস ও এক্সপেরিয়েন্স */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-950 font-bold flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5" /> Career & Expertise
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                Core Skills (Comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Next.js, TypeScript, Tailwind CSS, Supabase"
                className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                  Primary Role Title
                </label>
                <input
                  type="text"
                  name="experienceTitle"
                  value={form.experienceTitle}
                  onChange={handleChange}
                  placeholder="e.g. Lead Developer"
                  className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  name="experienceCompany"
                  value={form.experienceCompany}
                  onChange={handleChange}
                  placeholder="e.g. Grow Tech Agency"
                  className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 font-medium mb-1">
                Role Description / Achievements
              </label>
              <textarea
                rows={3}
                name="experienceDesc"
                value={form.experienceDesc}
                onChange={handleChange}
                placeholder="Highlight your responsibilities, projects, and impact..."
                className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 resize-none"
              />
            </div>
          </div>

          {/* বটম সেভ বাটন */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white px-6 py-3 text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>
                {saving ? "Saving Changes..." : "Save Master Profile"}
              </span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
