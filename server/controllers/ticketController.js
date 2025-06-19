import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';
import ActivityLog from '../models/ActivityLog.js';

// GET /tickets - Fetch all tickets with optional filters
export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, assignedTo, q } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: err });
  }
};

// GET /tickets/project/:projectId - Fetch tickets by project
export const getTicketsByProject = async (req, res) => {
  try {
    const tickets = await Ticket.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project tickets', error: err });
  }
};

// POST /tickets - Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const newTicket = await Ticket.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create ticket', error: err });
  }
};

// PUT /tickets/:id - Update ticket
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isAuthorized =
      req.user.role === 'admin' ||
      req.user.role === 'manager' ||
      ticket.createdBy.toString() === req.user._id.toString() ||
      ticket.assignedTo?.toString() === req.user._id.toString();

    if (!isAuthorized) return res.status(403).json({ message: 'Unauthorized' });

    // Track changes
    const updates = req.body;
    const changes = [];

    for (let key of ['title', 'description', 'status', 'priority', 'assignedTo']) {
      if (updates[key] && updates[key] !== ticket[key]?.toString()) {
        changes.push({
          field: key,
          oldValue: ticket[key],
          newValue: updates[key]
        });
      }
    }

    const updated = await Ticket.findByIdAndUpdate(req.params.id, updates, { new: true });

    // Save activity log
    for (let change of changes) {
      await ActivityLog.create({
        ticket: ticket._id,
        user: req.user._id,
        action: `${change.field} updated`,
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating ticket', error: err });
  }
};

// DELETE /tickets/:id - Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isAuthorized =
      ticket.createdBy.toString() === req.user._id.toString() ||
      req.user.role === 'manager' ||
      req.user.role === 'admin';

    if (!isAuthorized) return res.status(403).json({ message: 'Not authorized to delete this ticket' });

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ticket', error: err });
  }
};

// POST /tickets/:id/comments - Add a comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      ticket: req.params.id,
      author: req.user._id
    });

    const populated = await comment.populate('author', 'name email');

    // Emit real-time comment event via socket.io
    const io = req.app.get('io');
    io.emit('newComment', { ticketId: req.params.id, comment: populated });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err });
  }
};

// GET /tickets/:id/history - Fetch ticket history
export const getTicketHistory = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ ticket: req.params.id })
      .populate('user', 'name')
      .sort('-timestamp');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ticket history', error: err });
  }
};
