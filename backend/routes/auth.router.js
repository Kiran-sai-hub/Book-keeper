import express from 'express'
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/jwt.middleware.js';

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

// Protected route
router.get("/me", protectRoute, getMe);

export default router;