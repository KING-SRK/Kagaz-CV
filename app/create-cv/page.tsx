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
import StyleSwitcher from "./components/StyleSwitcher";

const A4_BASE_WIDTH = 794; // 210mm at ~96dpi

export default function CreateCvPage() {
  const [cvData, setCvData] = useState<CvData>(EMPTY_CV_DATA);
  const [template, setTemplate] = useState<CvTemplateType>("modern");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasSutraNetAccount, setHasSutraNetAccount] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [isPrinting, setIsPrinting] = useState(false);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

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

  // উপলব্ধ প্রস্থ অনুযায়ী A4 কাগজের স্কেল অটো-ফিট করা
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const updateScale = () => {
      const availableWidth = container.clientWidth;
      if (availableWidth > 0 && availableWidth < A4_BASE_WIDTH) {
        setPreviewScale(Number((availableWidth / A4_BASE_WIDTH).toFixed(4)));
      } else {
        setPreviewScale(1);
      }
    };

    updateScale();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScale);
      observer.observe(container);
    }

    window.addEventListener("resize", updateScale);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [mobileView, loadingProfile, template]);

  // প্রিন্ট ডায়ালগ শেষ হলে ডাউনলোড স্ট্যাটস ব্যাকগ্রাউন্ডে সেভ করা
  const logCvDownload = useCallback(() => {
    const trimmedName = cvData.fullName.trim();
    if (!trimmedName && !hasSutraNetAccount) return;

    const identityKey = trimmedName
      ? trimmedName.toLowerCase()
      : "registered_user";
    const sessionKey = `cv_logged_${template}_${identityKey}`;
    const alreadyLogged =
      typeof window !== "undefined" && sessionStorage.getItem(sessionKey);

    if (alreadyLogged) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, "1");
    }

    const payload = {
      full_name: trimmedName || null,
      title: cvData.title.trim() || null,
      location: cvData.location.trim() || null,
      email: hasSutraNetAccount ? null : cvData.email.trim() || null,
      phone: hasSutraNetAccount ? null : cvData.phone.trim() || null,
      template,
      skills: hasSutraNetAccount ? [] : cvData.skills || [],
      is_guest: !hasSutraNetAccount,
    };

    supabase
      .from("guest_cv_logs")
      .insert(payload)
      .then(({ error }) => {
        if (error) {
          console.error("CV download log error:", error.message);
        } else {
          setStatsRefreshKey((prev) => prev + 1);
        }
      });
  }, [cvData, hasSutraNetAccount, template]);

  // ব্রাউজারের প্রিন্ট ইভেন্ট লিসেনার
  useEffect(() => {
    const onBeforePrint = () => setIsPrinting(true);
    const onAfterPrint = () => {
      setIsPrinting(false);
      logCvDownload();
    };

    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [logCvDownload]);

  const handleDownloadPdf = () => {
    setIsPrinting(true);

    // নাম লেখা থাকলে বা লগইন করা থাকলে সাথে সাথে কাউন্ট সেভ করা
    const trimmedName = cvData.fullName.trim();
    if (trimmedName || hasSutraNetAccount) {
      const identityKey = trimmedName
        ? trimmedName.toLowerCase()
        : "registered_user";
      const sessionKey = `cv_logged_${template}_${identityKey}`;
      const alreadyLogged =
        typeof window !== "undefined" && sessionStorage.getItem(sessionKey);

      if (!alreadyLogged) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(sessionKey, "1");
        }

        const payload = {
          full_name: trimmedName || null,
          title: cvData.title.trim() || null,
          location: cvData.location.trim() || null,
          email: hasSutraNetAccount ? null : cvData.email.trim() || null,
          phone: hasSutraNetAccount ? null : cvData.phone.trim() || null,
          template,
          skills: hasSutraNetAccount ? [] : cvData.skills || [],
          is_guest: !hasSutraNetAccount,
        };

        supabase
          .from("guest_cv_logs")
          .insert(payload)
          .then(({ error }) => {
            if (error) {
              console.error("CV download log error:", error.message);
            } else {
              setStatsRefreshKey((prev) => prev + 1);
            }
          });
      }
    }

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 600);
    }, 80);
  };

  const handleReloadProfile = async () => {
    setLoadingProfile(true);
    const res = await fetchSutraNetData();
    if (res.found && res.data) {
      setHasSutraNetAccount(true);
      setCvData(mapProfileToCvData(res.data));
    }
    setLoadingProfile(false);
  };

  const effectiveScale = isPrinting ? 1 : previewScale;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-100 text-neutral-900 flex flex-col relative overflow-x-clip print:min-h-0 print:bg-white print:overflow-visible">
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          html,
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body > header,
          body > div > header,
          nav,
          footer {
            display: none !important;
          }
          #cv-printable-area {
            display: flex !important;
            flex-direction: column !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 12mm 14mm !important;
            border: none !important;
            box-shadow: none !important;
            transform: none !important;
            background: #ffffff !important;
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

      {/* 📱 স্টিকি মোবাইল ভিউ সুইচার */}
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
        <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 lg:h-[calc(100vh-80px)] lg:overflow-hidden print:block print:w-full print:h-auto print:overflow-visible print:p-0 print:m-0">
          {/* LEFT PANEL: STYLE SWITCHER + EDITOR */}
          <div
            className={`w-full min-w-0 lg:col-span-5 lg:h-full lg:overflow-y-auto thin-scrollbar lg:pr-2 pb-24 space-y-3 sm:space-y-4 print:hidden ${
              mobileView === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="hidden lg:block">
              <StyleSwitcher
                value={template}
                onChange={setTemplate}
                refreshKey={statsRefreshKey}
              />
            </div>

            <CvEditorPanel cvData={cvData} setCvData={setCvData} />
          </div>

          {/* RIGHT PANEL: MOBILE PREVIEW STYLE SWITCHER + DYNAMIC AUTO-FIT A4 PAPER */}
          <div
            className={`w-full min-w-0 lg:col-span-7 lg:h-full lg:overflow-y-auto thin-scrollbar flex-col items-center pb-4 print:block print:w-full print:h-auto print:overflow-visible print:p-0 print:m-0 ${
              mobileView === "editor" ? "hidden lg:flex" : "flex"
            }`}
          >
            {mobileView === "preview" && (
              <div className="w-full max-w-198.5 mb-2.5 block lg:hidden print:hidden">
                <StyleSwitcher
                  value={template}
                  onChange={setTemplate}
                  refreshKey={statsRefreshKey}
                />
              </div>
            )}

            <div
              ref={previewContainerRef}
              className="w-full flex justify-center overflow-x-hidden print:block print:w-full print:h-auto print:overflow-visible"
            >
              <div
                className="w-198.5 max-w-none origin-top shrink-0 print:w-full"
                style={{
                  zoom: effectiveScale,
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
          onClick={handleDownloadPdf}
          disabled={isPrinting}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-neutral-950 text-white text-[10px] font-mono uppercase tracking-wider rounded-xs hover:bg-neutral-800 cursor-pointer shadow-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download className="h-3.5 w-3.5 text-emerald-400" />
          <span>{isPrinting ? "Preparing..." : "Download PDF"}</span>
        </button>
      </div>
    </div>
  );
}
