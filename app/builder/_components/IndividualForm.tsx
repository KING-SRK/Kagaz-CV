// app/dashboard/builder/_components/IndividualForm.tsx
"use client";

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string;
  experienceTitle: string;
  experienceCompany: string;
  experienceDesc: string;
}

interface IndividualFormProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function IndividualForm({ data, setData }: IndividualFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* সেকশন হেডার */}
      <div className="border-b border-neutral-300 pb-3">
        <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-950 font-bold">
          Personal Information
        </h3>
        <p className="text-xs text-neutral-600 font-normal">
          Basic details for the document header.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
          />
        </div>

        {/* Professional Title */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Professional Title
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            placeholder="City, State, Country"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
          />
        </div>

        {/* Professional Summary */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Professional Summary
          </label>
          <textarea
            rows={3}
            name="bio"
            value={data.bio}
            onChange={handleChange}
            placeholder="Write a brief overview of your background, core strengths, and goals..."
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950 resize-none"
          />
        </div>
      </div>

      {/* স্কিলস সেকশন হেডার */}
      <div className="border-b border-neutral-300 pb-3 pt-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-950 font-bold">
          Skills & Experience
        </h3>
      </div>

      <div className="space-y-4">
        {/* Skills */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Skills (Comma separated)
          </label>
          <input
            type="text"
            name="skills"
            value={data.skills}
            onChange={handleChange}
            placeholder="React, Next.js, TypeScript, Tailwind CSS"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
          />
        </div>

        {/* Role & Company */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
              Role Title
            </label>
            <input
              type="text"
              name="experienceTitle"
              value={data.experienceTitle}
              onChange={handleChange}
              placeholder="e.g. Lead Designer"
              className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
              Company / Studio
            </label>
            <input
              type="text"
              name="experienceCompany"
              value={data.experienceCompany}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950"
            />
          </div>
        </div>

        {/* Experience Description */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Experience Description
          </label>
          <textarea
            rows={3}
            name="experienceDesc"
            value={data.experienceDesc}
            onChange={handleChange}
            placeholder="Key responsibilities, milestones, and technical achievements..."
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 font-normal placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-950 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
