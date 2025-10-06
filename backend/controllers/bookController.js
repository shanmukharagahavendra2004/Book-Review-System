import Book from "../models/bookModel.js";
import Review from "../models/reviewModel.js";


export const addBook = async (req, res) => {
  const { title, author, description, genre, year } = req.body;
  try {
    const book = await Book.create({ title, author, description, genre, year, addedBy: req.user.id });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteBook = async (req, res) => {
  try {
    console.log("User making request:", req.user);
    const book = await Book.findById(req.params.id);
    console.log("Book found:", book);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });
    if (!book.addedBy) return res.status(400).json({ message: "Book has no owner" });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await Review.deleteMany({ bookId: book._id }); // optional
    await book.remove();

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("DeleteBook Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};



export const getBooks = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 5;
  try {
    const count = await Book.countDocuments();
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({ books, page, pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBooksByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const books = await Book.find({ addedBy: userId }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("addedBy", "name");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ bookId: book._id }).populate("userId", "name");
    const averageRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

    res.json({ book, reviews, averageRating: averageRating.toFixed(1) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
