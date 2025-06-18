import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById
} from '../controllers/projectController.js';

import { protect, authorizeRoles } from '../middleware/authMiddleware.js'; // ✅ Correct file

const router = express.Router();

// ✅ Apply middleware correctly
router.post('/', protect, authorizeRoles('admin', 'manager'), createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);

export default router;
