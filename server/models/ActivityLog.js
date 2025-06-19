import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g. 'status changed', 'comment added'
  field: String, // e.g. 'status', 'priority'
  oldValue: String,
  newValue: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('ActivityLog', activityLogSchema);
