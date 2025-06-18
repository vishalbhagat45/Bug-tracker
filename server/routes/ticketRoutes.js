import express from 'express';
import {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  addComment,
  getAllTickets // ✅ add this
} from '../controllers/ticketController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllTickets); // ✅ all tickets with search/filter/sort
router.post('/', protect, createTicket);
router.get('/project/:projectId', protect, getTicketsByProject);
router.put('/:id', protect, updateTicket);
router.delete('/:id', protect, deleteTicket);
router.post('/:id/comments', protect, addComment);

router.get('/all', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('assignedTo', 'name email');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all tickets', error: err });
  }
});

export default router;
