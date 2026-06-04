"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = searchParams.get("category") || "All";
    const query = searchParams.get("search") || "";
    setSelectedCategory(category);
    setSearch(query);
  }, [searchParams]);

  useEffect(() => { 
    setVisible(true); 
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }
    if (search.trim()) {
      params.append("search", search.trim());
    }
    if (sortBy && sortBy !== "default") {
      params.append("sort", sortBy);
    }

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, sortBy]);

  const filtered = useMemo(() => {
    return products;
  }, [products]);

  return (
    <div>
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-transparent py-12 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10">
          <div className={visible ? "animate-fade-in-up" : "opacity-0"}>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/15 rounded-full mb-3">
              <span>🛍️</span> Explore Products
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Shop All Products</h1>
            <p className="opacity-45 max-w-md text-sm">Browse authentic products from Bihar&apos;s finest artisans & vendors.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {/* Search & Sort */}
        <div className={`flex flex-col md:flex-row gap-4 mb-6 ${visible ? "animate-fade-in-up [animation-delay:100ms]" : "opacity-0"}`}>
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search products, vendors, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all text-sm"
            />
          </div>
          <select
            suppressHydrationWarning
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm font-medium min-w-[180px]"
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Category pills */}
        <div className={`flex flex-wrap gap-2 mb-8 ${visible ? "animate-fade-in-up [animation-delay:200ms]" : "opacity-0"}`}>
          <button
            suppressHydrationWarning
            onClick={() => setSelectedCategory("All")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === "All"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-white/5 border border-black/8 dark:border-white/8 hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              suppressHydrationWarning
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white dark:bg-white/5 border border-black/8 dark:border-white/8 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="mb-6 text-sm opacity-40 font-medium">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}
        </div>

        {loading ? (
          <div className="text-center py-20 opacity-40">Loading products...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <div key={p.id} className={visible ? "animate-fade-in-up" : "opacity-0"} style={{ animationDelay: `${Math.min(i * 60, 500)}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl font-semibold">No products found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              className="mt-4 inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-full hover:-translate-y-0.5 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Header />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-r from-black/[0.04] via-black/[0.08] to-black/[0.04] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
                <div className="h-4 w-20 rounded bg-black/[0.04]" />
                <div className="h-5 w-full rounded bg-black/[0.04]" />
                <div className="h-4 w-16 rounded bg-black/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
