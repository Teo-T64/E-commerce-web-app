import express from "express";
import Order from "../models/Order.js";
import { verifyToken } from "../middleware/auth.js";
import axios from "axios";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const orderData = req.body;

    const fraudPayload = {
      TransactionAmount: orderData.TransactionAmount,
      TransactionType: orderData.TransactionType,
      Location: orderData.Location,
      Channel: orderData.Channel,
      CustomerAge: 28,
      CustomerOccupation: "engineer",
      TransactionDuration: 60,
      LoginAttempts: 2,
      AccountBalance: 5500,
      TransactionDate: new Date().toISOString(),
      PreviousTransactionDate: new Date(Date.now() - 24*60*60*1000).toISOString(),
      ip_address: "127.0.0.1"
    };

    let fraudResp;
    try {
      fraudResp = await axios.post("http://127.0.0.1:4000/predict", fraudPayload);
    } catch (err) {
      console.error("Fraud API error:", err.message);
      return res.status(500).json({ error: "Fraud API not reachable" });
    }

    const isFraudulent = fraudResp.data.fraudulent;
    const riskScore = fraudResp.data.riskScore || 0;

    if (isFraudulent) {
      return res.status(403).json({
        error: "Order flagged as fraudulent. Transaction blocked.",
        isFraudulent: true,
        riskScore
      });
    }

    const newOrder = new Order({
      userId,
      items: orderData.items,
      totalAmount: orderData.TransactionAmount,
      paymentMethod: orderData.paymentMethod || "online",
      shippingAddress: orderData.shippingAddress || "Not provided",
      status: "pending",
      isFraudulent: false,
      riskScore
    });

    await newOrder.save();

    res.json({
      message: "Order placed successfully",
      isFraudulent: false,
      riskScore,
      orderId: newOrder._id
    });

  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Server error during order creation" });
  }
});

router.get("/my-orders", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
