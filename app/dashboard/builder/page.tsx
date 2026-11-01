// app/dashboard/builder/page.tsx
"use client";

import { useEffect, useState } from "react";
import BuilderNavbar from "./_components/BuilderNavbar";
import IndividualForm, { ResumeData } from "./_components/IndividualForm";
import PaperPreview from "./_components/PaperPreview";
import OrganizationForm, { OrgData } from "./_components/OrganizationForm";
import OrgPaperPreview from "./_components/OrgPaperPreview";
import { useSearchParams } from "next/navigation";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const [kagazId, setKagazId] = useState<string>("");
  const [role, setRole] = useState<string>("individual");

  // ইন্ডিভিজুয়াল স্টেট
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    experienceTitle: "",
    experienceCompany: "",
    experienceDesc: "",
  });

  // অর্গানাইজেশন স্টেট
  const [orgData, setOrgData] = useState<OrgData>({
    orgName: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    services: "",
    workingHours: "",
  });

  useEffect(() => {
    const savedId = localStorage.getItem("kagaz_active_id");
    const savedRole = localStorage.getItem("kagaz_role");
    const queryType = searchParams.get("type");

    queueMicrotask(() => {
      if (savedId) setKagazId(savedId);
      if (queryType) {
        setRole(queryType);
      } else if (savedRole) {
        setRole(savedRole);
      }
    });
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
      <BuilderNavbar kagazId={kagazId} role={role} onPrint={handlePrint} />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* ফর্ম সেকশন */}
        <section className="print:hidden lg:col-span-5 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
          {role === "organization" ? (
            <OrganizationForm data={orgData} setData={setOrgData} />
          ) : (
            <IndividualForm data={resumeData} setData={setResumeData} />
          )}
        </section>

        {/* প্রিভিউ সেকশন */}
        <section className="lg:col-span-7 h-[calc(100vh-3.5rem)] overflow-y-auto bg-neutral-200/50 print:bg-white print:h-auto print:overflow-visible">
          {role === "organization" ? (
            <OrgPaperPreview data={orgData} kagazId={kagazId} />
          ) : (
            <PaperPreview data={resumeData} kagazId={kagazId} />
          )}
        </section>
      </main>
    </div>
  );
}
