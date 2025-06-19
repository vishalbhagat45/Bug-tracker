import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketForm = ({
  projectId,
  token,
  onTicketCreated,
  onTicketUpdated,
  initialData = {},
  mode = 'create',
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Open',
    assignee: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Prefill form if editing
    if (mode === 'edit' && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'Low',
        status: initialData.status || 'Open',
        assignee: initialData.assignee?._id || '',
      });
    }
  }, [initialData, mode]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUsers(res.data));
  }, [token]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (mode === 'edit') {
        await axios.put(`${process.env.REACT_APP_API_URL}/tickets/${initialData._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (onTicketUpdated) onTicketUpdated();
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/tickets`, { ...formData, projectId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (onTicketCreated) onTicketCreated();
        setFormData({
          title: '',
          description: '',
          priority: 'Low',
          status: 'Open',
          assignee: '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-xl mx-auto mt-4"
    >
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">
        {mode === 'edit' ? 'Edit Ticket' : 'Create Ticket'}
      </h2>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex gap-4">
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
      </div>

      <select
        name="assignee"
        value={formData.assignee}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Assign to...</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition"
      >
        {mode === 'edit' ? 'Update Ticket' : 'Create Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;