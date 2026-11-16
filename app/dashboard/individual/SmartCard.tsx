// app/dashboard/individual/SmartCard.tsx (বা _components/SmartCard.tsx)
"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCw } from "lucide-react";
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // কার্ডের আসল ডেস্কটপ রেশিও (৪৬০px × ২৭০px)
  const CARD_WIDTH = 460;
  const CARD_HEIGHT = 270;

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const availableWidth = wrapperRef.current.offsetWidth;
        if (availableWidth > 0 && availableWidth < CARD_WIDTH) {
          setScale(availableWidth / CARD_WIDTH);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

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
    <div className="w-full flex flex-col items-center">
      {/* অটো-স্কেল কন্টেইনার: প্রস্থ ও উচ্চতা দুটোই সমান অনুপাতে ছোট হবে */}
      <div
        ref={wrapperRef}
        style={{ height: `${CARD_HEIGHT * scale}px` }}
        className="w-full max-w-115 flex items-center justify-center relative"
      >
        <div
          style={{
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
          className="shrink-0 perspective-distant cursor-pointer group select-none"
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
