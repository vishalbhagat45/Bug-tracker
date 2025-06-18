import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', priority: '', status: '', assignedTo: ''
  });

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchTicket();
    fetchComments();
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

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/tickets/${id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleUpdate = async () => {
    await axios.put(`/tickets/${id}`, form);
    setEditMode(false);
    fetchTicket();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      await axios.delete(`/tickets/${id}`);
      navigate(-1);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      await axios.post(`/tickets/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchTicket();
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  // 🔐 Role Permissions
  const canEdit = user && (user._id === ticket?.createdBy?._id || user.role === 'manager' || user.role === 'admin' || ticket?.assignedTo?._id === user._id);
  const canDelete = user && (user.role === 'admin' || user.role === 'manager');
  const canUpload = canEdit; // same users can upload screenshot

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

            {canEdit && (
              <div className="space-x-3 mt-4">
                <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2">Edit</button>
                {canDelete && (
                  <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2">Delete</button>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* Screenshot Upload */}
      {canUpload && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Upload Screenshot:</h4>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-2" />
          {ticket?.screenshot && (
            <img src={ticket.screenshot} alt="screenshot" className="w-64 border rounded" />
          )}
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment._id} className="bg-gray-100 p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">
                  {comment.author?.name || 'Unknown User'} •{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                <p className="text-gray-800">{comment.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Comment */}
      {user && (
        <div className="mt-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write your comment..."
          />
          <button
            onClick={async () => {
              if (!commentText.trim()) return;
              await axios.post(`/tickets/${id}/comments`, {
                text: commentText,
                author: user._id,
              });
              setCommentText('');
              fetchComments();
            }}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
