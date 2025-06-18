import { useState, useEffect } from 'react';
import axios from '../../api/axios';

const TicketForm = ({ projectId, ticket = null, onClose, onSuccess }) => {
  const [title, setTitle] = useState(ticket?.title || '');
  const [description, setDescription] = useState(ticket?.description || '');
  const [priority, setPriority] = useState(ticket?.priority || 'Low');
  const [assignee, setAssignee] = useState(ticket?.assignee?._id || '');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/projects/${projectId}/members`).then(res => {
      setUsers(res.data);
    });
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, priority, assignee };

    if (ticket) {
      await axios.put(`/tickets/${ticket._id}`, payload);
    } else {
      await axios.post(`/projects/${projectId}/tickets`, payload);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">{ticket ? 'Edit Ticket' : 'Create Ticket'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="w-full border p-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          className="w-full border p-2 rounded"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-end">
          <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            {ticket ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
