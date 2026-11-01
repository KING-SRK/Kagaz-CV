// components/PhoneInputField.tsx
"use client";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function PhoneInputField({
  value,
  onChange,
  required = true,
}: PhoneInputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600">
        Phone Number
      </label>

      {/* প্রিমিয়াম র‍্যাপার কন্টেইনার */}
      <div className="custom-phone-wrapper border border-neutral-200 bg-neutral-50/50 px-3.5 py-1 transition-all duration-200 focus-within:border-neutral-950 focus-within:bg-white focus-within:shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <PhoneInput
          international
          defaultCountry="IN"
          value={value}
          onChange={(val) => onChange(val || "")}
          required={required}
          placeholder="Enter phone number"
        />
      </div>
    </div>
  );
}
