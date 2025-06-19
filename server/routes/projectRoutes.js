import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById
} from '../controllers/projectController.js';

import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/projects – create new project (admin/manager only)
router.post('/', protect, authorizeRoles('admin', 'manager'), createProject);

// GET /api/projects – get all projects (authenticated users)
router.get('/', protect, getProjects);

// GET /api/projects/:id – get a project by ID (authenticated users)
router.get('/:id', protect, getProjectById);

export default router;
