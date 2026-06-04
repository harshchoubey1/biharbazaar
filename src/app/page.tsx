"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Hero3D from "@/components/Hero3D";
import { categories } from "@/data/products";

// ===== INTERSECTION OBSERVER =====
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isInView };
}

// ===== ANIMATED COUNTER =====
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const startTime = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref} suppressHydrationWarning>{count.toLocaleString()}{suffix}</span>;
}

// ===== DATA =====
const floatingIcons = [
  { emoji: "🎨", top: "10%", left: "5%", delay: "0s", dur: "7s" },
  { emoji: "🧵", top: "20%", right: "8%", delay: "1s", dur: "9s" },
  { emoji: "🌶️", top: "60%", left: "3%", delay: "2s", dur: "8s" },
  { emoji: "🍬", top: "45%", right: "5%", delay: "0.5s", dur: "10s" },
  { emoji: "🏺", bottom: "15%", left: "10%", delay: "3s", dur: "7.5s" },
  { emoji: "📱", bottom: "20%", right: "12%", delay: "1.5s", dur: "8.5s" },
];

const testimonials = [
  { name: "Priya Sharma", location: "Patna, Bihar", text: "Bihar Bazaar brought the authentic taste of Silao Khaja right to my doorstep in Delhi. It tastes exactly like the one from my childhood!", avatar: "PS", rating: 5 },
  { name: "Rajesh Kumar", location: "Mumbai, Maharashtra", text: "The Madhubani paintings I ordered are absolutely breathtaking. Each piece is a masterpiece that tells a story of Bihar's rich cultural heritage.", avatar: "RK", rating: 5 },
  { name: "Anita Devi", location: "Bhagalpur, Bihar", text: "As a weaver, this platform has changed my life. I can now sell my Bhagalpuri silk sarees to customers across India directly!", avatar: "AD", rating: 5 },
];

const features = [
  { icon: "🚀", title: "Express Delivery", desc: "Fast doorstep delivery across Bihar and pan-India within 3-5 business days." },
  { icon: "🛡️", title: "Authentic Products", desc: "Every product is verified for authenticity. GI-tagged and certified goods only." },
  { icon: "💰", title: "Best Prices", desc: "Direct from artisans — no middlemen. Get fair prices supporting local communities." },
  { icon: "🔄", title: "Easy Returns", desc: "Hassle-free 7-day return policy. Your satisfaction is our top priority." },
];

const marqueeItems = [
  "🎨 Madhubani Art", "🧵 Bhagalpuri Silk", "🌶️ Bihar Spices", "🍬 Silao Khaja",
  "🏺 Sikki Grass Craft", "🪷 Mithila Heritage", "🛕 Nalanda Sweets", "📱 Local Electronics",
  "🫘 Mithila Makhana", "🍚 Katarni Rice", "🪵 Wood Carvings", "🎭 Folk Art",
];

