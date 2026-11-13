// lib/jobService.ts
import { supabase } from "@/lib/supabaseClient";

export interface CompanyJob {
  id?: string;
  company_id: string;
  kagaz_id: string;
  job_title: string;
  department: string;
  job_category: string;
  job_description: string;
  required_skills: string[];
  education_qualification: string;
  experience_level: string;
  employment_type: string;
  salary_range: string;
  work_location: string;
  work_mode: string;
  openings: number;
  deadline: string;
  contact_person: string;
  application_method: "SutraNet Application" | "External Link";
  external_apply_url?: string;
  status: "Open" | "Paused" | "Closed";
  created_at?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  company_id: string;
  applicant_profile_id: string;
  applicant_kagaz_id: string;
  applicant_name: string;
  shared_snapshot: {
    email?: string;
    phone?: string;
    title?: string;
    bio?: string;
    skills?: string[];
    education?: unknown[];
    location?: string;
  };
  cover_note?: string;
  status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
  applied_at: string;
}

// কোম্পানির সব ভ্যাকেন্সি লোড করা
export async function getCompanyJobs(companyId: string) {
  const { data, error } = await supabase
    .from("company_jobs")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  return { data: (data as CompanyJob[]) || [], error };
}

// নতুন ভ্যাকেন্সি তৈরি বা আপডেট করা
export async function saveCompanyJob(job: CompanyJob) {
  if (job.id) {
    const { data, error } = await supabase
      .from("company_jobs")
      .update({ ...job })
      .eq("id", job.id)
      .select()
      .single();
    return { data, error };
  } else {
    const { id: _unused, ...insertPayload } = job;
    const { data, error } = await supabase
      .from("company_jobs")
      .insert([insertPayload])
      .select()
      .single();
    return { data, error };
  }
}

// ভ্যাকেন্সি ডিলিট করা
export async function deleteCompanyJob(jobId: string) {
  const { error } = await supabase
    .from("company_jobs")
    .delete()
    .eq("id", jobId);
  return { error };
}

// নির্দিষ্ট জবের সব অ্যাপ্লিকেশন লোড করা
export async function getJobApplications(jobId: string) {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("job_id", jobId)
    .order("applied_at", { ascending: false });

  return { data: (data as JobApplication[]) || [], error };
}

// অ্যাপ্লিকেন্টের স্ট্যাটাস আপডেট করা (Shortlisted / Rejected / Hired)
export async function updateApplicationStatus(
  applicationId: string,
  status: JobApplication["status"],
) {
  const { error } = await supabase
    .from("job_applications")
    .update({ status })
    .eq("id", applicationId);

  return { error };
}
