// app/dashboard/individual/SmartCard.tsx
"use client";

import ObsidianCard from "./cards/ObsidianCard";
import DuoSplitCard from "./cards/DuoSplitCard";
import TitaniumGradientCard from "./cards/TitaniumGradientCard";

export type CardDesignType = "duo-split" | "obsidian" | "titanium";

interface SmartCardProps {
  role: "individual" | "organization" | string;
  kagazId: string;
  design?: CardDesignType;
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
}

export default function SmartCard({
  role,
  kagazId,
  design = "duo-split",
  data,
}: SmartCardProps) {
  const userProfileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${kagazId || "preview"}`
      : `https://sutranet.in/p/${kagazId || "preview"}`;

  const websiteHomeUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://sutranet.in";

  const cardProps = {
    role,
    kagazId,
    data,
    userProfileUrl,
    websiteHomeUrl,
  };

  return (
    <>
      {design === "duo-split" && <DuoSplitCard {...cardProps} />}
      {design === "obsidian" && <ObsidianCard {...cardProps} />}
      {design === "titanium" && <TitaniumGradientCard {...cardProps} />}
    </>
  );
}
