import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  vendor: string;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  image: { type: String },
  vendor: { type: String },
});

const AddressSchema = new Schema({
  name: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    address: AddressSchema,
    paymentMethod: { type: String, default: "COD" },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
