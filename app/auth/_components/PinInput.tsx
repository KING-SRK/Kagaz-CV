// app/auth/_components/PinInput.tsx
"use client";

import { useRef } from "react";

interface PinInputProps {
  pin: string[];
  setPin: (pin: string[]) => void;
  length?: number;
}

export default function PinInput({ pin, setPin, length = 4 }: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;

    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 📱 মোবাইলে বা ডেস্কটপে পুরো PIN পেস্ট করলে অটোমেটিক সব বক্সে বসে যাবে
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pastedData) return;

    const newPin = Array(length).fill("");
    pastedData.split("").forEach((char, idx) => {
      newPin[idx] = char;
    });
    setPin(newPin);

    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2.5 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={pin[index] || ""}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="h-11 w-10 sm:h-12 sm:w-11 border border-neutral-300 bg-neutral-50/60 text-center font-mono text-lg sm:text-xl font-medium text-neutral-900 outline-none transition-all duration-200 focus:border-neutral-950 focus:bg-white rounded-xs"
        />
      ))}
    </div>
  );
}
