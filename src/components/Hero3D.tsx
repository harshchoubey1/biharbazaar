"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BiharMap from "@/components/BiharMap";

export default function Hero3D() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-white text-gray-900 py-16 px-4 md:px-8 border-b border-gray-200"
    >
      {/* Light subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px, 40px 40px, 40px 40px",
        }}
      />

      {/* Soft amber glow top-right */}
      <div className="absolute top-[-8%] right-[-6%] w-[600px] h-[600px] rounded-full bg-amber-300/20 blur-[130px] pointer-events-none" />
      {/* Soft violet glow bottom-left */}
      <div className="absolute bottom-[-8%] left-[-6%] w-[450px] h-[450px] rounded-full bg-violet-200/20 blur-[120px] pointer-events-none" />
      {/* Extra warm glow center-right for map */}
      <div className="absolute top-[20%] right-[5%] w-[380px] h-[380px] rounded-full bg-amber-200/25 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* LEFT PANEL: Copy & CTA */}
        <div
          className={`lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-1000 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-widest mb-6">
            <span>✨</span> Bihar’s Premium Heritage Store
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Discover the Heritage of <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">Bihar</span>
            <span className="block text-gray-500 text-3xl sm:text-4xl md:text-5xl mt-2 font-medium">
              Directly from Regional Artisans.
            </span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
            Support local weavers and artisans. Experience GI‑certified Mithila art, Bhagalpuri silk, traditional sweets, and regional specialties delivered nationwide.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-xl mb-10">
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-2xl p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-amber-400/50 focus-within:border-amber-400/50 transition-all duration-300">
              <span className="pl-3.5 pr-2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Madhubani, Silk Saree, Khaja, Makhana..."
                className="flex-1 bg-transparent border-none outline-none py-3 text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-amber-500 text-white text-xs font-extrabold px-6 py-3 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-400/20"
              >
                Search
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-500 justify-center lg:justify-start">
              <span className="font-semibold text-gray-400">Popular searches:</span>
              {["Madhubani", "Silk Saree", "Sweets", "Makhana"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSearchQuery(t)}
                  className="hover:text-amber-600 hover:underline transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </form>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start w-full">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-14 px-8 text-xs font-extrabold uppercase tracking-widest text-gray-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/10 active:scale-95 transition-all duration-300"
            >
              Shop Collection
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center h-14 px-8 text-xs font-extrabold uppercase tracking-widest rounded-xl border border-gray-300 hover:border-amber-400 hover:text-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              Register as Seller
            </Link>
          </div>
        </div>
        {/* RIGHT PANEL: Bihar SVG Map */}
        <div
          className="hidden lg:flex lg:col-span-3 items-center justify-center"
          style={{
            animation: "floatMap 6s ease-in-out infinite",
          }}
        >
          <BiharMap />
        </div>
        <style jsx global>{`
          @keyframes floatMap {
            0%   { transform: translateY(0px); }
            50%  { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
      </div>
    </section>
  );
}
