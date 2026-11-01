// components/auth/LoginForm.tsx
interface LoginFormProps {
  onGoToRegister: () => void;
}

export default function LoginForm({ onGoToRegister }: LoginFormProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          Welcome Back
        </span>
        <h2 className="text-2xl font-serif text-neutral-950">
          Access workspace.
        </h2>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="name@domain.com"
            className="w-full border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm outline-none focus:border-neutral-950 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
        >
          Enter Workspace
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onGoToRegister}
          className="text-xs text-neutral-500 hover:text-neutral-950 transition-colors"
        >
          Don&apos;t have an account?{" "}
          <span className="underline font-medium">Register here</span>
        </button>
      </div>
    </div>
  );
}
