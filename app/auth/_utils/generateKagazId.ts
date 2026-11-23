import { supabase } from "@/lib/supabaseClient";

// র‍্যান্ডম ১০-ডিজিটের SutraNet ID তৈরি (Individual: SN-XXXXX-XXXXX | Organization: SNC-XXXXX-XXXXX)
export function generateKagazId(
  _fullName?: string,
  role: "individual" | "organization" = "individual",
): string {
  const part1 = Math.floor(10000 + Math.random() * 90000); // প্রথম ৫ ডিজিট
  const part2 = Math.floor(10000 + Math.random() * 90000); // শেষ ৫ ডিজিট
  const prefix = role === "organization" ? "SNC" : "SN";

  return `${prefix}-${part1}-${part2}`;
}

// ডাটাবেসে চেক করে ১০০% ইউনিক (Collision-Free) ID জেনারেটর
export async function generateUniqueSutraNetId(
  role: "individual" | "organization" = "individual",
): Promise<string> {
  let isUnique = false;
  let newId = "";

  while (!isUnique) {
    newId = generateKagazId(undefined, role);
    const table = role === "organization" ? "company_profiles" : "profiles";

    const { data, error } = await supabase
      .from(table)
      .select("kagaz_id")
      .eq("kagaz_id", newId)
      .maybeSingle();

    if (!error && !data) {
      isUnique = true;
    }
  }

  return newId;
}
