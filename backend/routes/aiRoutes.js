import express from 'express';
import { askAI, analyzeLessonContent, generateQuiz } from '../controllers/aiController.js';

const router = express.Router();

router.post('/ask', askAI);
router.post('/analyze-lesson', analyzeLessonContent);
router.post('/generate-quiz', generateQuiz);

export default router; 