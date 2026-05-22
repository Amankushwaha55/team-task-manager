const router = require('express').Router();
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');

// Create Project (Admin Only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied. Admins only.' });
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Projects (Admin gets all, Member gets where they are added)
router.get('/', auth, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;