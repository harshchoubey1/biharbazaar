














"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MockReview } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getProductById, getProducts, addReview } from "@/lib/browserDb";


const VirtualTryOn = dynamic(() => import("@/components/VirtualTryOn"), { ssr: false });

/* ── Star rendering helper ───────────────────────────────────────── */
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars-display" style={{ fontSize: size }}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`}>★</span>
      ))}
      {half && <span>★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="star-empty">★</span>
      ))}
    </span>
  );
}

/* ── Rating breakdown bar ────────────────────────────────────────── */
function RatingBreakdown({ reviews }: { reviews: MockReview[] }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return (
    <div className="space-y-1">
      {[5, 4, 3, 2, 1].map((star, idx) => {
        const pct = total ? Math.round((counts[idx] / total) * 100) : 0;
        return (
          <div key={star} className="rating-bar-container">
            <span className="rating-bar-label">{star} star</span>
            <div className="rating-bar-track">
              <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="rating-bar-percent">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Review Card ─────────────────────────────────────────────────── */
function ReviewCard({ review }: { review: MockReview }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (voted) return;
    setHelpfulCount((c) => c + 1);
    setVoted(true);
  };

  const initials = review.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="review-card pdp-fade-in">
      {/* Reviewer info */}
      <div className="flex items-center gap-3 mb-2">
        <div className="review-avatar">{initials}</div>
        <span className="text-sm font-medium">{review.userName}</span>
      </div>

      {/* Stars + title */}
      <div className="flex items-center gap-2 mb-1">
        <Stars rating={review.rating} size={14} />
        <span className="font-semibold text-sm">{review.title}</span>
      </div>

      {/* Date + verified */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs text-black/40 dark:text-white/40">
          Reviewed on {new Date(review.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
        </span>
        {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
      </div>

      {/* Body */}
      <p className="text-sm leading-relaxed text-black/70 dark:text-white/70 mb-3">
        {review.body}
      </p>

      {/* Helpful */}
      <button
        onClick={handleHelpful}
        className={`helpful-btn ${voted ? "opacity-60 cursor-default" : ""}`}
        disabled={voted}
      >
        👍 Helpful ({helpfulCount})
      </button>
    </div>
  );
}

/* ── Write Review Form ───────────────────────────────────────────── */
function WriteReviewForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (review: Omit<MockReview, "id" | "helpful">) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !title || !body || !name) return;
    onSubmit({
      userName: name,
      rating,
      title,
      body,
      date: new Date().toISOString().slice(0, 10),
      verified: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border border-black/10 dark:border-white/10 rounded-xl bg-black/[.01] dark:bg-white/[.02] pdp-fade-in">
      <h3 className="text-lg font-bold mb-4">Write a Review</h3>

      {/* Stars */}
      <div className="mb-4">
        <label className="text-sm font-medium block mb-2">Overall Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`review-form-star ${s <= (hoverRating || rating) ? "filled" : ""}`}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          required
        />
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Review Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's most important to know?"
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          required
        />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Your Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you like or dislike? How did you use the product?"
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="btn-buy-now !w-auto !rounded-lg px-6"
        >
          Submit Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg border border-black/10 dark:border-white/10 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ── Similar Product Card (Mini) ─────────────────────────────────── */
function SimilarProductCard({ product }: { product: any }) {
  const emoji =
    product.category === "Mithila Art" ? "🎨" :
    product.category === "Handlooms" ? "🧵" :
    product.category === "Spices" ? "🌶️" :
    product.category === "Sweets" ? "🍬" :
    product.category === "Handicrafts" ? "🏺" : "📱";

  const safeImages = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
  const mainImage = safeImages[0];

  return (
    <Link href={`/product/${product.id}`} className="block min-w-[180px] max-w-[200px] flex-shrink-0 group">
      <div className={`w-full aspect-square rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-[1.03] ${(mainImage?.startsWith('http') || mainImage?.startsWith('/')) ? 'overflow-hidden bg-zinc-100 dark:bg-zinc-800' : mainImage}`}>
        {(mainImage?.startsWith('http') || mainImage?.startsWith('/')) ? (
          <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-25">{emoji}</span>
        )}
      </div>
      <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
        {product.name}
      </h4>
      <div className="flex items-center gap-1 mb-1">
        <Stars rating={product.rating || 0} size={12} />
        <span className="text-xs text-black/40 dark:text-white/40">({product.reviews || 0})</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm">₹{product.price.toLocaleString()}</span>
        {product.originalPrice && (
          <span className="text-xs text-black/40 dark:text-white/40 line-through">₹{product.originalPrice.toLocaleString()}</span>
        )}
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PRODUCT DETAIL PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [userReviews, setUserReviews] = useState<MockReview[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]); // Still needed for similar products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    try {
      const p = getProductById(params.id as string);
      if (p) {
        setProduct(p);
      }
      const data = getProducts();
      setAllProducts(data);
    } catch (e) {
      console.error("Error loading product detail:", e);
    } finally {
      setLoading(false);
    }
  }, [params.id]);
  const isTryOnEligible = ["Handlooms", "Mithila Art", "Handicrafts"].includes(product?.category ?? "");

  const similarProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    return allProducts.filter((p) => p.category === product.category && String(p.id) !== String(product.id)).slice(0, 8);
  }, [product, allProducts]);

  if (loading) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/shop" className="text-primary hover:underline">Back to Shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allReviews = [...product.mockReviews, ...userReviews];
  const displayedReviews = showAllReviews ? allReviews : allReviews.slice(0, 3);
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const deliveryDate = new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const safeImages = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
  const activeImageIdx = safeImages.length > 0 ? Math.min(selectedImage, Math.max(0, safeImages.length - 1)) : 0;
  const activeImage = safeImages[activeImageIdx];

  const emoji =
    product.category === "Mithila Art" ? "🎨" :
    product.category === "Handlooms" ? "🧵" :
    product.category === "Spices" ? "🌶️" :
    product.category === "Sweets" ? "🍬" :
    product.category === "Handicrafts" ? "🏺" : "📱";

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    router.push("/checkout");
  };

  const handleReviewSubmit = (review: Omit<MockReview, "id" | "helpful">) => {
    const updated = addReview(product.id, review);
    if (updated) {
      setProduct(updated);
      alert("Thank you! Your review has been submitted successfully.");
    }
    setShowWriteReview(false);
  };

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = dir === "left" ? -400 : 400;
    carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {showTryOn && product && (
        <VirtualTryOn
          productName={product.name}
          productEmoji={emoji}
          productImage={product.image}
          onClose={() => setShowTryOn(false)}
        />
      )}
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50 mb-6">
          <Link href="/" className="hover:text-primary hover:underline">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-primary hover:underline">Shop</Link>
          <span>›</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary hover:underline">{product.category}</Link>
          <span>›</span>
          <span className="text-black/70 dark:text-white/70 line-clamp-1">{product.name}</span>
        </nav>

        {/* ═══════ MAIN LAYOUT: Gallery + Info ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="pdp-gallery sticky top-4">
              {/* Thumbnails */}
              <div className="pdp-thumbnails">
                {safeImages.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`pdp-thumb ${activeImageIdx === idx ? "active" : ""}`}
                    onMouseEnter={() => setSelectedImage(idx)}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <div className={`w-full h-full flex items-center justify-center ${(img?.startsWith('http') || img?.startsWith('/')) ? 'overflow-hidden' : img}`}>
                      {(img?.startsWith('http') || img?.startsWith('/')) ? (
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg opacity-20">{emoji}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="pdp-main-image">
                <div className={`pdp-main-image-inner ${(activeImage?.startsWith('http') || activeImage?.startsWith('/')) ? 'overflow-hidden bg-zinc-100 dark:bg-zinc-800' : activeImage}`}>
                  {(activeImage?.startsWith('http') || activeImage?.startsWith('/')) ? (
                    <img src={activeImage} alt={product.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-8xl opacity-20">{emoji}</span>
                  )}
                </div>
                <div className="zoom-hint">🔍 Hover to zoom</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-7 pdp-fade-in">
            {/* Brand */}
            <p className="text-sm text-[#007185] dark:text-[#4db8c7] hover:text-primary cursor-pointer hover:underline mb-1">
              Visit the {product.vendor} Store
            </p>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-medium leading-tight mb-2">
              {product.name}
            </h1>

            {/* Rating line */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-sm font-medium text-[#007185] dark:text-[#4db8c7]">{product.rating}</span>
              <Stars rating={product.rating} size={16} />
              <span className="text-sm text-[#007185] dark:text-[#4db8c7] hover:underline cursor-pointer">
                {product.reviews.toLocaleString()} ratings
              </span>
            </div>

            {/* Divider */}
            <hr className="border-black/8 dark:border-white/8 mb-3" />

            {/* Price Section */}
            <div className="mb-4">
              {product.originalPrice && discountPct > 0 && (
                <div className="mb-1">
                  <span className="deal-badge">Limited time deal</span>
                </div>
              )}
              <div className="flex items-baseline gap-3 flex-wrap">
                {product.originalPrice && discountPct > 0 && (
                  <span className="text-2xl font-medium text-[#CC0C39]">-{discountPct}%</span>
                )}
                <span className="text-3xl font-medium">₹{product.price.toLocaleString()}</span>
              </div>
              {product.originalPrice && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-black/50 dark:text-white/50">M.R.P.: </span>
                  <span className="text-sm text-black/50 dark:text-white/50 line-through">₹{product.originalPrice.toLocaleString()}</span>
                </div>
              )}
              <p className="text-xs text-black/40 dark:text-white/40 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Delivery Info */}
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800/30 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-700 dark:text-green-400 font-semibold text-sm">🚚 FREE Delivery</span>
              </div>
              <p className="text-sm text-black/70 dark:text-white/70">
                <strong>{deliveryDate}</strong>. Order within <span className="text-green-700 dark:text-green-400 font-medium">12 hrs</span>
              </p>
              <p className="text-xs text-black/50 dark:text-white/50 mt-1">Free delivery across Bihar for orders above ₹500</p>
            </div>

            {/* In Stock */}
            {product.inStock ? (
              <p className="text-lg font-medium text-green-700 dark:text-green-400 mb-4">In Stock</p>
            ) : (
              <p className="text-lg font-medium text-red-600 mb-4">Currently Unavailable</p>
            )}

            {/* About this item */}
            {product.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-sm mb-2">About this item</h3>
                <ul className="highlight-list">
                  {product.highlights.map((h: string, i: number) => (
                    <li key={i} className="text-black/70 dark:text-white/70">{h}</li>
                  ))}
                </ul>
              </div>
            )}

            <hr className="border-black/8 dark:border-white/8 mb-4" />

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">Quantity:</span>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 max-w-md">
              <button onClick={handleAddToCart} className="btn-add-to-cart flex-1">
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
              <button onClick={handleBuyNow} className="btn-buy-now flex-1">
                Buy Now
              </button>
            </div>

            {/* Virtual Try-On Button */}
            {isTryOnEligible && (
              <button
                id="virtual-try-on-btn"
                onClick={() => setShowTryOn(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-violet-500 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors mb-5 max-w-md"
              >
                <span className="text-lg">✨</span>
                Virtual Try-On
                <span className="ml-auto text-[10px] bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-bold">Powered by Google AR</span>
              </button>
            )}

            {/* Seller + Return info */}
            <div className="text-sm space-y-1 mb-4">
              <p className="text-black/60 dark:text-white/60">
                Sold by <span className="text-[#007185] dark:text-[#4db8c7] hover:underline cursor-pointer font-medium">{product.vendor}</span>
              </p>
              <p className="text-black/60 dark:text-white/60">
                <span className="font-medium">🔄 10 days</span> Return & Exchange Policy
              </p>
            </div>
          </div>
        </div>

        {/* ═══════ PRODUCT DETAILS TABLE ═══════ */}
        {Object.keys(product.details).length > 0 && (
          <div className="pdp-section pdp-fade-in">
            <h2 className="text-lg font-bold mb-4">Product Details</h2>
            <div className="max-w-2xl rounded-xl overflow-hidden border border-black/6 dark:border-white/6">
              <table className="product-details-table">
                <tbody>
                  {Object.entries(product.details).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td className="text-black/70 dark:text-white/70">{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════ BRAND DESCRIPTION / FROM THE SELLER ═══════ */}
        {product.brandDescription && (
          <div className="pdp-section pdp-fade-in">
            <h2 className="text-lg font-bold mb-3">From the Brand</h2>
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
              <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                {product.brandDescription}
              </p>
            </div>
          </div>
        )}

        {/* ═══════ CUSTOMER REVIEWS ═══════ */}
        <div className="pdp-section pdp-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Overall + Breakdown */}
            <div className="md:col-span-4">
              <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>
              <div className="flex items-center gap-3 mb-3">
                <Stars rating={product.rating} size={20} />
                <span className="text-lg font-medium">{product.rating} out of 5</span>
              </div>
              <p className="text-sm text-black/50 dark:text-white/50 mb-4">
                {allReviews.length} total ratings
              </p>
              <RatingBreakdown reviews={allReviews} />

              <hr className="border-black/8 dark:border-white/8 my-6" />

              <h3 className="font-bold text-sm mb-2">Review this product</h3>
              <p className="text-sm text-black/50 dark:text-white/50 mb-3">Share your thoughts with other customers</p>
              <button
                onClick={() => setShowWriteReview(true)}
                className="w-full py-2.5 rounded-lg border border-black/15 dark:border-white/15 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Write a customer review
              </button>
            </div>

            {/* Right: Review Cards */}
            <div className="md:col-span-8">
              {showWriteReview && (
                <WriteReviewForm
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowWriteReview(false)}
                />
              )}

              <h3 className="font-bold mb-4">Top Reviews</h3>
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}

              {allReviews.length > 3 && !showAllReviews && (
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="text-[#007185] dark:text-[#4db8c7] text-sm font-medium hover:underline mt-4"
                >
                  See all {allReviews.length} reviews →
                </button>
              )}

              {showAllReviews && allReviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(false)}
                  className="text-[#007185] dark:text-[#4db8c7] text-sm font-medium hover:underline mt-4"
                >
                  Show less
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══════ SIMILAR PRODUCTS CAROUSEL ═══════ */}
        {similarProducts.length > 0 && (
          <div className="pdp-section pdp-fade-in">
            <h2 className="text-lg font-bold mb-4">Products related to this item</h2>
            <div className="carousel-container">
              <button className="carousel-btn carousel-btn-left" onClick={() => scrollCarousel("left")}>‹</button>
              <div className="carousel-track" ref={carouselRef}>
                {similarProducts.map((sp) => (
                  <SimilarProductCard key={sp.id} product={sp} />
                ))}
              </div>
              <button className="carousel-btn carousel-btn-right" onClick={() => scrollCarousel("right")}>›</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
