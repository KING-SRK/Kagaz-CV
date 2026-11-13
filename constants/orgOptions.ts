// constants/orgOptions.ts
export const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company",
  "Public Limited Company",
  "One Person Company",
  "Startup",
  "Freelancer / Independent Business",
  "Local Shop / Retail Business",
  "Non-Profit Organisation",
  "Other",
];

export const INDUSTRY_CATEGORIES: Record<string, string[]> = {
  "Information Technology": [
    "Web Development",
    "Mobile App Development",
    "Game Development",
    "Software & SaaS",
    "IT Consulting & Cloud",
    "Cybersecurity",
    "AI & Data Analytics",
    "Other",
  ],
  Electronics: [
    "Computer & Laptop Sales",
    "Computer & Laptop Repairing",
    "Chip-Level Repairing",
    "Mobile & Gadget Store",
    "Hardware & Accessories",
    "Home Appliances",
    "Other",
  ],
  Education: [
    "School / College",
    "Coaching & Tuition Center",
    "Computer & Skill Training Institute",
    "EdTech & Online Courses",
    "Consultancy & Study Abroad",
    "Other",
  ],
  Healthcare: [
    "Clinic & Polyclinic",
    "Hospital & Nursing Home",
    "Diagnostic Lab & Pathology",
    "Pharmacy & Medical Store",
    "Dental & Eye Care",
    "Wellness & Physiotherapy",
    "Other",
  ],
  "Retail & E-commerce": [
    "Grocery & Supermarket",
    "General Store / Kirana",
    "Online D2C Store",
    "Wholesale & Distribution",
    "Stationery & Book Store",
    "Other",
  ],
  "Food & Restaurant": [
    "Restaurant & Fine Dining",
    "Cafe & Coffee Shop",
    "Fast Food & Cloud Kitchen",
    "Bakery & Sweet Shop",
    "Catering Services",
    "Other",
  ],
  Manufacturing: [
    "Garments & Textile",
    "Packaging & Printing",
    "Machinery & Industrial Goods",
    "FMCG & Consumer Goods",
    "Plastic & Chemical",
    "Other",
  ],
  Construction: [
    "Civil Construction & Contractors",
    "Real Estate & Developers",
    "Interior Design & Architecture",
    "Building Materials & Hardware",
    "Other",
  ],
  Finance: [
    "CA, Tax & Accounting Firm",
    "Insurance & Investment Advisory",
    "Microfinance & NBFC",
    "FinTech Services",
    "Other",
  ],
  Transportation: [
    "Logistics & Courier",
    "Packers & Movers",
    "Cab & Fleet Rental",
    "Freight & Supply Chain",
    "Other",
  ],
  Hospitality: [
    "Hotel & Resort",
    "Homestay & Guest House",
    "Travel Agency & Tour Operator",
    "Event Management",
    "Other",
  ],
  Agriculture: [
    "Farming & Organic Produce",
    "Seeds, Fertilizers & Agro-Tech",
    "Dairy & Poultry",
    "Nursery & Gardening",
    "Other",
  ],
  "Media & Entertainment": [
    "Digital Marketing Agency",
    "Photography & Videography Studio",
    "Content Creation & Production House",
    "Printing & Advertising",
    "Other",
  ],
  "Professional Services": [
    "Cyber Cafe & Digital Seva Kendra",
    "Legal & Law Firm",
    "HR & Recruitment Agency",
    "Business Consulting",
    "Security & Housekeeping",
    "Other",
  ],
  "Beauty & Fashion": [
    "Salon & Spa",
    "Boutique & Apparel Store",
    "Cosmetics & Skincare",
    "Jewellery & Accessories",
    "Other",
  ],
  Other: ["Other"],
};

export const INDUSTRIES = Object.keys(INDUSTRY_CATEGORIES);

export const BUSINESS_SIZES = [
  "1-5 Employees (Micro / Solo)",
  "6-20 Employees (Small Team)",
  "21-50 Employees (Growing)",
  "51-200 Employees (Medium)",
  "200+ Employees (Enterprise)",
];

export const formatOtherDisplay = (val?: string) => {
  if (!val) return "";
  return val.startsWith("Other: ")
    ? val.replace("Other: ", "").trim() || "Other"
    : val;
};

// constants/orgOptions.ts-এর একদম নিচে যোগ করো:

export const LOCATION_TYPES = [
  "Head Office",
  "Branch Office",
  "Registered Office",
  "Retail Store",
  "Warehouse",
  "Factory",
  "Other",
];

export const COUNTRIES = [
  "India",
  "Bangladesh",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Singapore",
  "Other",
];

export const INDIAN_STATES = [
  "West Bengal",
  "Odisha",
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
  "Uttar Pradesh",
  "Bihar",
  "Jharkhand",
  "Assam",
  "Rajasthan",
  "Other",
];

