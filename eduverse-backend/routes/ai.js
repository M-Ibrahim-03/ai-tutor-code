import express from 'express';
import multer from 'multer';
import { askAI, generateQuiz, analyzeLessonSummary, transcribeAudio } from '../controllers/aiController.js';

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/ask', askAI);
router.post('/generate-quiz', generateQuiz);
router.post('/analyze-lesson', analyzeLessonSummary);
router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;