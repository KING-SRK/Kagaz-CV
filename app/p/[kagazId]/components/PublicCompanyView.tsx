// app/p/[kagazId]/components/PublicCompanyView.tsx
"use client";

import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  Package,
  Users,
  Award,
  FolderKanban,
  ExternalLink,
  FileCheck2,
} from "lucide-react";
import {
  CompanyVisibility,
  DEFAULT_COMPANY_VISIBILITY,
} from "@/app/dashboard/organization/components/CompanyPrivacyModal";

interface CompanyContact {
  id?: string;
  department?: string;
  personName?: string;
  designation?: string;
  phone?: string;
  email?: string;
  isPublic?: boolean;
}

interface CompanyBranch {
  id?: string;
  locationType?: string;
  buildingNo?: string;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mapUrl?: string;
}

interface CompanyOffering {
  id?: string;
  type?: string;
  name?: string;
  description?: string;
  price?: string;
  link?: string;
}

interface CompanyTeamMember {
  id?: string;
  kagazId?: string;
  name?: string;
  designation?: string;
  consentVerified?: boolean;
  status?: string;
}

interface CompanyPortfolioItem {
  id?: string;
  title?: string;
  description?: string;
  url?: string;
}

interface CompanyAchievement {
  id?: string;
  title?: string;
  issuer?: string;
  date?: string;
}

export interface PublicJobItem {
  id: string;
  job_title: string;
  employment_type?: string;
  work_mode?: string;
  work_location?: string;
  external_apply_url?: string;
}

export interface PublicCompanyData {
  id: string;
  kagaz_id: string;
  company_name?: string;
  logo_url?: string;
  cover_url?: string;
  business_type?: string;
  industry?: string;
  business_category?: string;
  short_description?: string;
  detailed_description?: string;
  est_year?: string;
  website?: string;
  is_verified?: boolean;
  contacts?: CompanyContact[];
  branches?: CompanyBranch[];
  offerings?: CompanyOffering[];
  team_members?: CompanyTeamMember[];
  portfolio?: CompanyPortfolioItem[];
  achievements?: CompanyAchievement[];
  social_links?: { id?: string; platform?: string; url?: string }[];
  operations?: {
    openingDays?: string;
    openingTime?: string;
    closingTime?: string;
    status?: string;
    paymentMethods?: string[];
  };
  legal_info?: {
    showGstin?: boolean;
    gstin?: string;
    cin?: string;
    udyam?: string;
    fssai?: string;
  };
  public_visibility?: Partial<CompanyVisibility>;
}

