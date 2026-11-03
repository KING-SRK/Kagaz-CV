// app/dashboard/_components/SmartCard.tsx
"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import ObsidianCard from "./cards/ObsidianCard";
import DuoSplitCard from "./cards/DuoSplitCard";
import TitaniumGradientCard from "./cards/TitaniumGradientCard"; // নতুন ইমপোর্ট

export type CardDesignType = "duo-split" | "obsidian" | "titanium"; // শুধু ব্ল্যাক অ্যান্ড হোয়াইট থিম

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
  const [isFlipped, setIsFlipped] = useState(false);

  const userProfileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${kagazId || "preview"}`
      : `https://kagazcv.vercel.app/p/${kagazId || "preview"}`;

  const websiteHomeUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://kagazcv.vercel.app";

  const cardProps = {
    role,
    kagazId,
    data,
    userProfileUrl,
    websiteHomeUrl,
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-[380px] sm:w-[460px] h-[270px] perspective-[1200px] cursor-pointer group select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-700 transform-3d transition-transform ${
            isFlipped ? "transform-[rotateY(180deg)]" : ""
          }`}
        >
          {design === "duo-split" && <DuoSplitCard {...cardProps} />}
          {design === "obsidian" && <ObsidianCard {...cardProps} />}
          {design === "titanium" && <TitaniumGradientCard {...cardProps} />}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        className="mt-4 flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
      >
        <RotateCw className="h-3.5 w-3.5" />
        <span>Flip Card to view {isFlipped ? "Front" : "Back"}</span>
      </button>
    </div>
  );
}
