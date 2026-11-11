// app/dashboard/_components/profile/tabs/data/professionBundles.ts

export interface ProfessionPackage {
  id: string;
  title: string;
  category: string;
  skills: string[];
}

export const PROFESSION_PACKAGES: ProfessionPackage[] = [
  // ১. সফটওয়্যার ও ওয়েব ডেভেলপমেন্ট
  {
    id: "web_dev",
    title: "Full-Stack Web Developer",
    category: "Software & IT",
    skills: [
      "Next.js",
      "React.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Node.js",
      "Git & GitHub",
    ],
  },
  {
    id: "app_dev",
    title: "Mobile App Developer",
    category: "Software & IT",
    skills: [
      "Flutter",
      "React Native",
      "Java",
      "Firebase",
      "REST APIs",
      "Android Studio",
    ],
  },

  // ২. হার্ডওয়্যার, ইলেকট্রনিক্স ও রিপেয়ারিং
  {
    id: "hardware_repair",
    title: "Computer & Laptop Hardware Technician",
    category: "Hardware & Electronics",
    skills: [
      "Laptop Repairing",
      "Motherboard Diagnostics",
      "Chip-Level Repair",
      "SMD Soldering",
      "Multimeter Testing",
      "BIOS Flashing",
    ],
  },
  {
    id: "cctv_networking",
    title: "CCTV & Network Specialist",
    category: "Hardware & Electronics",
    skills: [
      "CCTV Installation",
      "Router Configuration",
      "LAN Cabling",
      "IP Addressing",
      "Wi-Fi Setup",
    ],
  },

  // ৩. ডিজিটাল সার্ভিস ও সাইবার ক্যাফে
  {
    id: "cyber_cafe",
    title: "Cyber Cafe & Citizen Services",
    category: "Digital Services",
    skills: [
      "Online Form Processing",
      "Document Verification",
      "Utility Bill Payments",
      "Xerox & Scanning",
      "Lamination & Color Print",
    ],
  },

  // ৪. ক্রিয়েটিভ, ডিজাইন ও মিডিয়া
  {
    id: "graphic_designer",
    title: "Graphic & UI Designer",
    category: "Creative & Media",
    skills: [
      "Figma",
      "Photoshop",
      "Illustrator",
      "Logo Design",
      "UI/UX Design",
      "Social Media Graphics",
    ],
  },
  {
    id: "video_editor",
    title: "Video Editor & Content Creator",
    category: "Creative & Media",
    skills: [
      "Premiere Pro",
      "After Effects",
      "Color Grading",
      "Reels Editing",
      "Sound Design",
    ],
  },

  // ৫. বিজনেস, মার্কেটিং ও সেলস
  {
    id: "digital_marketing",
    title: "Digital Marketing Specialist",
    category: "Business & Marketing",
    skills: [
      "Meta Ads",
      "Google Ads",
      "SEO Optimization",
      "Social Media Strategy",
      "Content Marketing",
    ],
  },
  {
    id: "accounting",
    title: "Accountant & GST Practitioner",
    category: "Finance & Accounts",
    skills: [
      "Tally Prime",
      "GST Returns",
      "Bookkeeping",
      "Income Tax Filing",
      "Excel Modeling",
    ],
  },

  // ৬. শিক্ষকতা ও শিক্ষা
  {
    id: "educator",
    title: "Academic Teacher / Tutor",
    category: "Education",
    skills: [
      "Academic Mentorship",
      "Lesson Planning",
      "Curriculum Design",
      "Concept Clarification",
      "Exam Preparation",
    ],
  },
];
