import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./axios";
import Pagination from "./Pagination";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showUserBooks, setShowUserBooks] = useState(false);
  const navigate = useNavigate();
  const booksPerPage = 5;

  const fetchBooks = async () => {
    try {
      let res;
      if (showUserBooks) {
        
        const userId = localStorage.getItem("userId"); 
        res = await api.get(`/api/books/user/${userId}`);
      } else {
        res = await api.get("/api/books");
      }
      const fetchedBooks = res.data.books || res.data;
      setBooks(fetchedBooks);
      setPages(Math.ceil(fetchedBooks.length / booksPerPage));
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [showUserBooks]);

  const handleAddBook = () => {
    navigate("/bookform");
  };

  const handleShowAllBooks = () => {
    setShowUserBooks(false);
    setPage(1);
  };

  const handleShowUserBooks = () => {
    setShowUserBooks(true);
    setPage(1);
  };

  const startIndex = (page - 1) * booksPerPage;
  const paginatedBooks = books.slice(startIndex, startIndex + booksPerPage);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl ml-5 flex flex-col gap-4">
       
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 ml-3">
            📚 Book List
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleAddBook}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Book
            </button>
            <button
              onClick={handleShowUserBooks}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Your Books
            </button>
            {showUserBooks && (
              <button
                onClick={handleShowAllBooks}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                All Books
              </button>
            )}
          </div>
        </div>

        {paginatedBooks.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-3">
              {showUserBooks
                ? "You have not added any books yet."
                : "No books available."}
            </p>
            {showUserBooks && (
              <button
                onClick={handleAddBook}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Book
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedBooks.map((book) => (
              <div
                key={book._id}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{book.title}</p>
                  <p className="text-gray-600">by {book.author}</p>
                </div>
                <Link
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  to={`/bookdetails/${book._id}`}
                >
                  Show Details
                </Link>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} pages={pages} setPage={setPage} />
      </div>
    </div>
  );
}
