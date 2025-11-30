import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import userRoutes from "./routes/userInfoRoute.js";
import commentRoutes from "./routes/commentRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/order",orderRoutes);
app.use("/profile",userRoutes);
app.use("/productInfo",commentRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running at http://127.0.0.1:${PORT}`));
