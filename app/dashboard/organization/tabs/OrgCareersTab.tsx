// app/dashboard/organization/tabs/OrgCareersTab.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Trash2,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
  Loader2,
  CheckCircle2,
  X,
  Pencil,
} from "lucide-react";
import {
  CompanyJob,
  JobApplication,
  getCompanyJobs,
  saveCompanyJob,
  deleteCompanyJob,
  getJobApplications,
  updateApplicationStatus,
} from "@/lib/jobService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import {
  JOB_CATEGORIES,
  TEAM_DEPARTMENTS,
  EXPERIENCE_LEVELS,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  APPLICATION_METHODS,
  VACANCY_STATUSES,
  formatOtherDisplay,
} from "@/constants/orgOptions";

interface Props {
  companyId: string;
  kagazId: string;
}

export default function OrgCareersTab({ companyId, kagazId }: Props) {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  const [reviewingJob, setReviewingJob] = useState<CompanyJob | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const emptyJob: CompanyJob = {
    company_id: companyId,
    kagaz_id: kagazId,
    job_title: "",
    department: "",
    job_category: "",
    job_description: "",
    required_skills: [],
    education_qualification: "",
    experience_level: "Fresher",
    employment_type: "Full-time",
    salary_range: "",
    work_location: "",
    work_mode: "On-site",
    openings: 1,
    deadline: "",
    contact_person: "",
    application_method: "SutraNet Application",
    external_apply_url: "",
    status: "Open",
  };

  const [formData, setFormData] = useState<CompanyJob>(emptyJob);

  const refreshJobs = async () => {
    if (!companyId) return;
    const { data } = await getCompanyJobs(companyId);
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    if (!companyId) return;

    getCompanyJobs(companyId).then(({ data }) => {
      if (isMounted) {
        setJobs(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const handleOpenCreate = () => {
    setFormData(emptyJob);
    setSkillsInput("");
    setShowForm(true);
  };

  const handleOpenEdit = (job: CompanyJob) => {
    setFormData(job);
    setSkillsInput((job.required_skills || []).join(", "));
    setShowForm(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.job_title.trim()) return;

    setSaving(true);
    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await saveCompanyJob({
      ...formData,
      company_id: companyId,
      kagaz_id: kagazId,
      required_skills: parsedSkills,
    });

    setSaving(false);
    if (!error) {
      setShowForm(false);
      await refreshJobs();
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteCompanyJob(id);
    await refreshJobs();
  };

  const handleOpenApplicants = async (job: CompanyJob) => {
    if (!job.id) return;
    setReviewingJob(job);
    setLoadingApps(true);
    const { data } = await getJobApplications(job.id);
    setApplications(data);
    setLoadingApps(false);
  };

  const handleStatusChange = async (
    appId: string,
    newStatus: JobApplication["status"],
  ) => {
    await updateApplicationStatus(appId, newStatus);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
    );
  };

  if (loading) {
    return (
      <div className="py-10 flex flex-col items-center justify-center gap-2 text-neutral-500 font-mono text-xs">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading careers & vacancies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      {/* হেডার */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-800 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              Careers & Job Vacancies ({jobs.length})
            </span>
          </span>
          <p className="text-[11px] font-sans text-neutral-500 mt-0.5">
            Publish open positions and review consent-verified applications from
            SutraNet candidates.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-2 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Post New Vacancy
          </button>
        )}
      </div>

      {/* ================= ভ্যাকেন্সি পোস্ট / এডিট ফর্ম ================= */}
      {showForm && (
        <form
          onSubmit={handleSaveJob}
          className="p-4 sm:p-5 bg-neutral-50/80 border border-neutral-300 rounded-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
            <span className="text-xs font-mono uppercase font-bold text-neutral-900">
              {formData.id ? "Edit Job Vacancy" : "Publish New Job Vacancy"}
            </span>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* রো ১: Job Title, Department, Job Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
            <FormInput
              label="Job Title"
              required
              value={formData.job_title}
              onChange={(val) => setFormData({ ...formData, job_title: val })}
              placeholder="Enter job position title"
            />

            <FormSelectWithOther
              label="Department"
              value={formData.department}
              options={TEAM_DEPARTMENTS}
              placeholder="Select department"
              otherPlaceholder="Enter custom department"
              onChange={(val) => setFormData({ ...formData, department: val })}
            />

            <FormSelectWithOther
              label="Job Category"
              value={formData.job_category}
              options={JOB_CATEGORIES}
              placeholder="Select job category"
              otherPlaceholder="Enter custom job category"
              onChange={(val) =>
                setFormData({ ...formData, job_category: val })
              }
            />
          </div>

          {/* রো ২: Experience Level, Employment Type, Work Mode, Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Experience Level
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) =>
                  setFormData({ ...formData, experience_level: e.target.value })
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono rounded-xs cursor-pointer"
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Employment Type
              </label>
              <select
                value={formData.employment_type}
                onChange={(e) =>
                  setFormData({ ...formData, employment_type: e.target.value })
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono rounded-xs cursor-pointer"
              >
                {EMPLOYMENT_TYPES.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Work Mode
              </label>
              <select
                value={formData.work_mode}
                onChange={(e) =>
                  setFormData({ ...formData, work_mode: e.target.value })
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono rounded-xs cursor-pointer"
              >
                {WORK_MODES.map((wm) => (
                  <option key={wm} value={wm}>
                    {wm}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Salary Range (Optional)"
              value={formData.salary_range}
              onChange={(val) =>
                setFormData({ ...formData, salary_range: val })
              }
              placeholder="Enter salary range (e.g. 15k - 25k/mo)"
            />
          </div>

          {/* রো ৩: Educational Qualification, Required Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Educational Qualification"
              value={formData.education_qualification}
              onChange={(val) =>
                setFormData({ ...formData, education_qualification: val })
              }
              placeholder="Enter minimum qualification"
            />

            <FormInput
              label="Required Skills (Comma separated)"
              value={skillsInput}
              onChange={setSkillsInput}
              placeholder="Enter required skills (e.g. React, Next.js, SQL)"
            />
          </div>

          {/* রো ৪: Work Location, Openings, Deadline, Contact Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FormInput
              label="Work Location (City, State)"
              value={formData.work_location}
              onChange={(val) =>
                setFormData({ ...formData, work_location: val })
              }
              placeholder="Enter work city and state"
            />

            <FormInput
              label="Number of Openings"
              type="number"
              min="1"
              value={String(formData.openings)}
              onChange={(val) =>
                setFormData({ ...formData, openings: Number(val) || 1 })
              }
              placeholder="Enter vacancy count"
            />

            <FormInput
              label="Application Deadline"
              type="date"
              value={formData.deadline}
              onChange={(val) => setFormData({ ...formData, deadline: val })}
            />

            <FormInput
              label="Contact Person (HR / Recruiter)"
              value={formData.contact_person}
              onChange={(val) =>
                setFormData({ ...formData, contact_person: val })
              }
              placeholder="Enter HR or recruiter name"
            />
          </div>

          {/* রো ৫: Application Method, External Link & Vacancy Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Application Method
              </label>
              <select
                value={formData.application_method}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    application_method: e.target.value as
                      | "SutraNet Application"
                      | "External Link",
                  })
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono rounded-xs cursor-pointer"
              >
                {APPLICATION_METHODS.map((am) => (
                  <option key={am} value={am}>
                    {am}
                  </option>
                ))}
              </select>
            </div>

            {formData.application_method === "External Link" && (
              <FormInput
                label="External Application URL"
                type="url"
                required
                value={formData.external_apply_url || ""}
                onChange={(val) =>
                  setFormData({ ...formData, external_apply_url: val })
                }
                placeholder="Enter external application URL"
              />
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Vacancy Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Open" | "Paused" | "Closed",
                  })
                }
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono rounded-xs cursor-pointer"
              >
                {VACANCY_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* রো ৬: Job Description */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Job Description & Responsibilities
            </label>
            <textarea
              rows={3}
              value={formData.job_description}
              onChange={(e) =>
                setFormData({ ...formData, job_description: e.target.value })
              }
              placeholder="Enter detailed role responsibilities and expectations"
              className="w-full border border-neutral-200 bg-white p-3 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-neutral-300 bg-white text-xs font-mono uppercase rounded-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase rounded-xs cursor-pointer transition-colors"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              <span>{saving ? "Publishing..." : "Publish Vacancy"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================= প্রকাশিত জব লিস্ট ================= */}
      {jobs.length === 0 && !showForm ? (
        <div className="p-8 text-center border border-dashed border-neutral-200 rounded-xs">
          <p className="text-xs font-mono text-neutral-400">
            No job vacancies published yet. Click &quot;Post New Vacancy&quot;
            to start hiring.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-3 sm:p-4 bg-neutral-50/70 border border-neutral-200 rounded-xs space-y-3 min-w-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-serif font-bold text-neutral-950 truncate">
                      {job.job_title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs border shrink-0 ${
                        job.status === "Open"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : job.status === "Paused"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {job.status}
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs shrink-0">
                      {job.employment_type} • {job.work_mode}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] font-mono text-neutral-500 mt-1.5">
                    {job.department && (
                      <span className="truncate">
                        Dept: {formatOtherDisplay(job.department)}
                      </span>
                    )}
                    {job.work_location && (
                      <span className="inline-flex items-center gap-1 shrink-0">
                        <MapPin className="h-3 w-3 shrink-0" />{" "}
                        {job.work_location}
                      </span>
                    )}
                    <span className="shrink-0">Openings: {job.openings}</span>
                    {job.deadline && (
                      <span className="inline-flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3 shrink-0" /> Deadline:{" "}
                        {job.deadline}
                      </span>
                    )}
                  </div>
                </div>

                {/* অ্যাকশন বাটনসমূহ */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {job.application_method === "SutraNet Application" && (
                    <button
                      type="button"
                      onClick={() => handleOpenApplicants(job)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] sm:text-[10.5px] font-mono uppercase rounded-xs cursor-pointer transition-colors"
                    >
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>Review Applicants</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(job)}
                    title="Edit Vacancy"
                    className="p-1.5 border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 rounded-xs cursor-pointer transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(job.id)}
                    title="Delete Vacancy"
                    className="p-1.5 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-xs cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {(job.required_skills || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= ক্যান্ডিডেট অ্যাপ্লিকেশন রিভিউ ড্রয়ার / প্যানেল ================= */}
      {reviewingJob && (
        <div className="p-4 sm:p-5 bg-white border-2 border-neutral-900 rounded-xs space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">
                Consent-Authorized Candidate Applications
              </span>
              <h4 className="text-sm sm:text-base font-serif font-bold text-neutral-950 truncate">
                Applicants for: {reviewingJob.job_title}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setReviewingJob(null)}
              className="p-1.5 border border-neutral-200 hover:bg-neutral-100 rounded-xs cursor-pointer shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {loadingApps ? (
            <div className="py-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-600" />
            </div>
          ) : applications.length === 0 ? (
            <p className="text-xs font-mono text-neutral-500 py-4 text-center">
              No SutraNet applications received for this vacancy yet.
            </p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 sm:p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2.5 min-w-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-neutral-950 truncate">
                          {app.applicant_name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded-xs shrink-0">
                          ID: {app.applicant_kagaz_id}
                        </span>
                      </div>
                      {app.shared_snapshot?.title && (
                        <p className="text-xs font-mono text-neutral-600 mt-0.5 truncate">
                          {app.shared_snapshot.title}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Link
                        href={`/p/${app.applicant_kagaz_id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-neutral-300 text-[10px] font-mono uppercase rounded-xs hover:bg-neutral-100 transition-colors"
                      >
                        <span>Public Profile</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      </Link>

                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(
                            app.id,
                            e.target.value as JobApplication["status"],
                          )
                        }
                        className="border border-neutral-300 bg-white px-2.5 py-1.5 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* ক্যান্ডিডেট যে তথ্যগুলো শেয়ার করার অনুমতি দিয়েছে */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                    {app.shared_snapshot?.email && (
                      <div className="p-2 bg-white border border-neutral-200/80 rounded-xs truncate min-w-0">
                        <span className="text-[9px] text-neutral-400 block">
                          Shared Email
                        </span>
                        <span className="truncate block">
                          {app.shared_snapshot.email}
                        </span>
                      </div>
                    )}
                    {app.shared_snapshot?.phone && (
                      <div className="p-2 bg-white border border-neutral-200/80 rounded-xs truncate min-w-0">
                        <span className="text-[9px] text-neutral-400 block">
                          Shared Phone
                        </span>
                        <span className="truncate block">
                          {app.shared_snapshot.phone}
                        </span>
                      </div>
                    )}
                    {app.shared_snapshot?.location && (
                      <div className="p-2 bg-white border border-neutral-200/80 rounded-xs truncate min-w-0">
                        <span className="text-[9px] text-neutral-400 block">
                          Shared Location
                        </span>
                        <span className="truncate block">
                          {app.shared_snapshot.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {app.cover_note && (
                    <p className="text-xs font-sans text-neutral-700 bg-white p-2.5 border border-neutral-200/80 rounded-xs wrap-break-word">
                      <span className="font-mono text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                        Applicant Note
                      </span>
                      {app.cover_note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
