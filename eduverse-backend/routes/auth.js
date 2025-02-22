import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Add validation middleware
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

export default router;