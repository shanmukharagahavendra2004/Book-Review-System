import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.params.userId });
    res.json({ books });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};