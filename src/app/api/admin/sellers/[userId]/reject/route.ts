import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SellerProfile from "@/models/SellerProfile";
import { getAuthUser } from "@/lib/apiAuth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectToDatabase();
    const { userId } = await params;
    const { reason } = await req.json();

    await SellerProfile.findOneAndUpdate(
      { userId },
      { status: "rejected", rejectionReason: reason || "Does not meet requirements" },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reject seller" }, { status: 500 });
  }
}
