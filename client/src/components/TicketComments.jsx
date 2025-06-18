import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TicketComments = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/tickets/${ticketId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await axios.post(`/tickets/${ticketId}/comments`, { message });
      setMessage('');
      fetchComments(); // Refresh comments after submission
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Add a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
        />
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Post Comment
        </button>
      </form>
      <ul>
        {comments.map((c) => (
          <li key={c._id} className="mb-3 border-b pb-2">
            <p className="font-semibold">{c.author?.name || 'Unknown'}</p>
            <p>{c.message}</p>
            <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketComments;
