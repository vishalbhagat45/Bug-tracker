const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Project = require('../models/Project');

router.post('/', auth, async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

router.get('/', auth, async (req, res) => {
  const projects = await Project.find().populate('members', 'name email');
  res.json(projects);
});

module.exports = router;
