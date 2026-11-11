// lib/individualService.ts
import { supabase } from "@/lib/supabaseClient";

export interface EducationItem {
  id?: string;
  type?: "school" | "college" | "institute";
  degree: string;
  institution: string;
  university?: string;
  start_year?: string;
  end_year?: string;
  grade?: string;
  status?: "pursuing" | "completed";
}

export interface FamilyItem {
  id?: string;
  relation: string;
  name: string;
  occupation?: string;
  contact?: string;
}

export interface LocationItem {
  id?: string;
  address_line?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  is_primary?: boolean;
}

export interface VaultItem {
  id?: string;
  doc_type: string;
  doc_number: string;
  is_verified?: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
}

export interface FullIndividualProfile {
  id: string;
  kagaz_id: string;
  role: string;
  full_name: string;
  title: string;
  sector?: string;
  skills?: string[]; // profiles টেবিলের direct array
  address_line?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  family?: FamilyItem[];
  email: string;
  phone: string;
  avatar_url: string;
  bio: string;
  dob: string;
  gender: string;
  blood_group: string;
  nationality?: string;
  languages?: string;
  social_links?: SocialLinkItem[];
  card_theme: string;
  is_verified: boolean;
  profile_education: EducationItem[];
  profile_family: FamilyItem[];
  profile_locations: LocationItem[];
  profile_vault?: VaultItem[];
}

// lib/individualService.ts

export async function getIndividualProfile(profileId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        profile_education (*),
        profile_vault (*)
      `,
      )
      .eq("id", profileId)
      .single();

    if (error) {
      console.error("Supabase Error Details:", error);
      throw error;
    }
    return { data: data as FullIndividualProfile, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch profile";
    console.error("Error fetching full individual profile:", message);
    return { data: null, error: message };
  }
}

// ২. মূল প্রোফাইল আপডেট করা (Core Information + Skills Array)
export async function updateCoreProfile(
  profileId: string,
  updates: Partial<FullIndividualProfile>,
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profileId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update profile";
    console.error("Error updating core profile:", message);
    return { data: null, error: message };
  }
}

// ৩. এডুকেশন যোগ বা আপডেট
export async function saveEducation(
  profileId: string,
  educationList: EducationItem[],
) {
  try {
    await supabase
      .from("profile_education")
      .delete()
      .eq("profile_id", profileId);

    if (educationList.length === 0) return { success: true, error: null };

    const records = educationList.map((item) => ({
      profile_id: profileId,
      type: item.type || "college",
      degree: item.degree || "",
      institution: item.institution || "",
      university: item.university || "",
      start_year: item.start_year || "",
      end_year: item.end_year || "",
      grade: item.grade || "",
      status: item.status || "completed",
    }));

    const { error } = await supabase.from("profile_education").insert(records);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save education";
    console.error("Error saving education:", message);
    return { success: false, error: message };
  }
}

// ৪. ফ্যামিলি মেম্বার আপডেট
export async function saveFamily(profileId: string, familyList: FamilyItem[]) {
  try {
    await supabase.from("profile_family").delete().eq("profile_id", profileId);

    if (familyList.length === 0) return { success: true, error: null };

    const records = familyList.map((item) => ({
      profile_id: profileId,
      relation: item.relation,
      name: item.name,
      occupation: item.occupation || "",
      contact: item.contact || "",
    }));

    const { error } = await supabase.from("profile_family").insert(records);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save family";
    console.error("Error saving family:", message);
    return { success: false, error: message };
  }
}

// ৫. লোকেশন আপডেট
export async function saveLocations(
  profileId: string,
  locations: LocationItem[],
) {
  try {
    await supabase
      .from("profile_locations")
      .delete()
      .eq("profile_id", profileId);

    if (locations.length === 0) return { success: true, error: null };

    const records = locations.map((loc) => ({
      profile_id: profileId,
      address_line: loc.address_line || "",
      city: loc.city || "",
      state: loc.state || "",
      pincode: loc.pincode || "",
      country: loc.country || "India",
      is_primary: loc.is_primary ?? true,
    }));

    const { error } = await supabase.from("profile_locations").insert(records);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save locations";
    console.error("Error saving locations:", message);
    return { success: false, error: message };
  }
}

export async function saveGovtVault(profileId: string, vaultList: VaultItem[]) {
  try {
    await supabase.from("profile_vault").delete().eq("profile_id", profileId);

    const validItems = vaultList.filter(
      (item) => item.doc_type && item.doc_number.trim(),
    );

    if (validItems.length === 0) return { success: true, error: null };

    const records = validItems.map((item) => ({
      profile_id: profileId,
      doc_type: item.doc_type,
      doc_number: item.doc_number.trim(),
    }));

    const { error } = await supabase.from("profile_vault").insert(records);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save vault";
    console.error("Error saving vault:", message);
    return { success: false, error: message };
  }
}

// lib/individualService.ts

// ১. পুরোনো ছবি ডিলিট করার হেল্পার ফাংশন
export async function deleteAvatarFromStorage(fileUrl: string) {
  try {
    if (!fileUrl) return;
    // URL থেকে ফাইলের নাম বের করা
    const urlParts = fileUrl.split("/avatars/");
    if (urlParts.length < 2) return;
    const fileName = urlParts[1];

    await supabase.storage.from("avatars").remove([fileName]);
  } catch (err) {
    console.error("Failed to delete previous avatar:", err);
  }
}

// ২. অটো-ক্লিনআপ সহ আপলোড ফাংশন
export async function uploadAvatar(
  userId: string,
  file: File,
  oldAvatarUrl?: string,
): Promise<{ url: string | null; error: string | null }> {
  try {
    // 🧹 আগের কোনো ছবি থাকলে তা প্রথমে ডিলিট করা হবে
    if (oldAvatarUrl) {
      await deleteAvatarFromStorage(oldAvatarUrl);
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // নতুন ফাইল আপলোড
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload avatar";
    console.error("Error uploading avatar:", message);
    return { url: null, error: message };
  }
}
