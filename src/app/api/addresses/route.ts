import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/apiAuth";

// GET /api/addresses
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(authUser.id).lean();
    return NextResponse.json(user?.addresses || []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// POST /api/addresses
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const data = await req.json();

    const newAddress = {
      id: "addr-" + Date.now().toString(36),
      label: data.label || "Home",
      name: data.name,
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      phone: data.phone,
    };

    const user = await User.findByIdAndUpdate(
      authUser.id,
      { $push: { addresses: newAddress } },
      { new: true }
    ).lean();

    return NextResponse.json(user?.addresses || [], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
  }
}
