// components/auth/RoleSelector.tsx
import { User, Building2, ArrowRight } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole: (role: "individual" | "organization") => void;
  onGoToLogin: () => void;
}

export default function RoleSelector({
  onSelectRole,
  onGoToLogin,
}: RoleSelectorProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          Identity Selection
        </span>
        <h2 className="text-2xl font-serif text-neutral-950">Who are you?</h2>
      </div>

      <div className="space-y-3">
        <div
          onClick={() => onSelectRole("individual")}
          className="group cursor-pointer border border-neutral-200 p-4 flex items-center justify-between hover:border-neutral-950 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-950">Individual</p>
              <p className="text-[11px] text-neutral-500">
                Resumes, biodatas, personal QR
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
        </div>

        <div
          onClick={() => onSelectRole("organization")}
          className="group cursor-pointer border border-neutral-200 p-4 flex items-center justify-between hover:border-neutral-950 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-950">
                Organization
              </p>
              <p className="text-[11px] text-neutral-500">
                Business hub, services, counter QR
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onGoToLogin}
          className="text-xs text-neutral-500 hover:text-neutral-950 transition-colors"
        >
          Already registered?{" "}
          <span className="underline font-medium">Log in instead</span>
        </button>
      </div>
    </div>
  );
}
