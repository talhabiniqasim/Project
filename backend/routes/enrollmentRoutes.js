import express from 'express';
import { enrollCourse, getMyCourses } from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/enroll').post(protect, authorizeRoles('student'), enrollCourse);
router.route('/my-courses').get(protect, authorizeRoles('student'), getMyCourses);

export default router;
