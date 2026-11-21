// app/create-cv/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  CvData,
  CvTemplateType,
  EMPTY_CV_DATA,
  mapProfileToCvData,
} from "./types";
import CvPreview from "./components/CvPreview";
import CvEditorPanel from "./components/CvEditorPanel";

export default function CreateCvPage() {
  const [cvData, setCvData] = useState<CvData>(EMPTY_CV_DATA);
  const [template] = useState<CvTemplateType>("classic");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasSutraNetAccount, setHasSutraNetAccount] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  // ডাইনামিক অটো-স্কেল রেফারেন্স ও স্টেট
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const fetchSutraNetData = useCallback(async () => {
    const activeId =
      typeof window !== "undefined"
        ? localStorage.getItem("kagaz_active_id")
        : null;

    if (!activeId) return { found: false, data: null };

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        activeId,
      );
    const column = isUuid ? "id" : "kagaz_id";

    const { data, error } = await supabase
      .from("profiles")
      .select("*, profile_education(*)")
      .eq(column, activeId)
      .maybeSingle();

    if (!error && data) {
      return { found: true, data: data as Record<string, unknown> };
    }
    return { found: false, data: null };
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchSutraNetData().then((res) => {
      if (!isMounted) return;
      if (res.found && res.data) {
        setHasSutraNetAccount(true);
        setCvData(mapProfileToCvData(res.data));
      } else {
        setHasSutraNetAccount(false);
      }
      setLoadingProfile(false);
    });
    return () => {
      isMounted = false;
    };
  }, [fetchSutraNetData]);

  // মোবাইল বা ছোট স্ক্রিনের প্রস্থ অনুযায়ী A4 কাগজের স্কেল অটো-ফিট করা
  useEffect(() => {
    const updateScale = () => {
      if (!previewContainerRef.current) return;
      const availableWidth = previewContainerRef.current.clientWidth;
      if (availableWidth > 0 && availableWidth < 680) {
        setPreviewScale(availableWidth / 680);
      } else {
        setPreviewScale(1);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [mobileView, loadingProfile]);

  const handleReloadProfile = async () => {
    setLoadingProfile(true);
    const res = await fetchSutraNetData();
    if (res.found && res.data) {
      setHasSutraNetAccount(true);
      setCvData(mapProfileToCvData(res.data));
    }
    setLoadingProfile(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-100 text-neutral-900 flex flex-col relative overflow-x-clip">
      <style jsx global>{`
        @page {
          margin: 10mm;
          size: A4;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-printable-area,
          #cv-printable-area * {
            visibility: visible;
          }
          #cv-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            transform: none !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
        .thin-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 9999px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #737373;
        }
        .thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d4d4d4 transparent;
        }
      `}</style>

      {/* 📱 স্টিকি মোবাইল ভিউ সুইচার (গ্লোবাল নেভবারের ঠিক নিচে আটকে থাকবে) */}
      <div className="sticky top-16 z-30 flex lg:hidden bg-white border-b border-neutral-300 px-3 sm:px-4 py-2 gap-2 shadow-xs print:hidden">
        <button
          type="button"
          onClick={() => setMobileView("editor")}
          className={`flex-1 py-2 text-[11px] font-mono uppercase rounded-xs border transition-colors cursor-pointer ${
            mobileView === "editor"
              ? "bg-neutral-900 text-white border-neutral-900 font-bold"
              : "bg-white text-neutral-700 border-neutral-300"
          }`}
        >
          Edit Sections
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2 text-[11px] font-mono uppercase rounded-xs border transition-colors cursor-pointer ${
            mobileView === "preview"
              ? "bg-neutral-900 text-white border-neutral-900 font-bold"
              : "bg-white text-neutral-700 border-neutral-300"
          }`}
        >
          Live CV Preview
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      {loadingProfile ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
          <p className="text-xs font-mono uppercase text-neutral-500">
            Preparing CV Workspace...
          </p>
        </div>
      ) : (
        <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
          {/* LEFT PANEL: EDITOR */}
          <div
            className={`w-full lg:col-span-5 lg:h-full lg:overflow-y-auto thin-scrollbar lg:pr-2 pb-24 print:hidden ${
              mobileView === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <CvEditorPanel cvData={cvData} setCvData={setCvData} />
          </div>

          {/* RIGHT PANEL: DYNAMIC AUTO-FIT A4 PAPER */}
          <div
            className={`w-full lg:col-span-7 lg:h-full lg:overflow-y-auto thin-scrollbar flex justify-center items-start pb-24 ${
              mobileView === "editor" ? "hidden lg:block" : "block"
            }`}
          >
            <div
              ref={previewContainerRef}
              className="w-full flex justify-center overflow-hidden"
              style={{
                height: previewScale < 1 ? `${962 * previewScale}px` : "auto",
              }}
            >
              <div
                className="origin-top shrink-0"
                style={{
                  transform:
                    previewScale < 1 ? `scale(${previewScale})` : "none",
                }}
              >
                <CvPreview data={cvData} template={template} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CONTROL DOCK */}
      <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md border border-neutral-300 p-1.5 sm:p-2 rounded-md shadow-2xl print:hidden">
        {hasSutraNetAccount && (
          <button
            type="button"
            onClick={handleReloadProfile}
            title="Reload data from SutraNet profile"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-neutral-300 bg-white text-[10px] font-mono uppercase text-neutral-800 hover:bg-neutral-100 rounded-xs cursor-pointer transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-neutral-950 text-white text-[10px] font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 cursor-pointer shadow-xs transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-emerald-400" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}
