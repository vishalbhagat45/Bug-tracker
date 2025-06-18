import { useEffect, useState } from 'react';
import axios from '../api/axios';

const TicketForm = ({ projectId, ticket, onSave }) => {
  const [form, setForm] = useState({
    title: ticket?.title || '',
    description: ticket?.description || '',
    status: ticket?.status || 'todo',
    priority: ticket?.priority || 'medium',
    assignedTo: ticket?.assignedTo?._id || '',
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await axios.get(`/projects/${projectId}`);
      setMembers(res.data.project.members);
    };
    fetchMembers();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ticket) {
      await axios.put(`/tickets/${ticket._id}`, form);
    } else {
      await axios.post(`/tickets`, { ...form, projectId });
    }
    onSave(); // callback to refresh parent component
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded">
      <input
        className="w-full p-2 border mb-3"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="w-full p-2 border mb-3"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
      />
      <select
        className="w-full p-2 border mb-3"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        className="w-full p-2 border mb-3"
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        className="w-full p-2 border mb-3"
        value={form.assignedTo}
        onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
      >
        <option value="">Unassigned</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {ticket ? 'Update' : 'Create'} Ticket
      </button>
    </form>
  );
};

export default TicketForm;
