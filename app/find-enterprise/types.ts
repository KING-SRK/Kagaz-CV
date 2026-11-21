// app/find-enterprise/types.ts

export interface OrganizationVisibility {
  short_description?: boolean;
  about_story?: boolean;
  industry_category?: boolean;
  business_type?: boolean;
  founding_year?: boolean;
  employee_count?: boolean;
  website?: boolean;
  email?: boolean;
  phone?: boolean;
  address?: boolean;
  registration_details?: boolean;
  services?: boolean;
  products?: boolean;
  leadership?: boolean;
  social_links?: boolean;
  open_jobs?: boolean;
}

export const DEFAULT_ORG_VISIBILITY: OrganizationVisibility = {
  short_description: true,
  about_story: true,
  industry_category: true,
  business_type: true,
  founding_year: true,
  employee_count: true,
  website: true,
  email: true,
  phone: true,
  address: true,
  registration_details: false,
  services: true,
  products: true,
  leadership: true,
  social_links: true,
  open_jobs: true,
};

export interface EnterpriseProfile {
  id: string;
  kagaz_id: string;
  company_name?: string;
  tagline?: string;
  short_description?: string;
  industry_category?: string;
  business_type?: string;
  logo_url?: string;
  city?: string;
  state?: string;
  country?: string;
  employee_count?: string;
  founding_year?: string;
  is_verified?: boolean;
  services?: {
    title?: string;
    name?: string;
  }[];
  products?: {
    title?: string;
    name?: string;
  }[];
  company_jobs?: {
    id: string;
    status?: string;
  }[];
  public_visibility?: Partial<OrganizationVisibility>;
  created_at?: string;
}

export const ITEMS_PER_PAGE = 12;
