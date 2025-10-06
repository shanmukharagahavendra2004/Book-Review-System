import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "./axios";
import ReviewForm from "./ReviewForm";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [showUserReviews, setShowUserReviews] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const reviewsPerPage = 5;

  const userId = localStorage.getItem("userId");

  const fetchBookDetails = async () => {
    try {
      const res = await api.get(`/api/books/${id}`);
      const bookData = res.data.book || res.data;

      const reviewsRes = await api.get(`/api/reviews/book/${id}`);
      const reviews = reviewsRes.data || [];

      setBook({ ...bookData, reviews });
    } catch (err) {
      console.error("Error fetching book details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
    setShowUserReviews(false);
    setReviewPage(1);
    setEditingReview(null);
  }, [id]);

  const handleDeleteBook = async () => {
  if (!window.confirm("Are you sure you want to delete this book?")) return;
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Book deleted successfully!");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert("Error deleting book");
  }
};


  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      fetchBookDetails();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading book details...</p>;
  if (!book) return <p className="text-center mt-10">Book not found</p>;

  const isOwner = book.addedBy && (book.addedBy._id === userId || book.addedBy === userId);

  const displayedReviews = showUserReviews
    ? book.reviews.filter((review) =>
        typeof review.userId === "object"
          ? review.userId._id === userId
          : review.userId === userId
      )
    : book.reviews;

  const averageRating =
    book.reviews.length > 0
      ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
      : null;

  const indexOfLastReview = reviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = displayedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(displayedReviews.length / reviewsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl ml-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-700">{book.title}</h1>
          <div className="flex gap-2">
            <Link
              to={`/reviewform/${book._id}`}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Add Review
            </Link>
            <button
              onClick={() => {
                setShowUserReviews(!showUserReviews);
                setReviewPage(1);
              }}
              className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
            >
              {showUserReviews ? "All Reviews" : "Your Reviews"}
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/bookform/${book._id}`)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteBook}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-1">Author: {book.author}</p>
        <p className="text-gray-600 mb-1">Genre: {book.genre || "N/A"}</p>
        <p className="text-gray-600 mb-1">Year: {book.year || "N/A"}</p>
        <p className="text-gray-600 mb-1">Description: {book.description || "N/A"}</p>

        {averageRating && (
          <p className="text-gray-700 font-semibold mb-3">
            Average Rating: {averageRating} ⭐
          </p>
        )}

        <div>
          <h4 className="font-semibold mb-2">Reviews:</h4>
          {editingReview && (
            <ReviewForm
              existingReview={editingReview}
              onSuccess={() => {
                fetchBookDetails();
                setEditingReview(null);
              }}
            />
          )}

          {displayedReviews.length === 0 ? (
            <p className="text-gray-500">
              {showUserReviews ? "You have not added any reviews yet." : "No reviews yet."}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {currentReviews.map((review) => (
                <div key={review._id} className="p-2 bg-white rounded-lg shadow-sm">
                  <p className="font-semibold">{review.userId?.name || "User"}</p>
                  <p>Rating: {review.rating} ⭐</p>
                  <p>{review.reviewText}</p>

                  {review.userId?._id === userId && !editingReview && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setEditingReview(review)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-center gap-2 mt-4">
                <button
                  disabled={reviewPage === 1}
                  onClick={() => setReviewPage(reviewPage - 1)}
                  className={`px-3 py-1 rounded-lg ${
                    reviewPage === 1
                      ? "bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-gray-600">
                  Page {reviewPage} of {totalPages}
                </span>
                <button
                  disabled={reviewPage === totalPages}
                  onClick={() => setReviewPage(reviewPage + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    reviewPage === totalPages
                      ? "bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
