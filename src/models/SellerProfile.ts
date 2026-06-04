import mongoose, { Document, Schema } from "mongoose";

export interface ISellerProfile extends Document {
  userId: string;
  shopName: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  gstNumber?: string;
  bankAccount?: string;
  businessAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerProfileSchema = new Schema<ISellerProfile>(
  {
    userId: { type: String, required: true, unique: true },
    shopName: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
    gstNumber: { type: String },
    bankAccount: { type: String },
    businessAddress: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SellerProfile ||
  mongoose.model<ISellerProfile>("SellerProfile", SellerProfileSchema);
