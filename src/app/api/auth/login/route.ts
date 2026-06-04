import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie, clearAuthCookie } from "@/lib/apiAuth";

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Demo credentials check
    const demoAccounts: Record<string, { id: string; role: string; name: string }> = {
      "admin@demo.com": { id: "demo-admin", role: "admin", name: "Admin Demo" },
      "seller@demo.com": { id: "demo-seller", role: "seller", name: "Seller Demo" },
      "customer@demo.com": { id: "demo-customer", role: "customer", name: "Customer Demo" },
    };

    const demo = demoAccounts[email.toLowerCase()];
    if (demo && password === "demo123") {
      const token = signToken({ id: demo.id, email: email.toLowerCase(), name: demo.name, role: demo.role });
      const res = NextResponse.json({ success: true, user: { id: demo.id, email, name: demo.name, role: demo.role } });
      setAuthCookie(res, token);
      return res;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
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
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

// DELETE /api/auth/login  → logout
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  clearAuthCookie(res);
  return res;
}