export default function PublicCompanyView({
  company,
  openJobs = [],
}: {
  company: PublicCompanyData;
  openJobs?: PublicJobItem[];
}) {
  const vis: CompanyVisibility = {
    ...DEFAULT_COMPANY_VISIBILITY,
    ...(company.public_visibility || {}),
  };

  const publicContacts = Array.isArray(company.contacts)
    ? company.contacts.filter((c) => c.isPublic !== false)
    : [];

  const verifiedTeam = Array.isArray(company.team_members)
    ? company.team_members.filter(
        (m) => m.consentVerified === true || m.status === "Accepted",
      )
    : [];

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      {/* ১. কোম্পানি হিরো ব্যানার ও প্রোফাইল কার্ড */}
      <div className="bg-white border border-neutral-300 rounded-sm shadow-xs overflow-hidden">
        <div
          className="h-24 sm:h-44 bg-neutral-900 bg-cover bg-center relative"
          style={
            company.cover_url
              ? { backgroundImage: `url(${company.cover_url})` }
              : undefined
          }
        />

        <div className="px-4 sm:px-8 pb-5 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 -mt-10 sm:-mt-14 mb-4 relative z-20">
            <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-md border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center shrink-0 relative z-20">
              {company.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={company.logo_url}
                  alt={company.company_name || "Company Logo"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-300" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 sm:px-3 py-1.5 bg-neutral-100 border border-neutral-300 text-[11px] sm:text-xs font-mono font-bold text-neutral-900 rounded-xs">
                ORG ID: {company.kagaz_id}
              </span>
              {vis.website && company.website && (
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-neutral-900 text-white text-[11px] sm:text-xs font-mono uppercase rounded-xs hover:bg-neutral-800 transition-colors"
                >
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-serif font-bold text-neutral-950 wrap-break-word">
                {company.company_name}
              </h1>
              {company.is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold uppercase rounded-full shrink-0">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verified Entity
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-mono text-neutral-600 wrap-break-word">
              {company.business_category || company.industry}
              {vis.about && company.est_year
                ? ` • Est. ${company.est_year}`
                : ""}
              {vis.about && company.business_type
                ? ` • ${company.business_type}`
                : ""}
            </p>
          </div>

          {vis.social_links &&
            Array.isArray(company.social_links) &&
            company.social_links.length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap gap-2">
                {company.social_links.map((link, idx) =>
                  link.url ? (
                    <a
                      key={link.id || idx}
                      href={
                        link.url.startsWith("http")
                          ? link.url
                          : `https://${link.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 border border-neutral-300 text-[11px] font-mono text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors rounded-xs"
                    >
                      <span>{link.platform || "Link"}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  ) : null,
                )}
              </div>
            )}
        </div>
      </div>

      {/* ২. About & Overview */}
      {vis.about &&
        (company.short_description || company.detailed_description) && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-2.5 sm:space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              About Organization
            </h2>
            {company.short_description && (
              <p className="text-xs sm:text-sm font-semibold text-neutral-900 wrap-break-word">
                {company.short_description}
              </p>
            )}
            {company.detailed_description && (
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line wrap-break-word">
                {company.detailed_description}
              </p>
            )}
          </section>
        )}

      {/* ৩. Products & Services */}
      {vis.offerings &&
        Array.isArray(company.offerings) &&
        company.offerings.filter((item) => item.name?.trim()).length > 0 && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-neutral-700 shrink-0" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                Products &amp; Services
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {company.offerings
                .filter((item) => item.name?.trim())
                .map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 sm:p-4 border border-neutral-200 bg-neutral-50 rounded-xs flex flex-col justify-between space-y-2 min-w-0"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded-xs">
                          {item.type}
                        </span>
                        {item.price && (
                          <span className="text-xs font-mono font-bold text-neutral-950">
                            {item.price}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-neutral-950 pt-1 wrap-break-word">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-neutral-600 leading-relaxed wrap-break-word">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.link && (
                      <a
                        href={
                          item.link.startsWith("http")
                            ? item.link
                            : `https://${item.link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-900 hover:underline pt-1"
                      >
                        <span>Explore</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

      {/* ৪. Department Contacts & Business Operations */}
      {(vis.contacts && publicContacts.length > 0) ||
      (vis.operations && company.operations?.openingDays) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {vis.contacts && publicContacts.length > 0 && (
            <section className="bg-white border border-neutral-300 p-4 sm:p-5 rounded-sm shadow-xs space-y-3 min-w-0">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                Official Contacts
              </h2>
              <div className="space-y-2.5 sm:space-y-3">
                {publicContacts.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1 text-xs min-w-0"
                  >
                    <p className="font-mono text-[10px] uppercase font-bold text-neutral-500">
                      {c.department || "General Enquiry"}
                    </p>
                    {c.personName && (
                      <p className="font-bold text-neutral-900 wrap-break-word">
                        {c.personName}{" "}
                        {c.designation && (
                          <span className="font-normal text-neutral-600">
                            ({c.designation})
                          </span>
                        )}
                      </p>
                    )}
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="flex items-center gap-1.5 text-neutral-800 font-mono"
                      >
                        <Phone className="h-3 w-3 shrink-0" />
                        <span className="truncate">{c.phone}</span>
                      </a>
                    )}
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="flex items-center gap-1.5 text-neutral-800 font-mono min-w-0"
                      >
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="break-all sm:break-normal">
                          {c.email}
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {vis.operations && company.operations?.openingDays && (
            <section className="bg-white border border-neutral-300 p-4 sm:p-5 rounded-sm shadow-xs space-y-3 min-w-0">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-700 shrink-0" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Hours &amp; Operations
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2 p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs">
                  <span className="text-neutral-600">Current Status</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {company.operations.status || "Open"}
                  </span>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs">
                  <p className="font-semibold text-neutral-900">
                    {company.operations.openingDays}
                  </p>
                  <p className="font-mono text-neutral-600 mt-0.5">
                    {company.operations.openingTime} –{" "}
                    {company.operations.closingTime}
                  </p>
                </div>
                {Array.isArray(company.operations.paymentMethods) &&
                  company.operations.paymentMethods.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1.5">
                        Accepted Payments
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {company.operations.paymentMethods.map((pm, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-[11px] font-mono rounded-xs"
                          >
                            {pm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </section>
          )}
        </div>
      ) : null}

      {/* ৫. Branches & Locations */}
      {vis.branches &&
        Array.isArray(company.branches) &&
        company.branches.filter(
          (br) => br.city?.trim() || br.area?.trim() || br.street?.trim(),
        ).length > 0 && (
          <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-700 shrink-0" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                Locations &amp; Branches
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {company.branches.map((br, idx) => {
                const addr = [
                  br.buildingNo,
                  br.street,
                  br.area,
                  br.city,
                  br.state,
                  br.pincode,
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <div
                    key={br.id || idx}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1.5 text-xs min-w-0"
                  >
                    <span className="inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-neutral-900 text-white rounded-xs">
                      {br.locationType || "Office"}
                    </span>
                    <p className="text-neutral-800 leading-relaxed pt-1 wrap-break-word">
                      {addr}
                    </p>
                    {br.mapUrl && (
                      <a
                        href={br.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-900 hover:underline pt-1"
                      >
                        <span>Open in Maps</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      {/* ৬. Active Job Openings */}
      {vis.open_jobs && openJobs.length > 0 && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-neutral-700 shrink-0" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
              Open Positions ({openJobs.length})
            </h2>
          </div>
          <div className="space-y-3">
            {openJobs.map((job) => (
              <div
                key={job.id}
                className="p-3.5 sm:p-4 border border-neutral-200 bg-neutral-50 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-neutral-950 wrap-break-word">
                    {job.job_title}
                  </h3>
                  <p className="text-xs font-mono text-neutral-600 mt-0.5">
                    {job.employment_type} • {job.work_mode}
                    {job.work_location ? ` • ${job.work_location}` : ""}
                  </p>
                </div>
                {job.external_apply_url && (
                  <a
                    href={job.external_apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs hover:bg-neutral-800 shrink-0 text-center"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ৭. Portfolio & Achievements */}
      {((vis.portfolio &&
        Array.isArray(company.portfolio) &&
        company.portfolio.length > 0) ||
        (vis.achievements &&
          Array.isArray(company.achievements) &&
          company.achievements.length > 0)) && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
          {vis.portfolio &&
            Array.isArray(company.portfolio) &&
            company.portfolio.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-neutral-700 shrink-0" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                    Portfolio &amp; Case Studies
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.portfolio.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1 min-w-0"
                    >
                      <h3 className="text-xs font-bold text-neutral-950 wrap-break-word">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-neutral-600 wrap-break-word">
                        {proj.description}
                      </p>
                      {proj.url && (
                        <a
                          href={
                            proj.url.startsWith("http")
                              ? proj.url
                              : `https://${proj.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-900 hover:underline pt-1"
                        >
                          <span>View Case Study</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {vis.achievements &&
            Array.isArray(company.achievements) &&
            company.achievements.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-neutral-700 shrink-0" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                    Awards &amp; Recognition
                  </h2>
                </div>
                <div className="space-y-2">
                  {company.achievements.map((ach, idx) => (
                    <div
                      key={ach.id || idx}
                      className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs text-xs"
                    >
                      <p className="font-bold text-neutral-900 wrap-break-word">
                        {ach.title}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-600 mt-0.5">
                        {ach.issuer} {ach.date ? `• ${ach.date}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </section>
      )}

      {/* ৮. Verified Team Members */}
      {vis.team_members && verifiedTeam.length > 0 && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-neutral-700 shrink-0" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
              Leadership &amp; Team
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verifiedTeam.map((member, idx) => (
              <div
                key={member.id || idx}
                className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center justify-between gap-3 min-w-0"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-950 truncate">
                    {member.name}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-600 truncate">
                    {member.designation}
                  </p>
                </div>
                {member.kagazId && (
                  <Link
                    href={`/p/${member.kagazId}`}
                    className="px-2.5 py-1 bg-white border border-neutral-300 text-[10px] font-mono uppercase text-neutral-800 hover:bg-neutral-900 hover:text-white rounded-xs transition-colors shrink-0"
                  >
                    View ID
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ৯. Business Registrations */}
      {vis.legal_info && company.legal_info && (
        <section className="bg-white border border-neutral-300 p-4 sm:p-6 rounded-sm shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-neutral-700 shrink-0" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
              Registered Credentials
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono">
            {company.legal_info.showGstin && company.legal_info.gstin && (
              <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xs break-all sm:break-normal">
                GSTIN: <strong>{company.legal_info.gstin}</strong>
              </span>
            )}
            {company.legal_info.cin && (
              <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xs break-all sm:break-normal">
                CIN: <strong>{company.legal_info.cin}</strong>
              </span>
            )}
            {company.legal_info.udyam && (
              <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xs break-all sm:break-normal">
                UDYAM: <strong>{company.legal_info.udyam}</strong>
              </span>
            )}
            {company.legal_info.fssai && (
              <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xs break-all sm:break-normal">
                FSSAI: <strong>{company.legal_info.fssai}</strong>
              </span>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
