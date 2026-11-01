// lib/generateKagazId.ts
export function generateKagazId(fullName: string): string {
  // ১. নাম ও পদবির প্রথম অক্ষর নেওয়া (যেমন: Joy Thayal -> JT)
  const parts = fullName.trim().split(/\s+/);
  let initials = "KC";
  if (parts.length === 1) {
    initials = parts[0].slice(0, 2).toUpperCase();
  } else if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // ২. বছর ও মাস (YYMM ফরম্যাট, যেমন: 2610)
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const yearMonth = `${year}${month}`;

  // ৩. ৪-ডিজিট সিকিউর ইউনিক র‍্যান্ডম কোড
  const randomCode = Math.floor(1000 + Math.random() * 9000);

  return `${initials}-${yearMonth}-${randomCode}`;
}
