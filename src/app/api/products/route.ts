import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { getAuthUser } from "@/lib/apiAuth";
import { products as seedProducts } from "@/data/products";

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const sellerId = searchParams.get("sellerId");

    // Auto-seed if empty
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      await ProductModel.insertMany(
        seedProducts.map((p) => ({
          ...p,
          _id: undefined,
          stock: (p as any).stock ?? 50,
          status: "active",
          mockReviews: p.mockReviews || [],
        }))
      );
    }

    const query: any = {};
    if (sellerId) {
      const user = await getAuthUser(req);
      if (!user || (user.id !== sellerId && user.role !== "admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      query.sellerId = sellerId;
    } else {
      query.status = "active";
    }

    if (category && category !== "All") query.category = category;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { vendor: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortQuery: any = { createdAt: -1 };
    if (sort === "price-asc") sortQuery = { price: 1 };
    if (sort === "price-desc") sortQuery = { price: -1 };
    if (sort === "rating") sortQuery = { rating: -1 };

    const products = await ProductModel.find(query).sort(sortQuery).lean();
    return NextResponse.json(products);
  } catch (err: any) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "seller" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    if (!data.name || !data.description || data.price === undefined || !data.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await ProductModel.create({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      category: data.category,
      vendor: data.vendor || user.name,
      sellerId: user.id,
      stock: Number(data.stock) || 0,
      status: user.role === "admin" ? "active" : "active",
      image: data.image || "",
      images: Array.isArray(data.images) ? data.images : [],
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      details: typeof data.details === "object" ? data.details : {},
      brandDescription: data.brandDescription || "",
      videoUrl: data.videoUrl || "",
      rating: 0,
      reviews: 0,
      inStock: Number(data.stock) > 0,
      mockReviews: [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Failed to create product", details: err.message }, { status: 500 });
  }
}
