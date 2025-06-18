import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', priority: '', status: '', assignedTo: ''
  });

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    const res = await axios.get(`/tickets/${id}`);
    setTicket(res.data);
    setForm({
      title: res.data.title,
      description: res.data.description,
      priority: res.data.priority,
      status: res.data.status,
      assignedTo: res.data.assignedTo?._id || ''
    });
  };

  const handleUpdate = async () => {
    await axios.put(`/tickets/${id}`, form);
    setEditMode(false);
    fetchTicket();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      await axios.delete(`/tickets/${id}`);
      navigate(-1); // back to previous page
    }
  };

  const isEditable = user._id === ticket?.createdBy?._id || user.role === 'manager';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Ticket Detail</h2>

      {editMode ? (
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-2 border" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border" />
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full p-2 border">
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full p-2 border">
            <option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option>
          </select>
          <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2">Save</button>
        </div>
      ) : (
        ticket && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold">{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Assigned To:</strong> {ticket.assignedTo?.name || 'None'}</p>

            {isEditable && (
              <div className="space-x-3 mt-4">
                <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2">Edit</button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2">Delete</button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default TicketDetail;
