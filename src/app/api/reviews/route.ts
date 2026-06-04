import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { getAuthUser } from "@/lib/apiAuth";

// POST /api/reviews  — add a review to a product
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);
    const { productId, rating, title, body } = await req.json();

    if (!productId || !rating || !title || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReview = {
      id: Date.now(),
      userName: user?.name || "Anonymous",
      rating: Number(rating),
      title,
      body,
      date: new Date().toISOString().slice(0, 10),
      verified: !!user,
      helpful: 0,
    };

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $push: { mockReviews: newReview },
        $inc: { reviews: 1 },
      },
      { new: true }
    );

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Recalculate avg rating
    const total = product.mockReviews.reduce((s: number, r: any) => s + r.rating, 0);
    product.rating = Number((total / product.mockReviews.length).toFixed(1));
    await product.save();

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to add review", details: err.message }, { status: 500 });
  }
}
