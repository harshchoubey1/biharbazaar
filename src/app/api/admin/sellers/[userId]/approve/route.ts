import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SellerProfile from "@/models/SellerProfile";
import User from "@/models/User";
import { getAuthUser } from "@/lib/apiAuth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectToDatabase();
    const { userId } = await params;

    await SellerProfile.findOneAndUpdate(
      { userId },
      { status: "approved", rejectionReason: undefined },
      { new: true }
    );

    // Upgrade user role to seller
    await User.findByIdAndUpdate(userId, { role: "seller" });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to approve seller" }, { status: 500 });
  }
}
