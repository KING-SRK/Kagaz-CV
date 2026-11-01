// app/auth/_components/RegisterForm.tsx
import { ArrowLeft, ArrowRight } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Dispatch, SetStateAction } from "react";

// ১. এখানে onProceedToPin যোগ করে নাও
interface RegisterFormProps {
  role: "individual" | "organization";
  onBack: () => void;
  onProceedToPin: () => void;
  formData: { name: string; email: string; phonenumber: string };
  setFormData: Dispatch<
    SetStateAction<{ name: string; email: string; phonenumber: string }>
  >;
}

// ২. প্যারামিটারেও onProceedToPin রিসিভ করো
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
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-neutral-400 hover:text-neutral-950 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>
        <span className="text-[10px] font-mono uppercase bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-neutral-600">
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
            placeholder={role === "individual" ? "Joy Thayal" : "Grow Tech"}
            className="w-full border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none focus:border-neutral-950 focus:bg-white"
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
            className="w-full border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
            Phone Number
          </label>
          <div className="border border-neutral-200 bg-neutral-50/50 px-3 py-0.5 focus-within:border-neutral-950 focus-within:bg-white [&_.PhoneInput]:flex [&_.PhoneInput]:items-center [&_.PhoneInput]:gap-2 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-neutral-200 [&_.PhoneInputCountry]:pr-2 [&_.PhoneInputCountryIcon]:w-5 [&_.PhoneInputCountryIcon]:h-3.5 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:py-2 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:font-mono [&_.PhoneInputInput]:outline-none">
            <PhoneInput
              international
              defaultCountry="IN"
              value={formData.phonenumber}
              onChange={(val) =>
                setFormData({ ...formData, phonenumber: val || "" })
              }
              placeholder="98765 43210"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
        >
          <span>Continue to Set PIN</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
