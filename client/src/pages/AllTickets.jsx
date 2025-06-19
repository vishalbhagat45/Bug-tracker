import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
  });

  useEffect(() => {
    fetchTickets();
    fetchAssignees();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/tickets', {
        params: {
          status: filters.status,
          priority: filters.priority,
          assignedTo: filters.assignedTo,
          q: filters.search,
        },
      });
      setTickets(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async () => {
    try {
      const res = await axios.get('/users');
      setAssignees(res.data);
    } catch (err) {
      console.error('Failed to fetch assignees');
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => fetchTickets();

  const handleReset = () => {
    const resetFilters = { search: '', status: '', priority: '', assignedTo: '' };
    setFilters(resetFilters);
    fetchTickets();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">🎟️ All Tickets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search title/desc"
          className="p-2 border rounded w-full"
        />

        <select name="status" value={filters.status} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select name="priority" value={filters.priority} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select name="assignedTo" value={filters.assignedTo} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">All Assignees</option>
          {assignees.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button onClick={handleApply} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Apply
          </button>
          <button onClick={handleReset} className="bg-gray-300 px-4 py-2 rounded w-full">
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading tickets...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : tickets.length > 0 ? (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="border p-4 rounded shadow hover:shadow-md transition">
              <Link
                to={`/ticket/${ticket._id}`}
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {ticket.title}
              </Link>
              <p className="text-gray-700 mt-1">{ticket.description}</p>

              <div className="flex flex-wrap gap-3 text-sm mt-3">
                <span className={`px-2 py-1 rounded text-white ${
                  ticket.status === 'done' ? 'bg-green-600' :
                  ticket.status === 'inprogress' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}>
                  {ticket.status}
                </span>

                <span className={`px-2 py-1 rounded text-white ${
                  ticket.priority === 'high' ? 'bg-red-500' :
                  ticket.priority === 'medium' ? 'bg-yellow-500 text-black' :
                  'bg-green-500'
                }`}>
                  {ticket.priority}
                </span>

                <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                  Assigned: {ticket.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tickets found matching the filters.</p>
      )}
    </div>
  );
};

export default AllTickets;
