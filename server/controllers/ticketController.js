export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Allow only creator or manager to update
    if (ticket.createdBy.toString() !== req.user._id && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized' });
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

    // Allow only creator or manager to delete
    if (ticket.createdBy.toString() !== req.user._id && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ticket', error: err });
  }
};
