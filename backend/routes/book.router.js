import express from 'express';
import { createBook, getUsersBooks } from '../controllers/books.controller.js';

const router = express.Router();

router.get("/", getUsersBooks);

router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;