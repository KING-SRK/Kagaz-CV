// app/dashboard/_components/CardSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import SmartCard, { CardDesignType } from "./SmartCard";
import CardDesignSwitcher from "./CardDesignSwitcher"; // সুইচার ইমপোর্ট

export default function CardSection() {
  const [kagazId, setKagazId] = useState("");
  const [role, setRole] = useState("individual");
  const [copied, setCopied] = useState(false);

  // ডিজাইন স্টেট (ডিফল্ট Duo-Split)
  const [design, setDesign] = useState<CardDesignType>("duo-split");

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
      const savedDesign =
        (localStorage.getItem("kagaz_card_design") as CardDesignType) ||
        "duo-split";

      if (!activeId) return;

      // অ্যাসিঙ্ক স্কোপের ভেতরে ইনিশিয়াল স্টেট আপডেট
      setKagazId(activeId);
      setRole(activeRole);
      setDesign(savedDesign);

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, role, qr_data")
        .eq("kagaz_id", activeId)
        .maybeSingle();

      if (data) {
        const qr = data.qr_data || {};
        if (qr.card_design) setDesign(qr.card_design);

        setCardData({
          name: data.full_name || "Official Member",
          phone: data.phone || "Not Set",
          avatarUrl: qr.avatarUrl || "",
          title:
            qr.title || (data.role === "individual" ? "Certified Member" : ""),
          dob: qr.dob || "DD/MM/YYYY",
          gender: qr.gender || "M",
          tagline:
            qr.tagline ||
            (data.role === "organization" ? "Commercial Hub" : ""),
          address: qr.address || "Kolkata, WB",
          estYear: qr.estYear || "2025",
        });
      }
    }

    fetchData();
  }, []);

  // ডিজাইন পরিবর্তন ও সেভ হ্যান্ডলার
  const handleDesignChange = async (newDesign: CardDesignType) => {
    setDesign(newDesign);
    localStorage.setItem("kagaz_card_design", newDesign);

    // ব্যাকগ্রাউন্ডে Supabase-এ সেভ যাতে পাবলিক লিংকেও এই ডিজাইনই দেখায়
    if (kagazId) {
      const { data } = await supabase
        .from("profiles")
        .select("qr_data")
        .eq("kagaz_id", kagazId)
        .maybeSingle();

      const existingQr = data?.qr_data || {};
      await supabase
        .from("profiles")
        .update({ qr_data: { ...existingQr, card_design: newDesign } })
        .eq("kagaz_id", kagazId);
    }
  };

  const handleCopyLink = () => {
    if (!kagazId) return;
    navigator.clipboard.writeText(`${window.location.origin}/p/${kagazId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* ১. মূল ৩ডি স্মার্ট কার্ড (design prop সহ) */}
      <SmartCard
        role={role}
        kagazId={kagazId}
        design={design}
        data={cardData}
      />

      {/* ২. ডিজাইন সুইচার টগল বার */}
      <CardDesignSwitcher
        currentDesign={design}
        onDesignChange={handleDesignChange}
      />

      {/* ৩. কুইক অ্যাকশন বাটন */}
      <div className="w-95 sm:w-115 flex gap-3 mt-4">
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 border border-neutral-300 bg-white py-2.5 text-xs font-mono uppercase text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{copied ? "Link Copied" : "Copy Digital Link"}</span>
        </button>

        <Link
          href={`/p/${kagazId}`}
          target="_blank"
          className="flex items-center justify-center gap-2 border border-neutral-300 bg-white px-4 py-2.5 text-xs font-mono text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
