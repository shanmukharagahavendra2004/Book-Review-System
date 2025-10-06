import express from "express";
import { addReview, updateReview, deleteReview, getReviewsByBook } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
router.get("/book/:id", getReviewsByBook);

export default router;
