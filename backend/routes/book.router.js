import express from 'express';
import { createBook, getUsersBooks, updateBook, deleteBook } from '../controllers/books.controller.js';
import { protectRoute } from '../middlewares/jwt.middleware.js';

const router = express.Router();

router.get("/", protectRoute, getUsersBooks);

router.post("/", protectRoute, createBook);
router.put("/:id", protectRoute, updateBook);
router.delete("/:id", protectRoute, deleteBook);

export default router;