import express from 'express';
import { createProject, getProjects, getProjectById } from '../controllers/projectController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProjectById);

export default router;
