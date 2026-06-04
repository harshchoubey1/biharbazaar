import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SellerProfile from "@/models/SellerProfile";
import User from "@/models/User";
import { getAuthUser } from "@/lib/apiAuth";

// GET /api/admin/sellers
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const sellers = await SellerProfile.find({}).sort({ createdAt: -1 }).lean();

    // Enrich with user email
    const enriched = await Promise.all(
      sellers.map(async (s) => {
        let email = "";
        try {
          const u = await User.findById(s.userId).lean();
          email = (u as any)?.email || "";
        } catch {}
        return { ...s, user: { email } };
      })
    );

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 });
  }
}
