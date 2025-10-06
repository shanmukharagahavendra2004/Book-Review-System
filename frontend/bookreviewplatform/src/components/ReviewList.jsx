import React, { useState } from "react";
import api from "./axios";
import ReviewForm from "./ReviewForm";

export default function ReviewList({ reviews = [], bookId, currentUserId, onRefresh }) {
  const [editingReview, setEditingReview] = useState(null); // Review being edited

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

      {reviews.map((r) => (
        <div key={r._id} className="border p-3 rounded-xl shadow-sm bg-white">
          <div className="flex justify-between items-center mb-1">
            <div>
              <span className="font-semibold">{r.userId?.name || "Unknown"}</span>{" "}
              <span className="ml-2 text-yellow-500">{'⭐'.repeat(r.rating || 0)}</span>
            </div>

           
            {r.userId?._id === currentUserId && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingReview(r)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-700">{r.reviewText}</p>
        </div>
      ))}

      {/* Render ReviewForm for editing */}
      {editingReview && (
        <ReviewForm
          existingReview={editingReview}
          onSuccess={() => {
            setEditingReview(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
