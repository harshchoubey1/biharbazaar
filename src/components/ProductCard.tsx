"use client";
import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const categoryEmoji: Record<string, string> = {
  "Mithila Art": "🎨",
  Handlooms: "🥻",
  Spices: "🌿",
  Sweets: "🍬",
  Handicrafts: "🏺",
  Electronics: "📱",
};

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productId = product.id || product._id;

  return (
    <div
      id={`product-card-${productId}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <Link href={`/product/${productId}`}>
        <div className={`relative w-full aspect-square overflow-hidden ${(product.image?.startsWith('http') || product.image?.startsWith('/')) ? '' : product.image || 'bg-gray-200'}`}>
          {(product.image?.startsWith('http') || product.image?.startsWith('/')) && (
            <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-red-500/30">
              -{discount}%
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <button
              suppressHydrationWarning
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 flex items-center justify-center text-sm shadow-lg hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-200"
              title="Wishlist"
              aria-label="Add to wishlist"
            >
              &#9825;
            </button>
            <button
              suppressHydrationWarning
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-black/5 dark:border-white/10 flex items-center justify-center text-sm shadow-lg hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-200"
              title="Quick View"
              aria-label="Quick view"
            >
              &#128065;
            </button>
          </div>

          {/* Product emoji */}
          {(!product.image?.startsWith('http') && !product.image?.startsWith('/')) && (
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:opacity-30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              {categoryEmoji[product.category] || "📦"}
            </div>
          )}

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-40">
          {product.vendor}
        </div>
        <Link href={`/product/${productId}`}>
          <h3 className="font-bold text-[0.95rem] leading-snug group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-extrabold text-lg tracking-tight">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs opacity-40 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs opacity-50">
          <span className="text-yellow-500">★</span> {product.rating}{" "}
          <span className="opacity-60">({product.reviews})</span>
        </div>

        <button
          onClick={() => addToCart(product)}
          suppressHydrationWarning
          className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:translate-y-0 transition-all duration-300 relative overflow-hidden group/btn"
        >
          <span className="relative z-10">Add to Cart</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
