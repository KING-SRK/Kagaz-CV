// app/dashboard/individual/tabs/AboutTab.tsx
"use client";

import PersonalInfoFields, {
  PersonalInfoData,
} from "./_components/PersonalInfoFields";
import DynamicSocialLinks, {
  SocialLink,
} from "./_components/DynamicSocialLinks";

export interface AboutTabData {
  avatarUrl?: string;
  fullName?: string;
  headline?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  languages?: string;
  bio?: string;
  socialLinks?: SocialLink[];
}

interface AboutTabProps {
  isEditing?: boolean;
  data: AboutTabData;
  onChange: (updated: Partial<AboutTabData>) => void;
}

export default function AboutTab({
  isEditing = false,
  data,
  onChange,
}: AboutTabProps) {
  const personalData: PersonalInfoData = {
    avatarUrl: data.avatarUrl || "",
    fullName: data.fullName || "",
    headline: data.headline || "",
    phone: data.phone || "",
    dob: data.dob || "",
    gender: data.gender || "",
    bloodGroup: data.bloodGroup || "",
    nationality: data.nationality || "",
    languages: data.languages || "",
    bio: data.bio || "",
  };

  const handlePersonalDataChange = (
    field: keyof PersonalInfoData,
    value: string,
  ) => {
    onChange({ [field]: value });
  };

  const handleSocialLinksChange = (links: SocialLink[]) => {
    onChange({ socialLinks: links });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ১. পার্সোনাল ইনফো কম্পোনেন্ট (নাম ও ছবির কম্প্যাক্ট রূপ) */}
      <PersonalInfoFields
        data={personalData}
        isEditing={isEditing}
        onChange={handlePersonalDataChange}
      />

      {/* ২. ডায়নামিক সোশ্যাল মিডিয়া লিংক কম্পোনেন্ট */}
      <DynamicSocialLinks
        links={data.socialLinks || []}
        isEditing={isEditing}
        onChange={handleSocialLinksChange}
      />
    </div>
  );
}
