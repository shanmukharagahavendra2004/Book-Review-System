import express from "express";
import {
  addBook,
  updateBook,
  deleteBook,
  getBooks,
  getBookDetails,
  getBooksByUser,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBooks);              // Get all books (with pagination)
router.get("/:id", getBookDetails);     // ✅ Get single book with reviews
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);
router.get("/user/:userId", protect, getBooksByUser); // 👈 Add this line


export default router;
