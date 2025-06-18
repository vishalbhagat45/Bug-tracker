const express = require('express');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Create Ticket
router.post('/', auth, async (req, res) => {
  const ticket = new Ticket(req.body);
  await ticket.save();
  res.json(ticket);
});

// Get all tickets
router.get('/', auth, async (req, res) => {
  const tickets = await Ticket.find()
    .populate('assignee', 'name')
    .populate('project', 'name');
  res.json(tickets);
});

// Update status
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(ticket);
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  ticket.comments.push({ text, author: req.user.id });
  await ticket.save();
  res.json(ticket);
});

module.exports = router;
