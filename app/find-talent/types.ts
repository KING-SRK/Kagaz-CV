// app/find-talent/types.ts
import { IndividualVisibility } from "@/app/dashboard/individual/components/IndividualPrivacyModal";

export interface TalentProfile {
  id: string;
  kagaz_id: string;
  full_name?: string;
  title?: string;
  sector?: string;
  bio?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  country?: string;
  is_verified?: boolean;
  skills?: string[];
  experience?: {
    company?: string;
    designation?: string;
    isCurrent?: boolean;
  }[];
  projects?: {
    title?: string;
  }[];
  profile_education?: {
    degree?: string;
    institution?: string;
  }[];
  career_preferences?: {
    lookingForJob?: boolean;
    availableForFreelance?: boolean;
    noticePeriod?: string;
  };
  public_visibility?: Partial<IndividualVisibility>;
  created_at?: string;
}

export const ITEMS_PER_PAGE = 12;
