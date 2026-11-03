// app/dashboard/_components/cards/types.ts
export interface CardProps {
  role: "individual" | "organization" | string;
  kagazId: string;
  data: {
    name: string;
    avatarUrl?: string;
    phone: string;
    email?: string;
    title?: string;
    dob?: string;
    gender?: string;
    tagline?: string;
    address?: string;
    estYear?: string;
  };
  userProfileUrl: string;
  websiteHomeUrl: string;
}
