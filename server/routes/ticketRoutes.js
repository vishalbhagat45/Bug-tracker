import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import Ticket from '../models/Ticket.js';

import {
  createTicket,
  getTicketsByProject,
  getAllTickets,
  updateTicket,
  deleteTicket,
  addComment,
  getTicketHistory
} from '../controllers/ticketController.js';

const router = express.Router();

/* ----------------------- Ticket CRUD Routes ----------------------- */

// 🔐 Get all tickets (with optional filters)
router.get('/', protect, getAllTickets);

// 🔐 Create new ticket - Only Admin/Manager
router.post('/', protect, authorizeRoles('admin', 'manager'), createTicket);

// 🔐 Get tickets by project
router.get('/project/:projectId', protect, getTicketsByProject);

// 🔐 Update a ticket - Creator, Assigned, Admin, Manager
router.put('/:id', protect, authorizeRoles('admin', 'manager', 'developer'), updateTicket);

// 🔐 Delete a ticket - Creator, Admin, Manager
router.delete('/:id', protect, authorizeRoles('admin', 'manager'), deleteTicket);


/* ----------------------- Comment & Upload Routes ----------------------- */

// 🔐 Add comment to a ticket
router.post('/:id/comments', protect, addComment);

// 🔐 Upload a screenshot for a ticket
router.post(
  '/:id/upload',
  protect,
  authorizeRoles('admin', 'manager', 'developer'),
  upload.single('screenshot'),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

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


/* ----------------------- Extra (Optional) ----------------------- */

// 🔐 Get all tickets (duplicate route, for clarity if needed)
router.get('/all', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('assignedTo', 'name email');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all tickets', error: err });
  }
});

// 🔐 Ticket History / Activity Logs
router.get('/:id/history', protect, getTicketHistory);

export default router;
