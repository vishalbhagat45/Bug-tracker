import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, tickets]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/tickets/all'); // Make sure this route exists on backend
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets', err);
    }
  };

  const applyFilters = () => {
    let result = [...tickets];

    if (filters.search) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }

    setFiltered(result);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Tickets</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search..."
          className="p-2 border"
        />
        <select name="status" value={filters.status} onChange={handleChange} className="p-2 border">
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleChange} className="p-2 border">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={() => setFilters({ search: '', status: '', priority: '' })} className="bg-gray-200 px-4 py-2">
          Reset Filters
        </button>
      </div>

      <ul className="space-y-3">
        {filtered.map(ticket => (
          <li key={ticket._id} className="border p-4 rounded shadow">
            <Link to={`/ticket/${ticket._id}`} className="text-blue-600 text-lg font-semibold underline">
              {ticket.title}
            </Link>
            <p className="text-sm text-gray-600">{ticket.description}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              <span><strong>Status:</strong> {ticket.status}</span>
              <span><strong>Priority:</strong> {ticket.priority}</span>
              <span><strong>Assignee:</strong> {ticket.assignedTo?.name || 'Unassigned'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllTickets;