export const STATE_DISTRICTS: Record<string, string[]> = {
  "West Bengal": [
    "Kolkata",
    "North 24 Parganas",
    "South 24 Parganas",
    "Howrah",
    "Hooghly",
    "Nadia",
    "Purba Medinipur",
    "Paschim Medinipur",
    "Jhargram",
    "Purba Bardhaman",
    "Paschim Bardhaman",
    "Bankura",
    "Purulia",
    "Birbhum",
    "Murshidabad",
    "Malda",
    "Darjeeling",
    "Jalpaiguri",
    "Siliguri",
    "Other",
  ],
  Odisha: [
    "Khordha",
    "Cuttack",
    "Mayurbhanj",
    "Balasore",
    "Bhadrak",
    "Puri",
    "Ganjam",
    "Sundargarh",
    "Sambalpur",
    "Other",
  ],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Other"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi", "Other"],
  Delhi: ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "Other"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Other"],
  Telangana: ["Hyderabad", "Rangareddy", "Warangal", "Other"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Other"],
};

// constants/orgOptions.ts-এর একদম নিচে যোগ করো:

export const OFFERING_TYPES = ["Product", "Service"];

export const OFFERING_CATEGORIES = [
  "Software & Web Development",
  "Mobile App & Game Development",
  "Computers, Laptops & Hardware",
  "Repair & Maintenance Services",
  "Accessories & Peripherals",
  "Networking & IT Infrastructure",
  "Digital & Online Services",
  "Consulting & Training",
  "Retail & Consumer Goods",
  "Food & Hospitality",
  "Other",
];

export const PRICING_TYPES = ["Fixed", "Starting From", "Quotation-based"];

export const AVAILABILITY_STATUS = ["Available", "Unavailable"];

// constants/orgOptions.ts-এর একদম নিচে যোগ করো:

export const TEAM_DESIGNATIONS = [
  "Founder & CEO",
  "Co-Founder / Co-Owner",
  "Managing Director",
  "Director",
  "General Manager",
  "Department Head",
  "Software / Web Developer",
  "App / Game Developer",
  "Hardware & Repair Specialist",
  "Sales & Marketing Lead",
  "HR Manager",
  "Customer Support Executive",
  "Other",
];

export const TEAM_DEPARTMENTS = [
  "Management & Leadership",
  "Software & Web Development",
  "App & Game Development",
  "Computer Hardware & Repairing",
  "Cyber Cafe & Digital Services",
  "Sales & Marketing",
  "Human Resources (HR)",
  "Customer Support",
  "Finance & Operations",
  "Other",
];

// constants/orgOptions.ts-এর একদম নিচে যোগ করো:

export const JOB_CATEGORIES = [
  "IT & Software Development",
  "Hardware, Networking & Repair",
  "Sales & Business Development",
  "Digital Marketing & Content",
  "Accounts & Finance",
  "Human Resources (HR)",
  "Customer Support & Operations",
  "Design & Creative",
  "Other",
];

export const EXPERIENCE_LEVELS = [
  "Fresher",
  "0 - 1 Year",
  "1 - 3 Years",
  "3 - 5 Years",
  "5+ Years (Senior)",
];

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

export const WORK_MODES = ["On-site", "Hybrid", "Remote"];

export const APPLICATION_METHODS = ["SutraNet Application", "External Link"];

export const VACANCY_STATUSES = ["Open", "Paused", "Closed"];

// constants/orgOptions.ts-এর একদম নিচে যোগ করো:

export const ACHIEVEMENT_CATEGORIES = [
  "ISO Certification",
  "Startup Recognition (DPIIT / State)",
  "Industry Award",
  "Quality Certification",
  "Professional Membership",
  "Business Excellence Award",
  "Government Appreciation / Grant",
  "Other",
];

// constants/orgOptions.ts-এর একদম নিচে যোগ করো:

export const OPENING_DAYS_OPTIONS = [
  "Monday - Saturday",
  "Monday - Friday",
  "All 7 Days (Monday - Sunday)",
  "Tuesday - Sunday",
  "Weekends Only (Saturday - Sunday)",
  "Other",
];

export const BUSINESS_STATUS_OPTIONS = ["Open", "Closed", "Temporarily Closed"];

export const CUSTOMER_SERVICE_OPTIONS = [
  "Available",
  "Phone & WhatsApp Support",
  "By Appointment Only",
  "Unavailable",
];

export const PAYMENT_METHOD_OPTIONS = [
  "Cash",
  "UPI",
  "Debit / Credit Card",
  "Net Banking",
  "Mobile Wallet",
  "EMI / Pay Later",
];

// constants/orgOptions.ts-এর একদম নিচে যোগ করো:

export const SOCIAL_PLATFORMS = [
  "LinkedIn",
  "Instagram",
  "Facebook",
  "YouTube",
  "X",
  "WhatsApp Business",
  "Google Business Profile",
  "Official Website",
  "Online Store",
  "Other",
];

export const PORTFOLIO_CATEGORIES = [
  "Web Application / Website",
  "Mobile App Development",
  "Game Development",
  "Custom PC Build / Hardware Setup",
  "Interior / Construction Project",
  "Manufacturing / Product Design",
  "Digital Marketing Campaign",
  "Consulting / Enterprise Solution",
  "Other",
];
