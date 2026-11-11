// app/dashboard/_components/profile/tabs/data/sectors.ts

export interface SectorItem {
  id: string;
  label: string;
  iconName?: string;
}

export const WORK_SECTORS: SectorItem[] = [
  { id: "it_software", label: "Information Technology & Software" },
  { id: "hardware_electronics", label: "Electronics, Hardware & Repairing" },
  { id: "digital_services", label: "Cyber Cafe & Digital Citizen Services" },
  { id: "creative_design", label: "Design, Multimedia & Content Creation" },
  { id: "marketing_sales", label: "Marketing, Advertising & Sales" },
  { id: "finance_accounts", label: "Finance, Banking & Accounting" },
  { id: "education_academics", label: "Education, Teaching & Research" },
  { id: "healthcare_medical", label: "Healthcare, Medicine & Pharmacy" },
  {
    id: "engineering_construction",
    label: "Engineering, Civil & Construction",
  },
  { id: "law_legal", label: "Legal Services, Law & Judiciary" },
  { id: "trades_technical", label: "Electrical, Plumbing & Technical Trades" },
  { id: "retail_business", label: "Retail, Shopkeeping & Local Commerce" },
  { id: "hospitality_tourism", label: "Hospitality, Food & Tourism" },
  { id: "transport_logistics", label: "Transport, Logistics & Supply Chain" },
  { id: "agriculture_farming", label: "Agriculture, Farming & Agro-tech" },
  { id: "other", label: "Other / Independent Profession" },
];
