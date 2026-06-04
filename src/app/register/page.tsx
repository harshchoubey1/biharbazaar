"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function RegisterPage() {
  const { user: mockUser, register: mockRegister, login: mockLogin } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mockUser) router.replace("/");
  }, [mockUser, router]);

  if (mockUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill all required fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    setError("");

    try {
      const regRes = await mockRegister(name, email, password, role);
      if (!regRes.success) {
        setError(regRes.error || "Registration failed.");
        setLoading(false);
        return;
      }

      // Automatically sign in after successful registration
      const loginRes = await mockLogin(email, password);
      setLoading(false);
      if (loginRes.success) {
        router.replace("/");
      } else {
        setError("Account created, but failed to log in automatically. Please sign in manually.");
      }
    } catch (err) {
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

      {/* Card Container */}
      <div className="flex-1 flex flex-col items-center px-4 pb-10">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-black/12 dark:border-white/8 rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-medium mb-5">Create account</h1>

          {error && (
            <div className="mb-4 px-3 py-2 rounded border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800/40 text-sm text-red-700 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Google Sign Up – shown before the form */}
          <GoogleAuthButton role={role} onError={(err) => setError(err)} />

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-900 text-black/50 dark:text-white/50">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-1">Your name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
                placeholder="First and last name"
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-bold mb-1">Email</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-bold mb-1">Password</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
                placeholder="At least 6 characters"
              />
              <p className="text-xs text-black/40 dark:text-white/30 mt-1">ⓘ Passwords must be at least 6 characters.</p>
            </div>
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-bold mb-1">Re-enter password</label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-zinc-800 transition"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-bold mb-2">I want to</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    role === "customer"
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 shadow-sm"
                      : "border-black/12 dark:border-white/12 hover:border-black/25"
                  }`}
                >
                  🛒 Buy products
                </button>
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    role === "seller"
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 shadow-sm"
                      : "border-black/12 dark:border-white/12 hover:border-black/25"
                  }`}
                >
                  🏪 Sell products
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm rounded-lg border border-amber-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading && <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>

          <p className="text-xs text-black/50 dark:text-white/40 mt-3 leading-relaxed">
            By creating an account, you agree to Bihar Bazaar&apos;s{" "}
            <span className="text-primary cursor-pointer hover:underline">Conditions of Use</span> and{" "}
            <span className="text-primary cursor-pointer hover:underline">Privacy Notice</span>.
          </p>

          {/* Already have account */}
          <div className="mt-5 pt-4 border-t border-black/8 dark:border-white/8">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
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
