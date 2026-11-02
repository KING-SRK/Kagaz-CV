// app/dashboard/_components/CardSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import SmartCard from "./SmartCard";

export default function CardSection() {
  const [kagazId, setKagazId] = useState("");
  const [role, setRole] = useState("individual");
  const [copied, setCopied] = useState(false);
  const [cardData, setCardData] = useState({
    name: "Official Member",
    phone: "Not Set",
    email: "",
    avatarUrl: "",
    title: "Member",
    dob: "DD/MM/YYYY",
    gender: "M",
    tagline: "",
    address: "Kolkata, WB",
    estYear: "2025",
  });

  useEffect(() => {
    const activeId = localStorage.getItem("kagaz_active_id");
    const activeRole = localStorage.getItem("kagaz_role") || "individual";
    if (!activeId) return;

    queueMicrotask(() => {
      setKagazId(activeId);
      setRole(activeRole);
    });

    async function fetchCardData() {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, role, qr_data")
        .eq("kagaz_id", activeId)
        .maybeSingle();

      if (data) {
        const qr = data.qr_data || {};
        setCardData({
          name: data.full_name || "Official Member",
          phone: data.phone || "Not Set",
          email: data.email || "",
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

    fetchCardData();
  }, []);

  const handleCopyLink = () => {
    if (!kagazId) return;
    const url = `${window.location.origin}/p/${kagazId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <SmartCard role={role} kagazId={kagazId} data={cardData} />

      <div className="w-95 sm:w-110 flex gap-3 mt-4">
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
          title="Open Public Card"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
