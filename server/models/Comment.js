import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", CommentSchema);
