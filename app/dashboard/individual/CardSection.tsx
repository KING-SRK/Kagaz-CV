// app/dashboard/individual/CardSection.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Check, Copy, Download, ExternalLink, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabaseClient";
import { getIndividualProfile } from "@/lib/individualService";
import SmartCard, { CardDesignType } from "./SmartCard";

export default function CardSection() {
  const [kagazId, setKagazId] = useState("");
  const [role, setRole] = useState("individual");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // কার্ড এলিমেন্ট রেফারেন্স (ডাউনলোডের জন্য)
  const cardRef = useRef<HTMLDivElement>(null);

  // আপাতত শুধুমাত্র একটি সিঙ্গেল ডিফল্ট ডিজাইন রাখা হলো (পরে চাইলে সুইচার যোগ করা যাবে)
  const defaultDesign: CardDesignType = "duo-split";

  const [cardData, setCardData] = useState({
    name: "Member Name",
    phone: "Not Set",
    avatarUrl: "",
    title: "Identity Holder",
    dob: "DD/MM/YYYY",
    gender: "M",
    tagline: "",
    address: "Kolkata, WB",
    estYear: "2025",
  });

  useEffect(() => {
    async function fetchData() {
      const activeId = localStorage.getItem("kagaz_active_id");
      const activeRole = localStorage.getItem("kagaz_role") || "individual";

      if (!activeId) return;

      setRole(activeRole);

      // ১. সার্ভিস থেকে সেন্ট্রাল ডেটা ফেচ
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
          gender: data.gender ? data.gender.charAt(0).toUpperCase() : "M",
          tagline: data.role === "organization" ? "Commercial Hub" : "",
          address: formattedAddress,
          estYear: "2025",
        });
      } else {
        // ফলব্যাক ডিরেক্ট কুয়েরি
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
              ? directData.gender.charAt(0).toUpperCase()
              : "M",
            tagline: directData.role === "organization" ? "Commercial Hub" : "",
            address: fallbackAddress,
            estYear: "2025",
          });
        }
      }
    }

    fetchData();

    // ⚡ রিয়েলটাইম আপডেট লিসেনার (নাম, ছবি, ঠিকানা সবকিছুর জন্য)
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

  // ডিজিটাল লিংক কপি
  const handleCopyLink = () => {
    if (!kagazId) return;
    navigator.clipboard.writeText(`${window.location.origin}/p/${kagazId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // স্মার্ট কার্ড PNG হিসেবে ডাউনলোড করার হ্যান্ডলার
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `SmartCard-${kagazId || "profile"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download card image:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* ১. মূল স্মার্ট কার্ড (সিঙ্গেল প্রিমিয়াম ডিজাইন) */}
      <div ref={cardRef} className="p-1">
        <SmartCard
          role={role}
          kagazId={kagazId}
          design={defaultDesign}
          data={cardData}
        />
      </div>

      {/* ২. কুইক অ্যাকশন বাটন বার */}
      <div className="w-95 sm:w-115 flex items-center gap-2 mt-5">
        {/* ডিজিটাল লিংক কপি বাটন */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 border border-neutral-300 bg-white py-2.5 text-xs font-mono uppercase text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer rounded-xs"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-neutral-600" />
          )}
          <span>{copied ? "Link Copied" : "Copy Link"}</span>
        </button>

        {/* কার্ড ডাউনলোড বাটন */}
        <button
          type="button"
          onClick={handleDownloadCard}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 border border-neutral-900 bg-neutral-900 py-2.5 text-xs font-mono uppercase text-white hover:bg-neutral-800 disabled:bg-neutral-600 transition-colors shadow-xs cursor-pointer rounded-xs"
        >
          {downloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
          ) : (
            <Download className="h-3.5 w-3.5 text-white" />
          )}
          <span>{downloading ? "Saving..." : "Download Card"}</span>
        </button>

        {/* পাবলিক পেজ লিংক */}
        <Link
          href={`/p/${kagazId}`}
          target="_blank"
          title="Open Public Page"
          className="flex items-center justify-center border border-neutral-300 bg-white p-2.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors shadow-xs rounded-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
