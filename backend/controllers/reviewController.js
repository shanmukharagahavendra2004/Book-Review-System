import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";

// Add review
export const addReview = async (req, res) => {
  const { bookId, rating, reviewText } = req.body;
  try {
    const review = await Review.create({
      bookId,
      rating,
      reviewText,
      userId: req.user.id,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reviews/book/:id
export const getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.id })
      .populate("userId", "name")  // populate reviewer name
      .sort({ createdAt: -1 });    // latest first
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
