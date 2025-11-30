import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ cart: user.cart });
});

router.post("/", verifyToken, async (req, res) => {
  const { productId, price, quantity = 1,total } = req.body;
  if (!productId) return res.status(400).json({ error: "productId required" });

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ productId, price, quantity,total });
  }

  await user.save();
  res.json({ cart: user.cart });
});

router.put("/", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);

  const item = user.cart.find((i) => i.productId === productId);
  if (!item) return res.status(404).json({ error: "Item not found" });

  item.quantity = quantity;
  if (item.quantity <= 0) {
    user.cart = user.cart.filter((i) => i.productId !== productId);
  }

  await user.save();
  res.json({ cart: user.cart });
});

router.delete("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter((i) => i.productId != productId);
  await user.save();
  res.json({ cart: user.cart });
});

router.delete("/", verifyToken, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ cart: [] });
});

export default router;

