import express from "express";
import User from "../models/User.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }}
)

export default router;