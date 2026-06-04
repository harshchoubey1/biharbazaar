import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const reviewIdNum = Number(id);

    // Update the helpful count in the nested review array
    const product = await Product.findOneAndUpdate(
      { "mockReviews.id": reviewIdNum },
      { $inc: { "mockReviews.$.helpful": 1 } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const review = product.mockReviews.find((r: any) => r.id === reviewIdNum);
    return NextResponse.json(review);
  } catch (error: any) {
    console.error("PUT /api/reviews/[id] error:", error);
    return NextResponse.json({ error: "Failed to update review helpfulness" }, { status: 500 });
  }
}
