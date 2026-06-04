"use client";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  getSellerProfile, 
  createSellerProfile, 
  getProducts, 
  createProduct, 
  deleteProduct, 
  toggleProductStatus 
} from "@/lib/browserDb";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};


interface SellerProduct {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  status: "Active" | "Draft";
  description: string;
  images: string[];
  videoUrl?: string;
  highlights: string[];
  details: Record<string, string>;
  brandDescription: string;
}

export default function SellerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<string>("pending");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sellerProfile, setSellerProfile] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "Mithila Art",
    stock: "",
    description: "",
    brandDescription: "",
  });
  const [formImages, setFormImages] = useState<{ file: File; preview: string }[]>([]);
  const [formVideo, setFormVideo] = useState<{ file: File; name: string } | null>(null);
  const [formHighlights, setFormHighlights] = useState<string[]>([""]);
  const [formDetails, setFormDetails] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    try {
      const prof = getSellerProfile(user.id);
      if (prof) {
        setSellerStatus(prof.status);
        setRejectionReason(prof.rejectionReason || null);
        setSellerProfile(prof);
      } else if (user.id.startsWith('demo-')) {
        const demoProf = createSellerProfile(user.id, {
          shopName: "Bihar Bazaar Seller",
          description: "Authentic local seller of handloom sarees and sweets from Bhagalpur.",
          email: user.email || "seller@demo.com"
        });
        setSellerStatus(demoProf.status);
        setSellerProfile(demoProf);
      }

      const prods = getProducts({ sellerId: user.id });
      setMyProducts(prods.map((p: any) => ({
        ...p,
        status: p.status === "draft" ? "Draft" : "Active",
      })));
    } catch (err) {
      console.error("Error fetching local seller data:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">🏪</span>
          <h1 className="text-2xl font-bold mb-2">Become a Seller on Bihar Bazaar</h1>
          <p className="text-black/50 dark:text-white/50 mb-6 max-w-md text-center">
            Register as a seller to list your products and reach thousands of customers across Bihar.
          </p>
          <Link href="/seller-register" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90">
            Register as Seller
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Role check
  if (user.role !== "seller" && user.role !== "admin") {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <span className="text-6xl mb-4">🚫</span>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-black/50 dark:text-white/50 mb-6 max-w-md text-center">
            You are logged in as a {user.role}. Only seller accounts can access this dashboard.
          </p>
          <Link href="/seller-register" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90">
            Switch to Seller Account
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle Verification States
  if (sellerStatus !== "approved") {
    return (
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto w-full px-4 py-16 flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-3xl mb-6">
            {sellerStatus === "pending" ? "⏳" : "❌"}
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {sellerStatus === "pending" ? "Application Pending" : "Application Rejected"}
          </h1>
          <p className="text-lg text-center text-black/60 dark:text-white/60 mb-8 max-w-lg">
            {sellerStatus === "pending" 
              ? "Your seller application is currently being reviewed by our team. This usually takes 24-48 hours. We will notify you once you're approved to list products."
              : `Your application was not approved. Reason: ${rejectionReason || "Identity verification failed."}`
            }
          </p>
          <div className="flex gap-4">
            <Link href="/" className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 transition-colors">
              Return Home
            </Link>
            {sellerStatus === "rejected" && (
              <Link href="/contact" className="px-6 py-3 rounded-xl bg-primary text-white font-semibold">
                Contact Support
              </Link>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormImages((prev) => [...prev, ...newImages].slice(0, 8)); // Max 8 images
  };

  const removeImage = (idx: number) => {
    setFormImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].preview);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const handleVideoFile = (files: FileList | null) => {
    if (!files || !files[0]) return;
    setFormVideo({ file: files[0], name: files[0].name });
  };

  const addHighlight = () => setFormHighlights((prev) => [...prev, ""]);
  const removeHighlight = (idx: number) => setFormHighlights((prev) => prev.filter((_, i) => i !== idx));
  const updateHighlight = (idx: number, val: string) => {
    setFormHighlights((prev) => prev.map((h, i) => (i === idx ? val : h)));
  };

  const addDetail = () => setFormDetails((prev) => [...prev, { key: "", value: "" }]);
  const removeDetail = (idx: number) => setFormDetails((prev) => prev.filter((_, i) => i !== idx));
  const updateDetail = (idx: number, field: "key" | "value", val: string) => {
    setFormDetails((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d)));
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", originalPrice: "", category: "Mithila Art", stock: "", description: "", brandDescription: "" });
    formImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setFormImages([]);
    setFormVideo(null);
    setFormHighlights([""]);
    setFormDetails([{ key: "", value: "" }]);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.description) {
      alert("Please fill in all required fields including description.");
      return;
    }

    try {
      let uploadedUrls: string[] = [];
      if (formImages.length > 0) {
        uploadedUrls = await Promise.all(formImages.map(img => fileToBase64(img.file)));
      }

      const productPayload = {
        name: formData.name,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        stock: Number(formData.stock),
        status: "active",
        description: formData.description,
        image: uploadedUrls.length > 0 ? uploadedUrls[0] : "bg-zinc-200 dark:bg-zinc-800",
        images: uploadedUrls,
        videoUrl: formVideo?.name || null,
        highlights: formHighlights.filter((h) => h.trim()),
        details: Object.fromEntries(
          formDetails.filter((d) => d.key.trim() && d.value.trim()).map((d) => [d.key, d.value])
        ),
        brandDescription: formData.brandDescription,
        vendor: sellerProfile?.shopName || user.name || "Unknown Seller",
        sellerId: user.id,
      };

      const savedProduct = createProduct(productPayload);
      if (!savedProduct) {
        throw new Error("Failed to save product locally");
      }

      const newProd: SellerProduct = {
        id: savedProduct.id,
        name: savedProduct.name,
        price: savedProduct.price,
        originalPrice: savedProduct.originalPrice || undefined,
        category: savedProduct.category,
        stock: (savedProduct as any).stock || Number(formData.stock),
        status: (savedProduct as any).status === "draft" ? "Draft" : "Active",
        description: savedProduct.description,
        images: savedProduct.images || [],
        videoUrl: (savedProduct as any).videoUrl || undefined,
        highlights: savedProduct.highlights || [],
        details: savedProduct.details || {},
        brandDescription: savedProduct.brandDescription || "",
      };

      setMyProducts((prev) => [newProd, ...prev]);
      resetForm();
      setShowAddForm(false);
      alert("Product added successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Error adding product:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to add product.";
      alert(errorMsg);
    }
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const success = deleteProduct(id);
      if (success) {
        setMyProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    }
  };

  const toggleStatus = (id: string | number) => {
    const success = toggleProductStatus(id);
    if (success) {
      setMyProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p))
      );
    } else {
      alert("Failed to update status.");
    }
  };

  const totalRevenue = myProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

  const inputClass = "px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
            <p className="text-black/50 dark:text-white/50">Welcome, {user.name}</p>
          </div>
          <button
            onClick={() => { setShowAddForm(!showAddForm); if (showAddForm) resetForm(); }}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {showAddForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
            <p className="text-sm text-black/50 dark:text-white/50 mb-1">Total Products</p>
            <p className="text-3xl font-bold">{myProducts.length}</p>
          </div>
          <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
            <p className="text-sm text-black/50 dark:text-white/50 mb-1">Active Listings</p>
            <p className="text-3xl font-bold text-green-600">{myProducts.filter((p) => p.status === "Active").length}</p>
          </div>
          <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
            <p className="text-sm text-black/50 dark:text-white/50 mb-1">Inventory Value</p>
            <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* ═══════ ENHANCED ADD PRODUCT FORM ═══════ */}
        {showAddForm && (
          <div className="p-6 md:p-8 border border-primary/20 bg-primary/5 rounded-2xl mb-8 pdp-fade-in">
            <h2 className="text-xl font-bold mb-6">Add New Product</h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium block mb-1">Product Name *</label>
                <input placeholder="e.g. Madhubani Painting" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass + " w-full"} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputClass + " w-full"}>
                  <option>Mithila Art</option>
                  <option>Handlooms</option>
                  <option>Spices</option>
                  <option>Sweets</option>
                  <option>Handicrafts</option>
                  <option>Electronics</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Selling Price (₹) *</label>
                <input placeholder="999" type="number" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputClass + " w-full"} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">MRP / Original Price (₹)</label>
                <input placeholder="1499 (optional)" type="number" value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className={inputClass + " w-full"} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Stock Quantity *</label>
                <input placeholder="50" type="number" value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className={inputClass + " w-full"} />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-1">Product Description</label>
              <textarea placeholder="Describe your product..." value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3} className={inputClass + " w-full resize-none"} />
            </div>

            {/* ── Image Upload ── */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">Product Images (up to 8)</label>
              <input ref={imageInputRef} type="file" accept="image/*" multiple
                onChange={(e) => handleImageFiles(e.target.files)} className="hidden" />

              <div className="flex flex-wrap gap-3 mb-3">
                {formImages.map((img, idx) => (
                  <div key={idx} className="upload-preview">
                    <img src={img.preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="upload-preview-remove">×</button>
                  </div>
                ))}
                {formImages.length < 8 && (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="upload-zone !p-0 w-20 h-20 flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-2xl text-black/30 dark:text-white/30">+</span>
                    <span className="text-[10px] text-black/40 dark:text-white/40">Add</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-black/40 dark:text-white/40">
                {formImages.length}/8 images uploaded. First image will be the main product image.
              </p>
            </div>

            {/* ── Video Upload ── */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">Product Video (optional)</label>
              <input ref={videoInputRef} type="file" accept="video/*"
                onChange={(e) => handleVideoFile(e.target.files)} className="hidden" />

              {formVideo ? (
                <div className="flex items-center gap-3 p-3 border border-black/10 dark:border-white/10 rounded-lg">
                  <span className="text-2xl">🎬</span>
                  <span className="text-sm flex-1 truncate">{formVideo.name}</span>
                  <button onClick={() => setFormVideo(null)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              ) : (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="upload-zone w-full"
                >
                  <span className="text-3xl mb-2 block">🎥</span>
                  <span className="text-sm text-black/50 dark:text-white/50">Click to upload a product video</span>
                  <span className="text-xs text-black/30 dark:text-white/30 block mt-1">MP4, WebM up to 50MB</span>
                </button>
              )}
            </div>

            {/* ── Product Highlights ── */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">Product Highlights / Features</label>
              <div className="space-y-2">
                {formHighlights.map((h, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-black/30 dark:text-white/30 text-sm">•</span>
                    <input
                      value={h}
                      onChange={(e) => updateHighlight(idx, e.target.value)}
                      placeholder={`Feature ${idx + 1}`}
                      className={inputClass + " flex-1"}
                    />
                    {formHighlights.length > 1 && (
                      <button onClick={() => removeHighlight(idx)} className="text-red-400 hover:text-red-600 text-lg px-2">×</button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addHighlight}
                className="text-primary text-sm font-medium hover:underline mt-2">
                + Add another highlight
              </button>
            </div>

            {/* ── Product Details / Specs ── */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">Product Specifications</label>
              <div className="space-y-2">
                {formDetails.map((d, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      value={d.key}
                      onChange={(e) => updateDetail(idx, "key", e.target.value)}
                      placeholder="e.g. Material"
                      className={inputClass + " w-40"}
                    />
                    <input
                      value={d.value}
                      onChange={(e) => updateDetail(idx, "value", e.target.value)}
                      placeholder="e.g. Pure Silk"
                      className={inputClass + " flex-1"}
                    />
                    {formDetails.length > 1 && (
                      <button onClick={() => removeDetail(idx)} className="text-red-400 hover:text-red-600 text-lg px-2">×</button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addDetail}
                className="text-primary text-sm font-medium hover:underline mt-2">
                + Add another specification
              </button>
            </div>

            {/* ── Brand Description ── */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-1">Brand / Seller Description</label>
              <textarea placeholder="Tell customers about your brand and what makes your products special..."
                value={formData.brandDescription}
                onChange={(e) => setFormData({ ...formData, brandDescription: e.target.value })}
                rows={3} className={inputClass + " w-full resize-none"} />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button onClick={handleAdd} className="btn-buy-now !w-auto !rounded-xl px-8 py-3">
                🚀 Publish Product
              </button>
              <button onClick={() => { resetForm(); setShowAddForm(false); }}
                className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Product Table */}
        <div className="border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/[.02] dark:bg-white/[.02] text-left">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Images</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <tr key={product.id} className="border-t border-black/5 dark:border-white/5">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-black/60 dark:text-white/60">{product.category}</td>
                    <td className="px-6 py-4">
                      ₹{product.price.toLocaleString()}
                      {product.originalPrice && (
                        <span className="text-xs text-black/40 dark:text-white/40 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className="text-primary font-medium">{product.images.length}</span>
                      {product.videoUrl && <span className="text-xs text-black/40 dark:text-white/40 ml-1">+ 🎥</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => toggleStatus(product.id)} className="text-primary text-xs hover:underline">
                          {product.status === "Active" ? "Pause" : "Activate"}
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 text-xs hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
