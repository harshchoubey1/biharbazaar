import mongoose, { Document, Schema } from "mongoose";

export interface IAddress {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  password?: string;
  role: "customer" | "seller" | "admin";
  image?: string;
  phone?: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  name: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
    image: { type: String },
    phone: { type: String },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
