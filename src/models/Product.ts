import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  vendor: string;
  sellerId?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  status: "active" | "draft";
  image: string;
  images: string[];
  highlights: string[];
  details: Record<string, string>;
  brandDescription?: string;
  videoUrl?: string;
  mockReviews: Array<{
    id: number;
    userName: string;
    rating: number;
    title: string;
    body: string;
    date: string;
    verified: boolean;
    helpful: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema({
  id: Number,
  userName: String,
  rating: Number,
  title: String,
  body: String,
  date: String,
  verified: Boolean,
  helpful: { type: Number, default: 0 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    vendor: { type: String, required: true },
    sellerId: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "draft"], default: "active" },
    image: { type: String, default: "" },
    images: [{ type: String }],
    highlights: [{ type: String }],
    details: { type: Map, of: String, default: {} },
    brandDescription: { type: String },
    videoUrl: { type: String },
    mockReviews: [ReviewSchema],
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ name: "text", description: "text", vendor: "text" });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
