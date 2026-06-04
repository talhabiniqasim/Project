import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorizeRoles('admin'), getUsers);

router.route('/:id')
  .delete(protect, authorizeRoles('admin'), deleteUser);

export default router;
