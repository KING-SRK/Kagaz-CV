// app/auth/_components/RegisterForm.tsx
import { ArrowLeft, ArrowRight } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Dispatch, SetStateAction } from "react";
import GoogleAuthButton from "./GoogleAuthButton";

interface RegisterFormProps {
  role: "individual" | "organization";
  onBack: () => void;
  onProceedToPin: () => void;
  formData: { name: string; email: string; phonenumber: string };
  setFormData: Dispatch<
    SetStateAction<{ name: string; email: string; phonenumber: string }>
  >;
}

export default function RegisterForm({
  role,
  onBack,
  onProceedToPin,
  formData,
  setFormData,
}: RegisterFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToPin();
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>
        <span className="text-[10px] font-mono uppercase bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-neutral-600 rounded-xs">
          {role}
        </span>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
            {role === "individual" ? "Full Name" : "Company Name"}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={
              role === "individual"
                ? "Enter your full name"
                : "Enter company name"
            }
            className="w-full border border-neutral-200 bg-neutral-50/50 px-3.5 sm:px-4 py-2.5 text-sm outline-none focus:border-neutral-950 focus:bg-white rounded-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
            className="w-full border border-neutral-200 bg-neutral-50/50 px-3.5 sm:px-4 py-2.5 text-sm outline-none focus:border-neutral-950 focus:bg-white rounded-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
            Phone Number
          </label>
          <div className="w-full min-w-0 border border-neutral-200 bg-neutral-50/50 px-3 py-0.5 rounded-xs focus-within:border-neutral-950 focus-within:bg-white [&_.PhoneInput]:flex [&_.PhoneInput]:items-center [&_.PhoneInput]:gap-2 [&_.PhoneInput]:min-w-0 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-neutral-200 [&_.PhoneInputCountry]:pr-2 [&_.PhoneInputCountry]:shrink-0 [&_.PhoneInputCountryIcon]:w-5 [&_.PhoneInputCountryIcon]:h-3.5 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:py-2 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:font-mono [&_.PhoneInputInput]:outline-none">
            <PhoneInput
              international
              defaultCountry="IN"
              value={formData.phonenumber}
              onChange={(val) =>
                setFormData({ ...formData, phonenumber: val || "" })
              }
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
        >
          <span>Continue to Set PIN</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* ডিভাইডার এবং Google Sign-Up বাটন */}
      <div className="relative flex items-center py-0.5">
        <div className="grow border-t border-neutral-200" />
        <span className="shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          Or
        </span>
        <div className="grow border-t border-neutral-200" />
      </div>

      <GoogleAuthButton label="Sign up with Google" role={role} />
    </div>
  );
}
