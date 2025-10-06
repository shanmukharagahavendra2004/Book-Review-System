import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import api from "./axios";

export default function ReviewForm({ existingReview, onSuccess }) {
  const { bookId } = useParams();
  const navigate = useNavigate(); 

  const [rating, setRating] = useState(existingReview?.rating || 1);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || "");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(existingReview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (isEdit) {

        await api.put(`/api/reviews/${existingReview._id}`, { rating, reviewText }, config);
      } else {
      
        await api.post("/api/reviews", { bookId, rating, reviewText }, config);
      }

      onSuccess?.();

      
      navigate(`/bookdetails/${bookId}`);

     
      setRating(1);
      setReviewText("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded-xl shadow-md mb-6"
    >
      <h3 className="font-semibold mb-2">
        {isEdit ? "Edit Your Review" : "Add a Review"}
      </h3>

      <div className="flex items-center mb-2">
        <label className="mr-2">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded-lg p-1"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-500"
        rows={3}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isEdit ? "Update Review" : loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
