// components/TicketComments.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TicketComments = ({ ticketId }) => {
  const { token } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [ticketId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        { ticketId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, res.data]);
      setText('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 border-t pt-2">
      <h4 className="font-semibold text-sm">Comments:</h4>
      <div className="space-y-1 max-h-32 overflow-y-auto text-sm">
        {comments.map((c) => (
          <div key={c._id} className="bg-gray-100 p-1 rounded">
            <p><strong>{c.userId?.name || 'User'}:</strong> {c.text}</p>
            <p className="text-xs text-gray-500">{new Date(c.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex gap-1">
        <input
          className="flex-1 border rounded p-1 text-sm"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="text-xs bg-blue-500 text-white px-2 py-1 rounded" disabled={loading}>
          {loading ? '...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default TicketComments;