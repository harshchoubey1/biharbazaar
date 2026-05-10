import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Get all products (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const sellerId = searchParams.get("sellerId");

    const where: any = { status: "active" };

    if (sellerId) {
      const session = await auth();
      if (session?.user?.id === sellerId || (session?.user as any)?.role === "admin") {
        delete where.status;
      }
      where.sellerId = sellerId;
    }

    if (category && category !== "All") where.category = category;
    
    if (search) {
      where.AND = [
        {
          OR: [
            { name: { contains: search } },
            { vendor: { contains: search } },
            { category: { contains: search } },
          ],
        },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };

    const products = await prisma.product.findMany({ where, orderBy });
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Create a new product (seller)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const data = await req.json();
    
    console.log("POST /api/products - Session:", JSON.stringify(session));
    console.log("POST /api/products - Data:", JSON.stringify(data));

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "seller" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check seller is approved (unless admin or demo)
    const isDemoSeller = session.user.email === "seller@demo.com" || session.user.id?.startsWith("demo-");
    
    // Ensure the user exists in the database to prevent foreign key errors
    // This is especially important for demo accounts that might not be in the DB yet
    let dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser && isDemoSeller) {
      dbUser = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || `${session.user.id}@demo.com`,
          name: session.user.name || "Demo User",
          role: (session.user as any).role || "seller",
        }
      });
    }

    if (role === "seller" && !isDemoSeller) {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!sellerProfile || sellerProfile.status !== "approved") {
        return NextResponse.json({ error: "Seller account not approved yet. Please wait for admin approval." }, { status: 403 });
      }
    }

    if (!data.name || !data.description || data.price === undefined || !data.category || data.stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let images = "[]";
    try { images = JSON.stringify(Array.isArray(data.images) ? data.images : JSON.parse(data.images || "[]")); } catch {}
    
    let highlights = "[]";
    try { highlights = JSON.stringify(Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || "[]")); } catch {}
    
    let details = "{}";
    try { details = JSON.stringify(typeof data.details === "object" && data.details !== null ? data.details : JSON.parse(data.details || "{}")); } catch {}

    const product = await prisma.product.create({
      data: {
        name: String(data.name),
        description: String(data.description),
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        category: String(data.category),
        stock: Number(data.stock),
        image: data.image ? String(data.image) : undefined,
        images,
        videoUrl: data.videoUrl ? String(data.videoUrl) : undefined,
        highlights,
        details,
        brandDescription: data.brandDescription ? String(data.brandDescription) : undefined,
        
        sellerId: session.user.id,
        rating: 0,
        reviews: 0,
        status: (role === "admin" || isDemoSeller) ? "active" : "draft",
        vendor: session.user.name || "Unknown Vendor",
        inStock: Number(data.stock) > 0,
      }
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("API Error creating product:", error);
    return NextResponse.json({ 
      error: "Failed to create product", 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
