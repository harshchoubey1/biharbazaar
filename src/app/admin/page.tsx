"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  getSellers, 
  approveSeller as localApproveSeller, 
  rejectSeller as localRejectSeller 
} from "@/lib/browserDb";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"sellers" | "products">("products");
  const [sellers, setSellers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    if (!user) return; // Wait for user to load
    if (user.role !== "admin") {
      router.replace("/login");
      return;
    }
    if (activeTab === "sellers") {
      fetchSellers();
    } else {
      fetchProducts();
    }
  }, [user, router, activeTab]);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const data = getSellers();
      setSellers(data);
    } catch {
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setActionMsg("Product deleted ✓");
        setTimeout(() => setActionMsg(""), 3000);
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Error deleting product.");
    }
  };

  const approveSeller = async (userId: string) => {
    const success = localApproveSeller(userId);
    if (success) {
      setActionMsg("Seller approved ✓");
      setTimeout(() => setActionMsg(""), 3000);
      fetchSellers();
    } else {
      alert("Failed to approve seller.");
    }
  };

  const rejectSeller = async (userId: string) => {
    const success = localRejectSeller(userId, rejectReason || "Does not meet requirements");
    if (success) {
      setRejectingId(null);
      setRejectReason("");
      setActionMsg("Seller rejected.");
      setTimeout(() => setActionMsg(""), 3000);
      fetchSellers();
    } else {
      alert("Failed to reject seller.");
    }
  };

  const filtered = sellers.filter(s => filter === "all" ? true : s.status === filter);

  const statusBadge = (s: string) => {
    if (s === "approved") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (s === "rejected") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm opacity-50">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-black/8 dark:border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-black bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">🛕 Bihar Bazaar</Link>
          <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <p className="text-sm opacity-50">{user?.email}</p>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Seller Management</h1>
          {actionMsg && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
              {actionMsg}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-black/10 dark:border-white/10">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-2 px-2 font-bold transition-all border-b-2 ${activeTab === "products" ? "border-amber-500 text-amber-600 dark:text-amber-400" : "border-transparent opacity-50"}`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab("sellers")}
            className={`pb-2 px-2 font-bold transition-all border-b-2 ${activeTab === "sellers" ? "border-amber-500 text-amber-600 dark:text-amber-400" : "border-transparent opacity-50"}`}
          >
            Manage Sellers
          </button>
        </div>

        {activeTab === "products" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
            {loading ? (
              <div className="py-16 text-center opacity-40">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center opacity-40">No products found.</div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {products.map(p => (
                  <div key={p._id || p.id} className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="text-sm opacity-50">{p.category} • ₹{p.price}</p>
                    </div>
                    <button
                      onClick={() => deleteProduct(p._id || p.id)}
                      className="px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "sellers" && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Pending", val: sellers.filter(s => s.status === "pending").length, color: "amber" },
                { label: "Approved", val: sellers.filter(s => s.status === "approved").length, color: "green" },
                { label: "Rejected", val: sellers.filter(s => s.status === "rejected").length, color: "red" },
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-xl border border-black/5 dark:border-white/5 p-4 text-center">
                  <div className="text-2xl font-black">{stat.val}</div>
                  <div className="text-xs font-medium opacity-50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {(["pending", "approved", "rejected", "all"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${filter === f ? "bg-amber-400 text-black" : "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:border-amber-300"}`}>
                  {f}
                </button>
              ))}
            </div>

            {/* Sellers list */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="py-16 text-center opacity-40">
                  <div className="text-4xl mb-3">🏪</div>
                  <p className="font-medium">No {filter} sellers</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {filtered.map(seller => (
                    <div key={seller.id} className="p-5">
                      {rejectingId === seller.userId ? (
                        <div className="space-y-3">
                          <p className="font-semibold text-sm">Rejection reason for <span className="text-amber-600">{seller.shopName}</span>:</p>
                          <input
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Enter reason (optional)"
                            className="w-full px-3 py-2 text-sm border border-black/15 dark:border-white/15 rounded-lg bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => rejectSeller(seller.userId)} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition">Confirm Reject</button>
                            <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="px-4 py-2 border border-black/15 dark:border-white/15 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold">{seller.shopName}</h3>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusBadge(seller.status)}`}>{seller.status}</span>
                            </div>
                            <p className="text-sm opacity-50">{seller.user?.email}</p>
                            {seller.description && <p className="text-sm opacity-60 mt-1">{seller.description}</p>}
                            {seller.rejectionReason && (
                              <p className="text-xs text-red-500 mt-1">Reason: {seller.rejectionReason}</p>
                            )}
                            <p className="text-xs opacity-30 mt-1">Registered: {new Date(seller.createdAt).toLocaleDateString("en-IN")}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {seller.status !== "approved" && (
                              <button onClick={() => approveSeller(seller.userId)} className="px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition">Approve</button>
                            )}
                            {seller.status !== "rejected" && (
                              <button onClick={() => setRejectingId(seller.userId)} className="px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition">Reject</button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
