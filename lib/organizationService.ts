// lib/organizationService.ts
import { supabase } from "@/lib/supabaseClient";

export interface OrgContactItem {
  id: string;
  department: string; // e.g. General, Sales, HR, Support
  personName: string;
  designation: string;
  phone: string;
  whatsapp: string;
  email: string;
  isPublic: boolean;
}

export interface OrgBranchItem {
  id: string;
  locationType: string; // Head Office, Branch Office, Retail Store, etc.
  buildingNo: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  mapUrl: string;
}

export interface OrgOfferingItem {
  id: string;
  type: "Product" | "Service";
  name: string;
  category: string;
  description: string;
  price: string;
  pricingType: "Fixed" | "Starting From" | "Quotation-based";
  availability: "Available" | "Unavailable";
  link?: string;
}

export interface OrgTeamMember {
  id: string;
  kagazId?: string; // যদি SutraNet প্রোফাইল থাকে
  name: string;
  designation: string;
  department: string;
  intro: string;
  consentVerified: boolean;
}

export interface OrgLegalInfo {
  gstin?: string;
  showGstin?: boolean;
  pan?: string; // ডিফল্ট প্রাইভেট থাকবে
  cin?: string;
  llpin?: string;
  udyam?: string;
  tradeLicense?: string;
  fssai?: string;
  otherLicense?: string;
}

export interface OrgOperations {
  openingDays: string;
  openingTime: string;
  closingTime: string;
  status: "Open" | "Closed" | "Temporarily Closed";
  homeDelivery: boolean;
  onlineOrders: boolean;
  paymentMethods: string[];
  serviceArea: string;
}

export interface FullCompanyProfile {
  profile_id: string; // company_profiles টেবিলের নিজস্ব id
  kagaz_id: string;
  company_name: string;
  logo_url: string;
  cover_url: string;
  business_type: string;
  industry: string;
  business_category: string;
  short_description: string;
  detailed_description: string;
  est_year: string;
  business_size: string;
  website: string;
  is_verified: boolean;
  contacts: OrgContactItem[];
  branches: OrgBranchItem[];
  offerings: OrgOfferingItem[];
  legal_info: OrgLegalInfo;
  team_members: OrgTeamMember[];
  achievements: {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }[];
  operations: OrgOperations;
  social_links: { id: string; platform: string; url: string }[];
  portfolio: {
    id: string;
    title: string;
    category: string;
    description: string;
    url: string;
  }[];
}

// ১. শুধুমাত্র company_profiles টেবিল থেকে কোম্পানির সম্পূর্ণ প্রোফাইল লোড করা
export async function getCompanyProfile(companyId: string) {
  try {
    const { data: compData, error } = await supabase
      .from("company_profiles")
      .select("*")
      .or(`id.eq.${companyId},kagaz_id.eq.${companyId}`)
      .maybeSingle();

    if (error || !compData) {
      return {
        data: null,
        error: error?.message || "Company profile not found",
      };
    }

    const fullData: FullCompanyProfile = {
      profile_id: compData.id,
      kagaz_id: compData.kagaz_id || "",
      company_name: compData.company_name || "",
      logo_url: compData.logo_url || "",
      cover_url: compData.cover_url || "",
      business_type: compData.business_type || "",
      industry: compData.industry || "",
      business_category: compData.business_category || "",
      short_description: compData.short_description || "",
      detailed_description: compData.detailed_description || "",
      est_year: compData.est_year || "",
      business_size: compData.business_size || "",
      website: compData.website || "",
      is_verified: compData.is_verified || false,
      contacts: Array.isArray(compData.contacts) ? compData.contacts : [],
      branches: Array.isArray(compData.branches) ? compData.branches : [],
      offerings: Array.isArray(compData.offerings) ? compData.offerings : [],
      legal_info: compData.legal_info || { showGstin: false },
      team_members: Array.isArray(compData.team_members)
        ? compData.team_members
        : [],
      achievements: Array.isArray(compData.achievements)
        ? compData.achievements
        : [],
      operations: compData.operations || {
        openingDays: "Monday - Saturday",
        openingTime: "10:00",
        closingTime: "20:00",
        status: "Open",
        homeDelivery: false,
        onlineOrders: false,
        paymentMethods: ["UPI", "Cash"],
        serviceArea: "",
      },
      social_links: Array.isArray(compData.social_links)
        ? compData.social_links
        : [],
      portfolio: Array.isArray(compData.portfolio) ? compData.portfolio : [],
    };

    return { data: fullData, error: null };
  } catch (err) {
    return { data: null, error: "Failed to load company profile" };
  }
}

// ২. সরাসরি company_profiles টেবিলে সেভ / আপডেট করা (profiles টেবিল একদমই টাচ করবে না)
export async function saveCompanyProfile(
  companyId: string,
  payload: FullCompanyProfile,
) {
  try {
    const { error } = await supabase
      .from("company_profiles")
      .update({
        company_name: payload.company_name,
        logo_url: payload.logo_url,
        business_type: payload.business_type,
        industry: payload.industry,
        business_category: payload.business_category,
        short_description: payload.short_description,
        detailed_description: payload.detailed_description,
        est_year: payload.est_year,
        business_size: payload.business_size,
        website: payload.website,
        cover_url: payload.cover_url,
        contacts: payload.contacts,
        branches: payload.branches,
        offerings: payload.offerings,
        legal_info: payload.legal_info,
        team_members: payload.team_members,
        achievements: payload.achievements,
        operations: payload.operations,
        social_links: payload.social_links,
        portfolio: payload.portfolio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", companyId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    console.error("Company Save Error:", message);
    return { success: false, error: message };
  }
}
