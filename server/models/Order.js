import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "cancelled"],
    default: "pending",
  },
  riskScore: { type: Number, default: 0 },
  isFraudulent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
