import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import Breadcrumbs from '../components/Breadcrumbs';
import KanbanBoard from '../components/KanbanBoard';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    search: '',
  });

  // Filtered tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchStatus = !filters.status || ticket.status === filters.status;
    const matchPriority = !filters.priority || ticket.priority === filters.priority;
    const matchAssignee = !filters.assignee || ticket.assignee === filters.assignee;
    const matchSearch =
      !filters.search ||
      ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchStatus && matchPriority && matchAssignee && matchSearch;
  });

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, [token]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, [token]);

  // Fetch Tickets when project or filters change
  useEffect(() => {
    const fetchTickets = async () => {
      if (!selectedProjectId) return;

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.assignee) queryParams.append('assignee', filters.assignee);
      if (filters.search) queryParams.append('search', filters.search);

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tickets/project/${selectedProjectId}?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };
    fetchTickets();
  }, [selectedProjectId, filters, token]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updated = [...tickets];
    const moved = updated.find(t => t._id === draggableId);
    if (!moved) return;

    moved.status = destination.droppableId;
    setTickets(updated);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tickets/${draggableId}`,
        { status: destination.droppableId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Home' }, { label: 'Dashboard' }]} />

      {/* Project Selector */}
      <div className="flex justify-between items-center mb-4">
        <select
          className="border p-2 rounded"
          value={selectedProjectId}
          onChange={(e) => {
            const id = e.target.value;
            const project = projects.find(p => p._id === id);
            setSelectedProjectId(id);
            setSelectedProject(project || null);
          }}
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name || p.title || p._id}
            </option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-4">
        <select onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <select onChange={e => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select onChange={e => setFilters({ ...filters, assignee: e.target.value })}>
          <option value="">All Assignees</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search tickets..."
          className="border p-2 rounded"
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Project Info */}
      {selectedProject ? (
        <div className="mb-4">
          <p><strong>Project Name:</strong> {selectedProject.name || selectedProject.title}</p>
          <p><strong>Description:</strong> {selectedProject.description}</p>
        </div>
      ) : (
        <p className="text-lg text-gray-600 font-medium">Select a project to view tickets</p>
      )}

      {/* Kanban Board */}
      {selectedProject && (
        <KanbanBoard
          tickets={filteredTickets}
          onDragEnd={handleDragEnd}
          token={token}
          fetchTickets={() => {
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.priority) queryParams.append('priority', filters.priority);
            if (filters.assignee) queryParams.append('assignee', filters.assignee);
            if (filters.search) queryParams.append('search', filters.search);

            axios.get(`${process.env.REACT_APP_API_URL}/api/tickets/project/${selectedProjectId}?${queryParams.toString()}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(res => setTickets(res.data))
              .catch(err => console.error('Error refreshing tickets:', err));
          }}
          user={JSON.parse(localStorage.getItem("user"))}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
