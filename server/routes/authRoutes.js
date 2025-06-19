import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Correct named import

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route - Requires login (JWT token)
router.get('/me', protect, getMe); // ✅ Use 'protect' middleware to secure this route

export default router;
