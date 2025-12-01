import express from "express";
import Comment from "../models/Comment.js"; 

const router = express.Router();

router.post("/comments", async (req, res) => {
  try {
    const { productId, userId, content, rating } = req.body;

    if (!productId || !userId || !content || !rating) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const newComment = await Comment.create({
      productId,
      userId,
      content,
      rating,
    });

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/ratings", async (req, res) => {
  try {
    const result = await Comment.aggregate([
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = result.map(r => ({
      productId: r._id,
      avgRating: r.avgRating ? Number(r.avgRating.toFixed(1)) : 0,
      count: r.count
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Rating fetch error:", err);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});



router.get("/comments/:productId", async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId })
      .populate("userId", "email");

    const formatted = comments.map((comment) => {
      const email = comment.userId.email;
      const displayName = email.split("@")[0];

      return {
        _id: comment._id,
        productId: comment.productId,
        content: comment.content,
        rating: comment.rating, 
        createdAt: comment.createdAt,
        user: {
          id: comment.userId._id,
          email,
          displayName,
        },
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
