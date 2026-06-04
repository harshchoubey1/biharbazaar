import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import SellerProfile from "@/models/SellerProfile";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    console.log("🧹 Connecting to MongoDB and cleaning database...");
    await connectToDatabase();

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await SellerProfile.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Seed User Accounts
    console.log("👤 Seeding User Accounts...");
    const seller = await User.create({
      name: "Bihar Bazaar Seller",
      email: "seller@biharbazaar.com",
      role: "seller",
      password: hashedPassword,
    });

    const admin = await User.create({
      name: "Admin User",
      email: "admin@biharbazaar.com",
      role: "admin",
      password: hashedPassword,
    });

    const seller2 = await User.create({
      name: "Mithila Artisans",
      email: "mithila@biharbazaar.com",
      role: "seller",
      password: hashedPassword,
    });

    // Create profiles for sellers
    await SellerProfile.create({
      userId: seller._id.toString(),
      shopName: "Bihar Bazaar House",
      description: "Traditional items from all over Bihar",
      status: "approved",
    });

    await SellerProfile.create({
      userId: seller2._id.toString(),
      shopName: "Mithila Crafts & Arts",
      description: "National Award-winning Madhubani artists guild",
      status: "approved",
    });

    const sampleCustomers = [
      { name: "Rahul Kumar", email: "rahul@example.com", phone: "9876543210" },
      { name: "Priya Singh", email: "priya@example.com", phone: "9876543211" },
      { name: "Amit Verma", email: "amit@example.com", phone: "9876543212" },
      { name: "Sneha Rani", email: "sneha@example.com", phone: "9876543213" },
      { name: "Vikash Jha", email: "vikash@example.com", phone: "9876543214" },
      { name: "Anita Devi", email: "anita@example.com", phone: "9876543215" },
    ];

    const customerDocs = [];
    for (const c of sampleCustomers) {
      const doc = await User.create({
        name: c.name,
        email: c.email,
        phone: c.phone,
        role: "customer",
        password: hashedPassword,
        addresses: [
          {
            id: "addr-" + Math.random().toString(36).slice(2, 9),
            label: "Home",
            name: c.name,
            line1: "Gandhi Maidan Sector 2",
            city: "Patna",
            state: "Bihar",
            pincode: "800001",
            phone: c.phone,
          },
        ],
      });
      customerDocs.push(doc);
    }

    // Seed Products
    console.log("🛍️ Seeding Products...");
    const productsData = [
      {
        name: "Madhubani Painting - Tree of Life",
        price: 1299,
        originalPrice: 1799,
        description: "A beautiful hand-painted Madhubani artwork depicting the sacred Tree of Life, created by skilled artisans from the Mithila region of Bihar.",
        category: "Mithila Art",
        vendor: "Mithila Artisans",
        rating: 4.8,
        reviews: 1,
        stock: 15,
        image: "https://images.unsplash.com/photo-1579783900862-c7f8fb00d3d4?q=80&w=600",
        images: ["https://images.unsplash.com/photo-1579783900862-c7f8fb00d3d4?q=80&w=600"],
        highlights: ["Handmade paper", "Natural vegetable dyes", "Certified organic origin"],
        details: { Origin: "Madhubani", Material: "Handmade Canvas" },
        status: "active",
        sellerId: seller2._id.toString(),
        mockReviews: [
          {
            id: 1,
            userName: "Rahul Kumar",
            rating: 5,
            title: "Stunning artwork!",
            body: "Absolutely beautiful Madhubani painting! The colors are vibrant and the details are stunning.",
            date: "2026-05-15",
            verified: true,
            helpful: 12,
          },
        ],
      },
      {
        name: "Bhagalpuri Silk Saree",
        price: 3499,
        originalPrice: 4999,
        description: "Genuine Bhagalpuri Tussar silk saree with traditional motifs woven by master weavers of Bhagalpur.",
        category: "Handlooms",
        vendor: "Bhagalpur Weaves",
        rating: 5.0,
        reviews: 1,
        stock: 8,
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600",
        images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600"],
        highlights: ["100% Pure Tussar Silk", "Traditional hand-woven block prints", "Includes blouse piece"],
        details: { Length: "6.2 meters", Color: "Tussar Gold" },
        status: "active",
        sellerId: seller._id.toString(),
        mockReviews: [
          {
            id: 2,
            userName: "Priya Singh",
            rating: 5,
            title: "Best silk saree ever",
            body: "The silk quality is exceptional. Authentic Bhagalpuri craftsmanship.",
            date: "2026-05-16",
            verified: true,
            helpful: 8,
          },
        ],
      },
      {
        name: "Silao Khaja (1 kg)",
        price: 350,
        originalPrice: 450,
        description: "Famous crispy sweet delicacy from Silao, Nalanda. Made with refined flour, sugar, and ghee.",
        category: "Sweets",
        vendor: "Silao Sweets",
        rating: 4.0,
        reviews: 1,
        stock: 50,
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600",
        images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600"],
        highlights: ["GI Tagged sweet", "Multilayered crunchy texture", "Freshly packed and shipped same day"],
        details: { Weight: "1 kg", ShelfLife: "15 Days" },
        status: "active",
        sellerId: seller._id.toString(),
        mockReviews: [
          {
            id: 3,
            userName: "Amit Verma",
            rating: 4,
            title: "Taste of home",
            body: "Crispy and delicious khaja. Reminds me of home. Packaging could be better.",
            date: "2026-05-17",
            verified: true,
            helpful: 15,
          },
        ],
      },
    ];

    const productDocs = [];
    for (const p of productsData) {
      const doc = await Product.create(p);
      productDocs.push(doc);
    }

    // Seed Orders
    console.log("📦 Seeding Orders...");
    const orderData = [
      {
        userId: customerDocs[0]._id.toString(),
        items: [
          {
            productId: productDocs[0]._id.toString(),
            name: productDocs[0].name,
            price: productDocs[0].price,
            qty: 1,
            image: productDocs[0].image,
            vendor: productDocs[0].vendor,
          },
        ],
        total: productDocs[0].price,
        status: "Processing",
        address: customerDocs[0].addresses[0],
      },
      {
        userId: customerDocs[1]._id.toString(),
        items: [
          {
            productId: productDocs[1]._id.toString(),
            name: productDocs[1].name,
            price: productDocs[1].price,
            qty: 1,
            image: productDocs[1].image,
            vendor: productDocs[1].vendor,
          },
        ],
        total: productDocs[1].price,
        status: "Shipped",
        address: customerDocs[1].addresses[0],
      },
    ];

    for (const o of orderData) {
      await Order.create(o);
    }

    return NextResponse.json({
      success: true,
      message: "✅ Seed complete!",
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      orders: await Order.countDocuments(),
    });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
