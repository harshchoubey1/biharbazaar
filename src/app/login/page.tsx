"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  if (user) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");

    const finalEmail = email.toLowerCase().trim();

    try {
      const result = await login(finalEmail, password);
      setLoading(false);
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center pt-10 pb-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
          <span className="text-3xl [filter:none]">🛕</span>
          Bihar Bazaar
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center px-4 pb-10">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-black/12 dark:border-white/8 rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-medium mb-5">Sign in</h1>

          {error && (
            <div className="mb-4 px-3 py-2 rounded border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800/40 text-sm text-red-700 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Google Sign In */}
          <GoogleAuthButton role="customer" onError={(err) => setError(err)} />

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-900 text-black/50 dark:text-white/50">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-1 bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm rounded-lg border border-amber-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest opacity-30 mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setEmail("admin@demo.com"); setPassword("demo123"); }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-400/20 hover:scale-[1.02] transition-transform group"
              >
                <span className="text-xl mb-1 group-hover:animate-bounce">👑</span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Admin Login</span>
              </button>
              <button
                onClick={() => { setEmail("seller@demo.com"); setPassword("demo123"); }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-400/20 hover:scale-[1.02] transition-transform group"
              >
                <span className="text-xl mb-1 group-hover:animate-bounce">🏪</span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Seller Login</span>
              </button>
            </div>
            <p className="text-center text-[10px] opacity-40 mt-3 italic">Click to autofill, then click 'Continue'</p>
          </div>

          <p className="text-xs text-black/50 dark:text-white/40 mt-3 leading-relaxed">
            By continuing, you agree to Bihar Bazaar&apos;s{" "}
            <span className="text-amber-600 cursor-pointer hover:underline">Conditions of Use</span> and{" "}
            <span className="text-amber-600 cursor-pointer hover:underline">Privacy Notice</span>.
          </p>
        </div>

        {/* New to Bihar Bazaar */}
        <div className="w-full max-w-sm flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-black/12 dark:bg-white/10" />
          <span className="text-xs text-black/40 dark:text-white/35 whitespace-nowrap">New to Bihar Bazaar?</span>
          <div className="flex-1 h-px bg-black/12 dark:bg-white/10" />
        </div>

        <div className="w-full max-w-sm">
          <Link
            href="/register"
            className="w-full block text-center py-2.5 border border-black/20 dark:border-white/20 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 shadow-sm"
          >
            Create your Bihar Bazaar account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/8 dark:border-white/8 py-5">
        <div className="flex justify-center gap-5 text-xs text-black/40 dark:text-white/30">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
        <p className="text-center text-xs text-black/30 dark:text-white/20 mt-2">© 2025 Bihar Bazaar</p>
      </footer>
    </div>
  );
}
