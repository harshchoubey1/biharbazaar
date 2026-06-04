import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "bihar-bazaar-secret-2024";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token =
    req.cookies.get("bb_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Validate user still exists in DB
  try {
    await connectToDatabase();
    const user = await User.findById(decoded.id);
    if (!user) return null;
    return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
  } catch {
    return decoded; // fallback to token data
  }
}

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set("bb_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set("bb_token", "", { maxAge: 0, path: "/" });
}
