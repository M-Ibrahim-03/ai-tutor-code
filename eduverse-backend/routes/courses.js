import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getCourses,
  getCourse,
  enrollCourse,
  getProgress
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/:id/enroll', protect, enrollCourse);
router.get('/:id/progress', protect, getProgress);

export default router; 