"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Shield,
} from "lucide-react";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabaseClient";
import { getIndividualProfile } from "@/lib/individualService";
import SmartCard, { CardDesignType } from "./SmartCard";
import IndividualPrivacyModal from "./components/IndividualPrivacyModal";

export default function CardSection() {
  const [kagazId, setKagazId] = useState("");
  const [role, setRole] = useState("individual");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const defaultDesign: CardDesignType = "duo-split";

  const CARD_WIDTH = 440;
  const CARD_HEIGHT = 265;

  // 📱 স্ক্রিন ছোট হলে অটোমেটিক স্কেল হিসাব করবে যাতে কার্ডের একবিন্দুও না কাটে
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

  const [cardData, setCardData] = useState({
    name: "Member Name",
    phone: "Not Set",
    avatarUrl: "",
    title: "Identity Holder",
    dob: "DD/MM/YYYY",
    gender: "M",
    tagline: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    async function fetchData() {
      const activeId = localStorage.getItem("kagaz_active_id");
      const activeRole = localStorage.getItem("kagaz_role") || "individual";

      if (!activeId) return;

      setRole(activeRole);

      const { data } = await getIndividualProfile(activeId);

      if (data) {
        setKagazId(data.kagaz_id || activeId);

        const primaryLoc = data.profile_locations?.[0];
        const formattedAddress =
          primaryLoc?.city && primaryLoc?.state
            ? `${primaryLoc.city}, ${primaryLoc.state}`
            : primaryLoc?.address_line || "Kolkata, WB";

        setCardData({
          name: data.full_name || "Official Member",
          phone: data.phone || "Not Set",
          avatarUrl: data.avatar_url || "",
          title:
            data.title ||
            (data.role === "individual"
              ? "Certified Member"
              : "Commercial Hub"),
          dob: data.dob || "DD/MM/YYYY",
          gender: data.gender ? data.gender.toUpperCase() : "Gender",
          tagline: data.role === "organization" ? "Commercial Hub" : "",
          address: formattedAddress,
          email: data.email || "",
        });
      } else {
        const { data: directData } = await supabase
          .from("profiles")
          .select(
            "id, kagaz_id, full_name, phone, role, avatar_url, title, dob, gender, address_line, city, state",
          )
          .or(`id.eq.${activeId},kagaz_id.eq.${activeId}`)
          .maybeSingle();

        if (directData) {
          setKagazId(directData.kagaz_id || activeId);

          const fallbackAddress =
            directData.city && directData.state
              ? `${directData.city}, ${directData.state}`
              : directData.address_line || "Kolkata, WB";

          setCardData({
            name: directData.full_name || "Official Member",
            phone: directData.phone || "Not Set",
            avatarUrl: directData.avatar_url || "",
            title:
              directData.title ||
              (directData.role === "individual" ? "Certified Member" : ""),
            dob: directData.dob || "DD/MM/YYYY",
            gender: directData.gender
              ? directData.gender.toUpperCase()
              : "Gender",
            tagline: directData.role === "organization" ? "Commercial Hub" : "",
            address: fallbackAddress,
            email: "",
          });
        }
      }
    }

    fetchData();

    const handleCardUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const updated = customEvent.detail;

        const primaryLoc = updated.profile_locations?.[0];
        const locStr =
          primaryLoc?.city && primaryLoc?.state
            ? `${primaryLoc.city}, ${primaryLoc.state}`
            : primaryLoc?.address_line || undefined;

        setCardData((prev) => ({
          ...prev,
          name: updated.full_name || prev.name,
          title: updated.title || prev.title,
          dob: updated.dob || prev.dob,
          avatarUrl: updated.avatar_url ?? prev.avatarUrl,
          gender: updated.gender
            ? updated.gender.charAt(0).toUpperCase()
            : prev.gender,
          ...(locStr && { address: locStr }),
        }));
      }
    };

    window.addEventListener("profile-updated", handleCardUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleCardUpdate);
    };
  }, []);

  const handleCopyLink = () => {
    if (!kagazId) return;
    navigator.clipboard.writeText(`${window.location.origin}/p/${kagazId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ⚡ এক ক্লিকেই সামনের ও পেছনের দুটো পিঠ আলাদা HD ইমেজ হিসেবে ডাউনলোড হবে
  const handleDownloadCard = async () => {
    const frontEl = document.getElementById("card-front-side");
    const backEl = document.getElementById("card-back-side");

    if (!frontEl || !backEl) return;

    try {
      setDownloading(true);

      // ১. সামনের পিঠ (Front Side) ডাউনলোড
      const frontDataUrl = await toPng(frontEl, {
        cacheBust: true,
        pixelRatio: 3,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        style: {
          transform: "none",
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
        },
      });

      const frontLink = document.createElement("a");
      frontLink.download = `${kagazId || "SmartCard"}-Front.png`;
      frontLink.href = frontDataUrl;
      frontLink.click();

      // সামান্য বিরতি দিয়ে পেছনের পিঠ ডাউনলোড (যাতে ব্রাউজার ব্লক না করে)
      await new Promise((resolve) => setTimeout(resolve, 400));

      // ২. পেছনের পিঠ (Back Side) ডাউনলোড
      const backDataUrl = await toPng(backEl, {
        cacheBust: true,
        pixelRatio: 3,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        style: {
          transform: "none", // রোটেশন সরিয়ে একদম সোজা ইমেজ ক্যাপচার করবে
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
        },
      });

      const backLink = document.createElement("a");
      backLink.download = `${kagazId || "SmartCard"}-Back.png`;
      backLink.href = backDataUrl;
      backLink.click();
    } catch (err) {
      console.error("Failed to download card images:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ১. মূল স্মার্ট কার্ড (অটো-স্কেল রেসপন্সিভ র‍্যাপার) */}
      <div
        ref={wrapperRef}
        style={{ height: `${CARD_HEIGHT * scale}px` }}
        className="w-full max-w-[440px] flex items-center justify-center relative"
      >
        <div
          ref={cardRef}
          style={{
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            // শুধুমাত্র মোবাইলে স্ক্রিন ছোট হলে তবেই scale অ্যাপ্লাই হবে
            ...(scale < 1
              ? {
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }
              : {}),
          }}
          className="shrink-0 flex items-center justify-center"
        >
          <SmartCard
            role={role}
            kagazId={kagazId}
            design={defaultDesign}
            data={cardData}
          />
        </div>
      </div>

      {/* ২. কুইক অ্যাকশন বাটন বার (সম্পূর্ণ রেসপন্সিভ) */}
      <div className="w-full max-w-[380px] sm:max-w-[440px] grid grid-cols-2 sm:flex sm:items-center gap-2 mt-5 px-2 sm:px-0">
        {/* ১. Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-1.5 border border-neutral-300 bg-white py-2.5 px-3 text-[11px] font-mono uppercase text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer rounded-xs"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
          )}
          <span className="truncate">{copied ? "Copied" : "Copy Link"}</span>
        </button>

        {/* ২. Download Card */}
        <button
          type="button"
          onClick={handleDownloadCard}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-1.5 border border-neutral-900 bg-neutral-900 py-2.5 px-3 text-[11px] font-mono uppercase text-white hover:bg-neutral-800 disabled:bg-neutral-600 transition-colors shadow-xs cursor-pointer rounded-xs"
        >
          {downloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-white shrink-0" />
          ) : (
            <Download className="h-3.5 w-3.5 text-white shrink-0" />
          )}
          <span className="truncate">
            {downloading ? "Saving..." : "Download"}
          </span>
        </button>

        {/* ৩. Public Page (মোবাইলে নিচে পুরো জায়গা নেবে, ডেস্কটপে পাশে বসবে) */}
        <Link
          href={`/p/${kagazId}`}
          className="col-span-2 sm:flex-1 flex items-center justify-center gap-1.5 border border-emerald-600 bg-emerald-50/70 hover:bg-emerald-600 text-emerald-900 hover:text-white py-2.5 px-3 text-[11px] font-mono font-bold uppercase transition-colors shadow-xs rounded-xs"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Public Page</span>
        </Link>
      </div>
      <IndividualPrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        profileId={kagazId}
      />
    </div>
  );
}
