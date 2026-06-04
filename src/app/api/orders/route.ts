import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import { getAuthUser } from "@/lib/apiAuth";

// GET /api/orders
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const query = user.role === "admin" ? {} : { userId: user.id };
    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const order = await OrderModel.create({
      userId: user.id,
      items: data.items,
      total: data.total,
      address: data.address,
      paymentMethod: data.paymentMethod || "COD",
      status: "Processing",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create order", details: err.message }, { status: 500 });
  }
}
