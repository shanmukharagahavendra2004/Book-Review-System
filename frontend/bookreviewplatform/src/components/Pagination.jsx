import React from "react";

export default function Pagination({ page, pages, setPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`px-3 py-1 rounded-lg ${
          page === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Prev
      </button>
      <span className="px-3 py-1 text-gray-600">
        Page {page} of {pages}
      </span>
      <button
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className={`px-3 py-1 rounded-lg ${
          page === pages
            ? "bg-gray-300"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Next
      </button>
    </div>
  );
}
