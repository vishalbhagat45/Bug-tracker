import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [assignees, setAssignees] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: ''
  });

  useEffect(() => {
    fetchTickets();
    fetchAssignees(); // Populate dropdown
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/tickets', {
        params: {
          status: filters.status,
          priority: filters.priority,
          assignedTo: filters.assignedTo,
          q: filters.search
        }
      });
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets', err);
    }
  };

  const fetchAssignees = async () => {
    try {
      const res = await axios.get('/users'); // Adjust if needed
      setAssignees(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    fetchTickets();
  };

  const handleReset = () => {
    setFilters({ search: '', status: '', priority: '', assignedTo: '' });
    fetchTickets();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Tickets</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search title/desc"
          className="p-2 border rounded"
        />

        <select name="status" value={filters.status} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select name="priority" value={filters.priority} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select name="assignedTo" value={filters.assignedTo} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Assignees</option>
          {assignees.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button onClick={handleApply} className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
          <button onClick={handleReset} className="bg-gray-300 px-4 py-2 rounded">Reset</button>
        </div>
      </div>

      <ul className="space-y-4">
        {tickets.length > 0 ? tickets.map(ticket => (
          <li key={ticket._id} className="border p-4 rounded shadow-sm">
            <Link to={`/ticket/${ticket._id}`} className="text-lg font-semibold text-blue-600 underline">
              {ticket.title}
            </Link>
            <p className="text-gray-700">{ticket.description}</p>
            <div className="flex gap-6 text-sm mt-2 text-gray-600">
              <span><strong>Status:</strong> {ticket.status}</span>
              <span><strong>Priority:</strong> {ticket.priority}</span>
              <span><strong>Assigned To:</strong> {ticket.assignedTo?.name || 'Unassigned'}</span>
            </div>
          </li>
        )) : (
          <p className="text-gray-600">No tickets found matching the filters.</p>
        )}
      </ul>
    </div>
  );
};

export default AllTickets;
