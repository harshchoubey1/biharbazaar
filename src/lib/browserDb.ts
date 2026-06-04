import { products as initialProducts, Product } from "@/data/products";

// Helper to check if window is defined (browser environment)
const isBrowser = typeof window !== "undefined";

export interface SellerProfile {
  id: string;
  userId: string;
  shopName: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  user?: { email: string };
}

// ── PRODUCT HELPERS ───────────────────────────────────────────

export function initDb() {
  if (!isBrowser) return;

  // Initialize products if not present
  if (!localStorage.getItem("ekart-products")) {
    localStorage.setItem("ekart-products", JSON.stringify(initialProducts));
  }

  // Initialize seller profiles if not present
  if (!localStorage.getItem("ekart-sellers")) {
    const demoSellers: SellerProfile[] = [
      {
        id: "demo-seller-profile",
        userId: "demo-seller",
        shopName: "Bihar Bazaar Seller",
        description: "Authentic local seller of handloom sarees and sweets from Bhagalpur.",
        status: "approved",
        createdAt: new Date().toISOString(),
        user: { email: "seller@demo.com" }
      }
    ];
    localStorage.setItem("ekart-sellers", JSON.stringify(demoSellers));
  }
}

export function getProducts(filters?: { category?: string; search?: string; sort?: string; sellerId?: string }): Product[] {
  if (!isBrowser) return [];
  initDb();

  let list: Product[] = [];
  try {
    list = JSON.parse(localStorage.getItem("ekart-products") || "[]");
  } catch {
    list = initialProducts;
  }

  if (filters?.sellerId) {
    list = list.filter((p: any) => p.sellerId === filters.sellerId);
  }

  if (filters?.category && filters.category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters?.sort) {
    if (filters.sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (filters.sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
  }

  return list;
}

export function getProductById(id: string | number): Product | null {
  if (!isBrowser) return null;
  initDb();

  const list = getProducts();
  const found = list.find((p) => String(p.id) === String(id));
  return found || null;
}

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  "Mithila Art": "https://images.unsplash.com/photo-1579783900862-c7f8fb00d3d4?q=80&w=800",
  "Handlooms": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800",
  "Sweets": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800",
  "Spices": "https://images.unsplash.com/photo-1604152006599-47dc062f8546?q=80&w=800",
  "Handicrafts": "https://images.unsplash.com/photo-1582200234149-14a9ec0444ff?q=80&w=800",
  "Electronics": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800"
};

export function createProduct(payload: any): Product | null {
  if (!isBrowser) return null;
  initDb();

  try {
    const list = getProducts();
    const newId = list.length > 0 ? Math.max(...list.map((p) => Number(p.id) || 0)) + 1 : 1;

    let defaultImg = CATEGORY_DEFAULT_IMAGES[payload.category] || "https://images.unsplash.com/photo-1579783900862-c7f8fb00d3d4?q=80&w=800";
    let mainImg = payload.image;
    if (!mainImg || mainImg === "bg-zinc-200 dark:bg-zinc-800" || mainImg.startsWith("bg-")) {
      mainImg = defaultImg;
    }

    let imgs = [];
    if (payload.images) {
      try {
        imgs = typeof payload.images === "string" ? JSON.parse(payload.images) : payload.images;
      } catch {
        imgs = [mainImg];
      }
    }
    if (!imgs || imgs.length === 0) {
      imgs = [mainImg];
    }

    let highlights = [];
    if (payload.highlights) {
      try {
        highlights = typeof payload.highlights === "string" ? JSON.parse(payload.highlights) : payload.highlights;
      } catch {
        highlights = [];
      }
    }

    let details = {};
    if (payload.details) {
      try {
        details = typeof payload.details === "string" ? JSON.parse(payload.details) : payload.details;
      } catch {
        details = {};
      }
    }

    const newProduct: Product = {
      id: newId,
      name: payload.name,
      price: Number(payload.price),
      originalPrice: payload.originalPrice ? Number(payload.originalPrice) : undefined,
      description: payload.description,
      category: payload.category,
      vendor: payload.vendor || "Unknown Vendor",
      rating: 0,
      reviews: 0,
      inStock: Number(payload.stock) > 0,
      image: mainImg,
      images: imgs,
      highlights: highlights,
      details: details,
      brandDescription: payload.brandDescription || "",
      mockReviews: [],
      ...({ sellerId: payload.sellerId, status: payload.status || "active", stock: Number(payload.stock) } as any)
    };

    const updated = [newProduct, ...list];
    localStorage.setItem("ekart-products", JSON.stringify(updated));
    return newProduct;
  } catch (err) {
    console.error("Error creating product in local storage:", err);
    return null;
  }
}

export function deleteProduct(id: string | number): boolean {
  if (!isBrowser) return false;
  initDb();

  try {
    const list = getProducts();
    const filtered = list.filter((p) => String(p.id) !== String(id));
    localStorage.setItem("ekart-products", JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function toggleProductStatus(id: string | number): boolean {
  if (!isBrowser) return false;
  initDb();

  try {
    const list = getProducts();
    const updated = list.map((p: any) => {
      if (String(p.id) === String(id)) {
        return { ...p, status: p.status === "active" ? "draft" : "active" };
      }
      return p;
    });
    localStorage.setItem("ekart-products", JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function addReview(productId: string | number, reviewPayload: any): Product | null {
  if (!isBrowser) return null;
  initDb();

  try {
    const list = getProducts();
    let updatedProduct: Product | null = null;

    const updatedList = list.map((p) => {
      if (String(p.id) === String(productId)) {
        const newReview = {
          id: Date.now(),
          userName: reviewPayload.userName,
          rating: Number(reviewPayload.rating),
          title: reviewPayload.title,
          body: reviewPayload.body,
          date: new Date().toISOString().slice(0, 10),
          verified: false,
          helpful: 0
        };
        const mockReviews = [...(p.mockReviews || []), newReview];
        const newReviewsCount = mockReviews.length;
        const totalRating = mockReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = Number((totalRating / newReviewsCount).toFixed(1));

        updatedProduct = {
          ...p,
          mockReviews,
          reviews: newReviewsCount,
          rating: newRating
        };
        return updatedProduct;
      }
      return p;
    });

    localStorage.setItem("ekart-products", JSON.stringify(updatedList));
    return updatedProduct;
  } catch (err) {
    console.error("Error adding review:", err);
    return null;
  }
}

// ── SELLER PROFILE HELPERS ────────────────────────────────────

export function getSellers(): SellerProfile[] {
  if (!isBrowser) return [];
  initDb();

  try {
    return JSON.parse(localStorage.getItem("ekart-sellers") || "[]");
  } catch {
    return [];
  }
}

export function getSellerProfile(userId: string): SellerProfile | null {
  if (!isBrowser) return null;
  initDb();

  const sellers = getSellers();
  return sellers.find((s) => s.userId === userId) || null;
}

export function createSellerProfile(userId: string, data: { shopName: string; description: string; email: string }): SellerProfile {
  if (!isBrowser) throw new Error("Browser environment required");
  initDb();

  const sellers = getSellers();
  const existing = sellers.find((s) => s.userId === userId);
  if (existing) return existing;

  const newProfile: SellerProfile = {
    id: "seller-" + Math.random().toString(36).substr(2, 9),
    userId,
    shopName: data.shopName,
    description: data.description,
    status: userId.startsWith("demo-") ? "approved" : "pending",
    createdAt: new Date().toISOString(),
    user: { email: data.email }
  };

  sellers.push(newProfile);
  localStorage.setItem("ekart-sellers", JSON.stringify(sellers));
  return newProfile;
}

export function approveSeller(userId: string): boolean {
  if (!isBrowser) return false;
  initDb();

  try {
    const sellers = getSellers();
    const updated = sellers.map((s) => {
      if (s.userId === userId) {
        return { ...s, status: "approved" as const, rejectionReason: undefined };
      }
      return s;
    });
    localStorage.setItem("ekart-sellers", JSON.stringify(updated));

    // Update registered users role to seller if they are approved
    try {
      const registered = JSON.parse(localStorage.getItem("ekart-registered-users") || "{}");
      for (const email of Object.keys(registered)) {
        const item = registered[email];
        if (item.id === userId || item.user?.id === userId) {
          if (item.user) {
            item.user.role = "seller";
          } else {
            item.role = "seller";
          }
        }
      }
      localStorage.setItem("ekart-registered-users", JSON.stringify(registered));
    } catch {}

    return true;
  } catch {
    return false;
  }
}

export function rejectSeller(userId: string, reason: string): boolean {
  if (!isBrowser) return false;
  initDb();

  try {
    const sellers = getSellers();
    const updated = sellers.map((s) => {
      if (s.userId === userId) {
        return { ...s, status: "rejected" as const, rejectionReason: reason };
      }
      return s;
    });
    localStorage.setItem("ekart-sellers", JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}
