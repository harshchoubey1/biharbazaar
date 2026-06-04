import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/apiAuth";

// GET /api/orders/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const order = await Order.findById(id).lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Validate access
    const user = await getAuthUser(req);
    if (!user || (user.id !== order.userId && user.role !== "admin" && user.role !== "seller")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PUT /api/orders/[id] — Update order status (seller/admin)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req);
    if (!user || (user.role !== "admin" && user.role !== "seller")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    const { status } = await req.json();

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