export default function Home() {
  const hero = useInView();
  const cats = useInView();
  const featured = useInView();
  const whyUs = useInView();
  const reviews = useInView();
  const newsletter = useInView();
  const stats = useInView();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeaturedProducts(data);
        }
      })
      .catch((e) => console.error("Error fetching products:", e));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredFeatured = selectedCategory === "All"
    ? featuredProducts
    : featuredProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Header />

      {/* ===== HERO 3D ===== */}
      <Hero3D />



      {/* ===== MARQUEE ===== */}
      <section className="py-4 border-y border-black/5 dark:border-white/5">
        <div className="relative overflow-hidden whitespace-nowrap before:absolute before:inset-y-0 before:left-0 before:w-24 before:bg-gradient-to-r before:from-background before:to-transparent before:z-10 after:absolute after:inset-y-0 after:right-0 after:w-24 after:bg-gradient-to-l after:from-background after:to-transparent after:z-10">
          <div className="inline-flex animate-marquee hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="inline-flex items-center px-6 text-sm font-medium opacity-40 whitespace-nowrap">
                {item}
                <span className="ml-6 text-primary/30">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={stats.ref} className="px-4 md:px-8 py-12 max-w-7xl mx-auto w-full">
        <div className={`flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark shadow-xl shadow-primary/20 ${stats.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          {[
            { n: 500, s: "+", l: "Artisans Partnered" },
            { n: 10000, s: "+", l: "Products Sold" },
            { n: 38, s: "/38", l: "Bihar Districts Covered" },
          ].map((st, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-center py-8 px-4 text-white border-b sm:border-b-0 sm:border-r border-white/10 last:border-0">
              <div className="text-3xl sm:text-4xl font-black mb-1">
                <AnimatedCounter target={st.n} suffix={st.s} />
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider opacity-75">{st.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES (PRODUCT IMAGE ROLLOVERS) ===== */}
      <section ref={cats.ref} className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`flex justify-between items-end mb-10 ${cats.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="relative pb-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
              <span>🗂️</span> Browse Categories
            </div>
            <h2 className="text-3xl font-black tracking-tight">Shop by Category</h2>
            <p className="opacity-45 mt-2 text-sm">Discover authentic local products from Bihar</p>
            <div className="absolute bottom-0 left-0 w-14 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
          <Link href="/shop" className="text-primary font-semibold text-sm hover:underline underline-offset-4 transition-all hidden sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} name={cat.name} icon={cat.icon} index={i} isInView={cats.isInView} />
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section ref={featured.ref} className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 ${featured.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="relative pb-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
              <span>⭐</span> Top Picks
            </div>
            <h2 className="text-3xl font-black tracking-tight">Featured Products</h2>
            <p className="opacity-45 mt-2 text-sm">Handpicked items celebrating Bihar&apos;s rich culture</p>
            <div className="absolute bottom-0 left-0 w-14 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {["All", "Mithila Art", "Handlooms", "Sweets", "Spices", "Handicrafts"].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                    : "bg-white dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatured.slice(0, 8).map((p, i) => (
            <div key={p._id || p.id} className={featured.isInView ? "animate-fade-in-up" : "opacity-0"} style={{ animationDelay: `${i * 100}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
          {filteredFeatured.length === 0 && (
            <div className="col-span-full py-16 text-center opacity-40">
              <div className="text-4xl mb-3">📦</div>
              <p className="font-semibold text-sm">No products found in this category.</p>
            </div>
          )}
        </div>

        <div className={`text-center mt-12 ${featured.isInView ? "animate-fade-in-up [animation-delay:400ms]" : "opacity-0"}`}>
          <Link href="/shop" className="inline-flex items-center justify-center h-12 px-8 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-full shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300">
            Browse All Products →
          </Link>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section ref={whyUs.ref} className="py-20 px-4 md:px-8 bg-surface/50">
        <div className="max-w-7xl mx-auto w-full">
          <div className={`text-center mb-14 ${whyUs.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
              <span>💎</span> Why Bihar Bazaar
            </div>
            <h2 className="text-3xl font-black tracking-tight mt-1">Built for Bihar, Loved by India</h2>
            <p className="opacity-45 mt-3 max-w-lg mx-auto text-sm">
              We&apos;re more than a marketplace — we&apos;re a movement to put Bihar&apos;s incredible products on the national stage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`relative p-7 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 hover:before:opacity-100 before:transition-opacity ${whyUs.isInView ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-13 h-13 rounded-[14px] bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm opacity-55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section ref={reviews.ref} className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`text-center mb-14 ${reviews.isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
            <span>💬</span> Customer Stories
          </div>
          <h2 className="text-3xl font-black tracking-tight mt-1">Loved by Thousands</h2>
          <p className="opacity-45 mt-3 max-w-lg mx-auto text-sm">
            Real stories from real customers who discovered Bihar&apos;s treasures through our platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative p-7 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-400 ${reviews.isInView ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="absolute top-4 right-6 text-5xl font-serif text-primary/10 leading-none select-none">&ldquo;</span>
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-500 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed opacity-65 mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="review-avatar">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs opacity-45">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🔒", title: "Secure Payments", desc: "100% secure checkout" },
            { icon: "📦", title: "Pan-India Shipping", desc: "We deliver everywhere" },
            { icon: "🏷️", title: "GI Tagged Products", desc: "Certified authentic" },
            { icon: "💚", title: "Support Local", desc: "Empowering Bihar" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-xl shrink-0">{b.icon}</div>
              <div>
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="text-xs opacity-45">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section ref={newsletter.ref} className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent p-10 sm:p-12 text-white ${newsletter.isInView ? "animate-scale-in" : "opacity-0"}`}>
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          <div className="relative z-10 text-center max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Stay in the Loop</h2>
            <p className="opacity-75 mb-8 text-sm sm:text-base">
              Get exclusive deals, new product alerts, and stories from Bihar&apos;s artisan communities.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email..."
                suppressHydrationWarning
                className="flex-1 px-5 py-3.5 rounded-xl border-[1.5px] border-white/20 bg-white/10 backdrop-blur-sm text-white text-[15px] placeholder:text-white/50 outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              />
              <button 
                type="submit" 
                suppressHydrationWarning
                className="px-7 py-3.5 rounded-xl bg-white text-primary-dark font-bold text-[15px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 whitespace-nowrap"
              >
                Subscribe ✨
              </button>
            </form>
            <p className="text-xs opacity-45 mt-4">No spam, ever. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
