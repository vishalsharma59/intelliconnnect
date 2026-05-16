"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail,
  Lock,
  AtSign,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.push("/feed");
  }, [isAuthenticated, router]);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const { username, email, password, confirm } = form;

    if (!username || !email || !password || !confirm) {
      setFormError("Please fill in all fields");
      return;
    }
    if (username.length < 3) {
      setFormError("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setFormError("Username: letters, numbers and underscores only");
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const result = await register({ username, email, password });
      if (result.type === "auth/register/fulfilled") {
        router.push("/feed");
      } else {
        setFormError((result.payload as string) || "Registration failed. Try again.");
      }
    } catch (err: any) {
      setFormError(err.message || "Something went wrong");
    }
  };

  const fields: {
    key: keyof typeof form;
    id: string;
    label: string;
    type: string;
    placeholder: string;
    hint?: string;
    Icon: React.ElementType;
    toggle?: { show: boolean; set: () => void };
    autoComplete: string;
  }[] = [
    {
      key: "username",
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "johndoe",
      hint: "Letters, numbers and underscores only",
      Icon: AtSign,
      autoComplete: "username",
    },
    {
      key: "email",
      id: "reg-email",
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
      Icon: Mail,
      autoComplete: "email",
    },
    {
      key: "password",
      id: "reg-password",
      label: "Password",
      type: showPw ? "text" : "password",
      placeholder: "Min. 6 characters",
      Icon: Lock,
      autoComplete: "new-password",
      toggle: { show: showPw, set: () => setShowPw((v) => !v) },
    },
    {
      key: "confirm",
      id: "confirm",
      label: "Confirm password",
      type: showConfirm ? "text" : "password",
      placeholder: "Repeat your password",
      Icon: Lock,
      autoComplete: "new-password",
      toggle: { show: showConfirm, set: () => setShowConfirm((v) => !v) },
    },
  ];

  return (
    <div className="flex min-h-svh bg-background">
      <div className="hidden lg:flex lg:w-[44%] flex-shrink-0 flex-col items-center justify-center p-14 relative overflow-hidden bg-gradient-to-br from-secondary to-primary">
        <span className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm w-full text-white">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur border border-white/25 flex items-center justify-center mb-6">
            <span className="text-sm font-black tracking-tight">IC</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight leading-tight mb-2">
            Join IntelliConnect
          </h1>
          <p className="text-white/70 mb-10 text-base">Your community awaits</p>

          <ul className="space-y-4">
            {[
              "Create your profile in under a minute",
              "Connect with friends and discover new people",
              "Your data is private and encrypted",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-10 overflow-y-auto bg-background">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-black">
              IC
            </span>
            <span className="text-base font-black text-primary tracking-tight">
              IntelliConnect
            </span>
          </div>

          <h2 className="text-2xl font-black text-foreground tracking-tight mb-1">
            Create your account
          </h2>
          <p className="text-sm text-text-secondary mb-7">
            It only takes a few seconds
          </p>

          {(formError || error) && (
            <div className="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100 mb-5 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0 mt-1.5" />
              <p className="text-sm text-error font-medium">
                {formError || error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {fields.map(
              ({
                key,
                id,
                label,
                type,
                placeholder,
                hint,
                Icon,
                toggle,
                autoComplete,
              }) => (
                <div key={key} className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-foreground tracking-wide"
                    htmlFor={id}
                  >
                    {label}
                  </label>
                  <div className="relative group">
                    <Icon
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
                    />
                    <input
                      id={id}
                      type={type}
                      autoComplete={autoComplete}
                      value={form[key]}
                      onChange={set(key)}
                      placeholder={placeholder}
                      className={`w-full pl-10 py-2.5 text-sm rounded-xl border border-border bg-input text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background transition ${toggle ? "pr-11" : "pr-4"}`}
                    />
                    {toggle && (
                      <button
                        type="button"
                        onClick={toggle.set}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                        aria-label={toggle.show ? "Hide" : "Show"}
                      >
                        {toggle.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                  {hint && <p className="text-xs text-text-muted">{hint}</p>}
                </div>
              ),
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Creating
                  account…
                </>
              ) : (
                <>
                  Create account <ArrowRight size={17} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-text-muted mt-3">
              By creating an account you agree to our{" "}
              <Link
                href="#"
                className="text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:text-primary-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
