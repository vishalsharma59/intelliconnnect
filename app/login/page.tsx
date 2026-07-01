"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.push("/feed");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!email.trim() || !password) {
      setFormError("Please fill in all fields");
      return;
    }
    try {
      const result = await login(email, password);
      if (result.type === "auth/login/fulfilled") {
        router.push("/feed");
      } else {
        setFormError((result.payload as string) || "Invalid email or password");
      }
    } catch (err: any) {
      setFormError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-svh bg-background">
      <div className="hidden lg:flex lg:w-[44%] flex-shrink-0 flex-col items-center justify-center p-14 relative overflow-hidden bg-gradient-to-br from-primary-dark to-primary">
        <span className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm w-full text-white">

          <h1 className="text-4xl font-black tracking-tight leading-tight mb-2">
            IntelliConnect
          </h1>
          <p className="text-white/70 mb-10 text-base font-normal">
            Share. Connect. Inspire.
          </p>

          <ul className="space-y-4">
            {[
              "Real-time messaging with people you care about",
              "Share moments through photos and posts",
              "Discover and follow interesting people",
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
            <span className="text-base font-black text-primary tracking-tight">
              IntelliConnect
            </span>
          </div>

          <h2 className="text-2xl font-black text-foreground tracking-tight mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-text-secondary mb-7">
            Sign in to your account to continue
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
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-foreground tracking-wide"
                htmlFor="email"
              >
                Email address
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-input text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-semibold text-foreground tracking-wide"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
                />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-border bg-input text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:text-primary-dark transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
