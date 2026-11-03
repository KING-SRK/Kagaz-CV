// app/dashboard/_components/ProfileDetailsSection.tsx
"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Wrench,
  ShieldCheck,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react";

export default function ProfileDetailsSection() {
  const [activeTab, setActiveTab] = useState<string>("about");

  const sections = [
    { id: "about", title: "About & Bio", icon: User, status: "Completed" },
    { id: "location", title: "Location", icon: MapPin, status: "Completed" },
    {
      id: "education",
      title: "Education",
      icon: GraduationCap,
      status: "1 Added",
    },
    { id: "skills", title: "Expertise", icon: Wrench, status: "5 Skills" },
    { id: "vault", title: "Govt Vault", icon: ShieldCheck, status: "Masked" },
  ];

  return (
    <div className="border border-neutral-200/80 bg-white shadow-xs">
      {/* ১. সেকশন হেডার ও প্রগ্রেস */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 p-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-600 font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Comprehensive Identity Dossier
          </span>
          <h2 className="text-xl font-serif text-neutral-950 mt-1">
            Personal & Professional Records
          </h2>
        </div>

        {/* কমপ্লিশন প্রগ্রেস বার */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">
              Dossier Health
            </span>
            <span className="text-xs font-mono font-bold text-neutral-900">
              80% Ready
            </span>
          </div>
          <div className="h-2 w-24 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
            <div className="h-full w-4/5 bg-neutral-950 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-105">
        {/* ২. বাঁদিকের ট্যাব নেভিগেশন (Segmented List) */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-neutral-100 bg-neutral-50/40 p-3 space-y-1">
          {sections.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3.5 text-left transition-colors duration-150 rounded-xs cursor-pointer focus:outline-none focus-visible:outline-none border ${
                  isActive
                    ? "bg-white text-neutral-950 shadow-xs border-neutral-200/80 font-medium"
                    : "bg-transparent border-transparent text-neutral-500 hover:bg-neutral-100/60 hover:text-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded ${
                      isActive
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-200/60 text-neutral-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider block">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {item.status}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    isActive
                      ? "translate-x-0.5 text-neutral-950"
                      : "text-neutral-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ৩. ডানদিকের কনটেন্ট প্যানেল (Active Tab Content) */}
        <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
          {/* TAB 1: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-900 font-bold">
                  Professional Bio & Links
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Your core story shown on public passes and CV documents.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Designer & Researcher"
                    className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Bio Statement
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write a concise overview..."
                    className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      Portfolio URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://yourportfolio.com"
                      className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      GitHub Profile
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/username"
                      className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION */}
          {activeTab === "location" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-900 font-bold">
                  Residential & Postal Address
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Used for regional business directories and verified address
                  badges.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Kolkata"
                      className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="West Bengal"
                      className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      placeholder="700014"
                      className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Street / Factory Quarters
                  </label>
                  <input
                    type="text"
                    placeholder="Complete address line"
                    className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === "education" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-900 font-bold">
                    Educational Qualifications
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Academic records and college certificates.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-neutral-800 bg-neutral-100 px-3 py-1.5 hover:bg-neutral-200 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Standard
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-neutral-200/80 bg-neutral-50/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        Degree / Course
                      </span>
                      <input
                        type="text"
                        className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        College Name
                      </span>
                      <input
                        type="text"
                        className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>
                  <div className="w-40">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                      Academic Session
                    </span>
                    <input
                      type="text"
                      className="w-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-900 font-bold">
                  Skills & Technical Domains
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Interactive badges rendered on verified identity documents.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                    Tag Proficiencies (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "Next.js",
                    "React.js",
                    "Tailwind CSS",
                    "TypeScript",
                    "Supabase",
                    "Electronics Repair",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono rounded-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GOVT VAULT */}
          {activeTab === "vault" && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-900 font-bold">
                    Encrypted Identity Vault
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Personal records preserved for credential auto-fill.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
                  Private Session
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      National Document
                    </label>
                    <select className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white">
                      <option>Aadhaar (UIDAI)</option>
                      <option>PAN Card</option>
                      <option>Voter ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                      Full Identification Code
                    </label>
                    <input
                      type="text"
                      className="w-full border border-neutral-200 bg-neutral-50/30 px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 border border-neutral-200/80 text-[11px] font-mono text-neutral-500 leading-relaxed">
                  🔒 Records inside this vault are not exposed on public links.
                  Public viewers only verify authenticity via cryptographic ID
                  proof.
                </div>
              </div>
            </div>
          )}

          {/* বটম সেভ বার */}
          <div className="pt-8 border-t border-neutral-100 flex items-center justify-between mt-6">
            <span className="text-[11px] font-mono text-neutral-400">
              Changes auto-sync across your SutraNet Card & CVs.
            </span>
            <button
              type="button"
              className="bg-neutral-950 hover:bg-neutral-800 text-white px-6 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              Update Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
