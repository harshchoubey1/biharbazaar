import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import SellerProfile from "@/models/SellerProfile";
import { getAuthUser } from "@/lib/apiAuth";

// GET /api/user — returns current user + seller profile
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(authUser.id).lean().catch(() => null);

    let sellerProfile = null;
    if (authUser.role === "seller" || authUser.role === "admin") {
      sellerProfile = await SellerProfile.findOne({ userId: authUser.id }).lean().catch(() => null);
    }

    return NextResponse.json({
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      ...(user || {}),
      sellerProfile,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PATCH /api/user — update profile
export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const data = await req.json();
    const { name, phone, image } = data;

    const updated = await User.findByIdAndUpdate(
      authUser.id,
      { ...(name && { name }), ...(phone && { phone }), ...(image && { image }) },
      { new: true }
    ).lean();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
