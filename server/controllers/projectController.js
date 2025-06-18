import Project from '../models/Project.js';
import User from '../models/User.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, members } = req.body;
    const newProject = new Project({
      name,
      createdBy: req.user._id,
      members: [...new Set([...members, req.user._id])] // Ensure creator is a member
    });
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
};

// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
};

// Add a new member to project
export const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { userId } = req.body;
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error adding member', error: err.message });
  }
};
