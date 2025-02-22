import express from 'express';
import { askAI, analyzeLessonContent } from '../controllers/aiController.js';

const router = express.Router();

router.post('/ask', askAI);
router.post('/analyze-lesson', analyzeLessonContent);

export default router; 