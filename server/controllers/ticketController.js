export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isCreator = ticket.createdBy.toString() === req.user._id.toString();
    const isManager = req.user.role === 'manager';
    const isAdmin = req.user.role === 'admin';
    const isAssignedDev = ticket.assignedTo?.toString() === req.user._id.toString();

    // Allow only creator, manager, admin, or assigned developer
    if (!(isCreator || isManager || isAdmin || isAssignedDev)) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating ticket', error: err });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isCreator = ticket.createdBy.toString() === req.user._id.toString();
    const isManager = req.user.role === 'manager';
    const isAdmin = req.user.role === 'admin';

    // Only creator, manager, or admin can delete
    if (!(isCreator || isManager || isAdmin)) {
      return res.status(403).json({ message: 'Not authorized to delete this ticket' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ticket', error: err });
  }
};

