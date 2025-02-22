import express from 'express';
import { 
  getCourses,
  getCourse,
  enrollCourse,
  getProgress
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/:id/enroll', enrollCourse);
router.get('/:id/progress', getProgress);

export default router; 