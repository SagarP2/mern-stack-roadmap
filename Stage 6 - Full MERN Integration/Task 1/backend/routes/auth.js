import express from 'express';
import { register, login, createAdmin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// User routes (works for both regular users and admins)
router.post('/register', register);
router.post('/login', login);

// Admin creation route
router.post('/admin/create', createAdmin);

// Protected routes
router.get('/me', protect, getMe);

export default router;
