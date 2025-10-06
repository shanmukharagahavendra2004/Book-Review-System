import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./axios";

export default function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: "",
  });

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/api/books/${id}`)
        .then((res) => {
          const { book } = res.data;
          setForm({
            title: book.title,
            author: book.author,
            description: book.description,
            genre: book.genre,
            year: book.year,
          });
        })
        .catch((err) => {
          console.error("Error fetching book:", err);
        });
    }
  }, [id, isEdit]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/api/books/${id}`, form);
      } else {
        await api.post("/api/books", form);
      }
      navigate("/");
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Error saving book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          {isEdit ? "Edit Book" : "Add Book"}
        </h2>

       
        {["title", "author", "genre", "year"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2 w-full rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
            required={field !== "genre"}
          />
        ))}

     
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full rounded-lg mb-3 h-24 focus:ring-2 focus:ring-blue-500"
        />

      
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
        >
          {isEdit ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
}
