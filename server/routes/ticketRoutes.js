import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import Ticket from '../models/Ticket.js'; // Needed for inline upload route

import {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  addComment,
  getAllTickets,
} from '../controllers/ticketController.js';

import { protect, authorizeRoles } from '../middleware/authMiddleware.js'; // ✅ updated

const router = express.Router();

// 🔐 All authenticated users can view all tickets
router.get('/', protect, getAllTickets);

// 🔐 Only admin and manager can create new tickets
router.post('/', protect, authorizeRoles('admin', 'manager'), createTicket);

// 🔐 All authenticated users can view tickets by project
router.get('/project/:projectId', protect, getTicketsByProject);

// 🔐 Only admin, manager, or assigned developer can update
router.put('/:id', protect, authorizeRoles('admin', 'manager', 'developer'), updateTicket);

// 🔐 Only admin and manager can delete tickets
router.delete('/:id', protect, authorizeRoles('admin', 'manager'), deleteTicket);

// 🔐 All authenticated users can comment
router.post('/:id/comments', protect, addComment);

// 🔐 All tickets route (same as `/tickets` but named /all for clarity)
router.get('/all', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('assignedTo', 'name email');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all tickets', error: err });
  }
});
// 🔐 Upload screenshot for a ticket
router.post(
  '/:id/upload',
  protect,
  authorizeRoles('admin', 'manager', 'developer'), // ✅ roles that can upload
  upload.single('screenshot'),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

      // Optional: check if user is creator or assigned
      const isCreator = ticket.createdBy.toString() === req.user._id.toString();
      const isAssignedDev = ticket.assignedTo?.toString() === req.user._id.toString();
      const isPrivileged = ['admin', 'manager'].includes(req.user.role);

      if (!(isCreator || isAssignedDev || isPrivileged)) {
        return res.status(403).json({ message: 'Not authorized to upload screenshot' });
      }

      ticket.screenshot = `/uploads/${req.file.filename}`;
      await ticket.save();

      res.json({ message: 'Screenshot uploaded', screenshot: ticket.screenshot });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Upload failed', error: err });
    }
  }
);


export default router;
