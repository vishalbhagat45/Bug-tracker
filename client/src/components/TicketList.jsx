import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/tickets', {
        params: {
          search,
          status,
          priority,
          sort,
        },
      });
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, status, priority, sort]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Tickets</h2>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tickets..."
          className="p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="p-2 border rounded" onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select className="p-2 border rounded" onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* 📋 Ticket List */}
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id} className="border p-4 mb-2 rounded">
            <Link to={`/ticket/${ticket._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
              {ticket.title}
            </Link>
            <p>{ticket.description}</p>
            <p className="text-sm text-gray-500">
              Status: {ticket.status} | Priority: {ticket.priority}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketList;
