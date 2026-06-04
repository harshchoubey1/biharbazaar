import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/apiAuth";

// POST /api/auth/google
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { credential, role = "customer" } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Google credential is required" }, { status: 400 });
    }

    // Verify token with Google API to avoid bringing in google-auth-library
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Invalid Google credential" }, { status: 401 });
    }

    const payload = await verifyRes.json();

    // Check audience if client ID is set
    const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (googleClientId && payload.aud !== googleClientId) {
      return NextResponse.json({ error: "Unauthorized Google client audience" }, { status: 401 });
    }

    const email = payload.email?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: "Google account does not provide an email" }, { status: 400 });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: payload.name || "Google User",
        email,
        role: role === "seller" ? "seller" : "customer",
        image: payload.picture || "",
        addresses: [],
      });
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });
    setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    console.error("Google Auth Error:", err);
    return NextResponse.json({ error: "Google sign-in failed", details: err.message }, { status: 500 });
  }
}
