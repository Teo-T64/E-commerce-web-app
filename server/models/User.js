import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  cart: { type: [CartItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
