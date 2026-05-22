const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

// Create Task (Admin Only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied. Admins only.' });
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Tasks (Admin gets all, Member gets only assigned tasks)
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('assignedTo', 'name').populate('project', 'title');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name').populate('project', 'title');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Task Status / Details (Both Admin and Member can update status)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update the status of their own assigned tasks
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedData = req.user.role === 'Admin' ? req.body : { status: req.body.status };
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updatedData, { new: true })
      .populate('assignedTo', 'name')
      .populate('project', 'title');

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Task (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied. Admins only.' });
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;