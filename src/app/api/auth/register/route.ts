import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import SellerProfile from "@/models/SellerProfile";
import { signToken, setAuthCookie } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, role, shopName, description, businessAddress, taxId } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === "seller" ? "seller" : "customer";

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: userRole,
    });

    if (userRole === "seller") {
      await SellerProfile.create({
        userId: user._id.toString(),
        shopName: shopName || name,
        description: description || "",
        gstNumber: businessAddress || "",
        bankAccount: taxId || "",
        status: "pending",
      });
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.json(
      { success: true, user: { id: user._id, email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
    setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed", details: err.message }, { status: 500 });
  }
}
