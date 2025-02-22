import express from 'express';
import { protect } from '../middleware/auth.js';
import { askAI } from '../controllers/aiController.js';

const router = express.Router();

// Add explicit OPTIONS handling
router.options('/ask', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

router.post('/ask', protect, askAI);

export default router;