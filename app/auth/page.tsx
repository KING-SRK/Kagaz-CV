// app/auth/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import PinLoginForm from "./_components/PinLoginForm";
import RoleSelector from "./_components/RoleSelector";
import RegisterForm from "./_components/RegisterForm";
import PinSetup from "./_components/PinSetup";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

export default function AuthPage() {
  const [view, setView] = useState<
    "login" | "select-role" | "register-form" | "pin-setup"
  >("login");
  const [direction, setDirection] = useState<number>(1);
  const [role, setRole] = useState<"individual" | "organization">("individual");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });

  const switchTab = (nextView: "login" | "select-role") => {
    if (nextView === view) return;
    setDirection(nextView === "select-role" ? 1 : -1);
    setView(nextView);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#141414] flex flex-col justify-center py-12 px-6 overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-block">
          <span className="flex h-8 w-8 items-center justify-center bg-neutral-950 text-xs font-mono font-medium text-white mx-auto">
            K
          </span>
        </Link>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* স্লাইডিং ট্যাব কন্ট্রোলার */}
        <div className="relative flex border border-neutral-200 bg-neutral-100/70 p-1 mb-8">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`relative z-10 flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
              view === "login"
                ? "text-neutral-950 font-medium"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {view === "login" && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              />
            )}
            <span className="relative z-20">Log In</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab("select-role")}
            className={`relative z-10 flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
              view !== "login"
                ? "text-neutral-950 font-medium"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {view !== "login" && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              />
            )}
            <span className="relative z-20">Register</span>
          </button>
        </div>

        {/* কার্ড র‍্যাপার */}
        <div className="relative border border-neutral-200 bg-white p-8 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.02)] min-h-115 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={view}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 380, damping: 30 },
                opacity: { duration: 0.2 },
                filter: { duration: 0.2 },
              }}
              className="w-full"
            >
              {view === "login" && (
                <PinLoginForm onGoToRegister={() => switchTab("select-role")} />
              )}

              {view === "select-role" && (
                <RoleSelector
                  onSelectRole={(r) => {
                    setRole(r);
                    setDirection(1);
                    setView("register-form");
                  }}
                  onGoToLogin={() => switchTab("login")}
                />
              )}

              {view === "register-form" && (
                <RegisterForm
                  role={role}
                  formData={formData}
                  setFormData={setFormData}
                  onBack={() => {
                    setDirection(-1);
                    setView("select-role");
                  }}
                  onProceedToPin={() => {
                    setDirection(1);
                    setView("pin-setup");
                  }}
                />
              )}

              {view === "pin-setup" && (
                <PinSetup
                  fullName={formData.name || "User"}
                  email={formData.email || ""}
                  phone={formData.phonenumber || ""}
                  role={role}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
