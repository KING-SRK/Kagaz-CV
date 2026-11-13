// components/ui/FormFields.tsx
"use client";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string | number;
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  max,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white"
      />
    </div>
  );
}

interface FormSelectWithOtherProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  otherPlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelectWithOther({
  label,
  value,
  options,
  onChange,
  placeholder = "-- Select --",
  otherPlaceholder = "Please specify...",
  required = false,
  disabled = false,
}: FormSelectWithOtherProps) {
  const isOther =
    value === "Other" || (value !== "" && !options.includes(value));

  const customText = value.startsWith("Other: ")
    ? value.replace("Other: ", "")
    : !options.includes(value)
      ? value
      : "";

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          required={required}
          disabled={disabled}
          value={isOther ? "Other" : value}
          onChange={(e) =>
            onChange(e.target.value === "Other" ? "Other" : e.target.value)
          }
          className="w-full border border-neutral-200 bg-neutral-50/30 px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {isOther && !disabled && (
        <input
          type="text"
          required={required}
          value={customText}
          onChange={(e) =>
            onChange(e.target.value ? `Other: ${e.target.value}` : "Other")
          }
          placeholder={otherPlaceholder}
          className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
        />
      )}
    </div>
  );
}
