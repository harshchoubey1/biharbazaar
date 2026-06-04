import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || (user.role !== "seller" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const sellerId = user.id;

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "overview";

    // Get all products owned by this seller
    const products = await Product.find({ sellerId }).lean();
    const productIds = products.map((p: any) => p._id.toString());

    if (tab === "overview") {
      const totalProducts = products.length;
      const activeProducts = products.filter((p: any) => p.status === "active").length;
      const totalInventoryValue = products.reduce((s: number, p: any) => s + p.price * (p.stock || 0), 0);

      // Find all orders that contain any product of this seller
      const orders = await Order.find({ "items.productId": { $in: productIds } }).lean();

      let totalOrders = orders.length;
      let totalRevenue = 0;
      let pendingOrders = 0;

      for (const order of orders) {
        if (order.status !== "Delivered") {
          pendingOrders++;
        }
        // Calculate revenue for only the items belonging to this seller
        for (const item of (order as any).items) {
          if (productIds.includes(item.productId)) {
            totalRevenue += item.price * item.qty;
          }
        }
      }

      return NextResponse.json({
        totalProducts,
        activeProducts,
        totalInventoryValue,
        totalOrders,
        totalRevenue,
        pendingOrders,
      });
    }

    if (tab === "products") {
      return NextResponse.json(products);
    }

    if (tab === "orders") {
      // Find orders and filter items for current seller
      const orders = await Order.find({ "items.productId": { $in: productIds } })
        .sort({ createdAt: -1 })
        .lean();

      const filteredOrders = orders.map((order: any) => {
        const sellerItems = order.items.filter((item: any) => productIds.includes(item.productId));
        return {
          ...order,
          items: sellerItems,
        };
      });

      return NextResponse.json(filteredOrders);
    }

    return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  } catch (error: any) {
    console.error("Seller GET API error:", error);
    return NextResponse.json({ error: "Failed to fetch seller dashboard data" }, { status: 500 });
  }
}
