import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import socket from '../socket';
import { toast } from 'react-toastify';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'low', status: 'todo', assignedTo: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Fetch Ticket
  const fetchTicket = async () => {
    try {
      const res = await axios.get(`/tickets/${id}`);
      const data = res.data;
      setTicket(data);
      setForm({
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        assignedTo: data.assignedTo?._id || '',
      });
    } catch (err) {
      toast.error('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/tickets/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      toast.error('Failed to load comments');
    }
  };

  // Update Ticket
  const handleUpdate = async () => {
    try {
      await axios.put(`/tickets/${id}`, form);
      toast.success('Ticket updated');
      setEditMode(false);
      fetchTicket();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  // Delete Ticket
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await axios.delete(`/tickets/${id}`);
      toast.success('Ticket deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // Upload Screenshot
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      await axios.post(`/tickets/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Screenshot uploaded');
      fetchTicket();
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  // Add Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`/tickets/${id}/comments`, {
        text: commentText,
        author: user._id,
      });
      setCommentText('');
      fetchComments();
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  // Permissions
  const canEdit = user && (
    user._id === ticket?.createdBy?._id ||
    user.role === 'manager' ||
    user.role === 'admin' ||
    user._id === ticket?.assignedTo?._id
  );
  const canDelete = user && (user.role === 'admin' || user.role === 'manager');
  const canUpload = canEdit;

  // Sockets
  useEffect(() => {
    fetchTicket();
    fetchComments();

    socket.on('newComment', (data) => {
      if (data.ticketId === id) {
        setComments((prev) => [...prev, data.comment]);
      }
    });

    socket.on('ticketUpdated', (updated) => {
      if (updated._id === id) {
        setTicket(updated);
        setForm({
          title: updated.title,
          description: updated.description,
          priority: updated.priority,
          status: updated.status,
          assignedTo: updated.assignedTo?._id || '',
        });
      }
    });

    return () => {
      socket.off('newComment');
      socket.off('ticketUpdated');
    };
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading ticket...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🎟️ Ticket Detail</h2>

      {/* Ticket Edit/View */}
      {editMode ? (
        <div className="space-y-3">
          <input className="w-full p-2 border" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full p-2 border" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <select className="w-full p-2 border" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
          <select className="w-full p-2 border" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option>
          </select>
          <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">{ticket.title}</h3>
          <p>{ticket.description}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Assigned To:</strong> {ticket.assignedTo?.name || 'Unassigned'}</p>

          {canEdit && (
            <div className="space-x-2 mt-4">
              <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
              {canDelete && (
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Screenshot Upload */}
      {canUpload && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Upload Screenshot:</h4>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-2" />
          {ticket.screenshot && (
            <img src={ticket.screenshot} alt="screenshot" className="w-64 border rounded mt-2" />
          )}
        </div>
      )}

      {/* Comments */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">💬 Comments</h3>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map(comment => (
              <li key={comment._id} className="bg-gray-100 p-4 rounded shadow">
                <div className="text-sm text-gray-600 mb-1">
                  {comment.author?.name || 'Unknown'} • {new Date(comment.createdAt).toLocaleString()}
                </div>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        )}

        {user && (
          <div className="mt-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write your comment..."
            />
            <button onClick={handleAddComment} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">
              Add Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
