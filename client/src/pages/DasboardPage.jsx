import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DashboardLayout from './../components/DashboardLayout';
import Breadcrumbs from '../components/Breadcrumbs';
import { AuthContext } from '../context/AuthContext'; 
import KanbanBoard from '../components/kanbanboard';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
  status: '',
  priority: '',
  assignee: '',
  search: '',
});


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


  // Fetch projects on initial load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${ token }`,
          },
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, [token]);

  // Fetch tickets when a project is selected
  useEffect(() => {
    const fetchTickets = async () => {
      if (!projectId) return;
         const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.assignee) queryParams.append('assignee', filters.assignee);
    if (filters.search) queryParams.append('search', filters.search);
      try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/tickets/project/${projectId}?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
         
        });
        setTickets(res.data);
        
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };

    fetchTickets();
  }, [projectId, filters,token]);

  const handleDragEnd = async (result) => {
  const { destination, source, draggableId } = result;

  if (!destination || destination.droppableId === source.droppableId) return;

  const updatedTickets = [...tickets];
  const draggedTicket = updatedTickets.find(t => t._id === draggableId);

  if (!draggedTicket) return;

  // Update locally
  draggedTicket.status = destination.droppableId;
  setTickets(updatedTickets);

  // ✅ Update in database
  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/tickets/${draggableId}`,
      { status: destination.droppableId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Failed to update ticket:", err);
  }
};

//fetch users for filtering
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  fetchUsers();
}, [token]);

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Home' }, { label: 'Dashboard' }]} />

      <div className="flex justify-between items-center mb-4">
        <select
          className="border p-2 rounded"
          value={projectId}
          onChange={(e) => {
            const selected = projects.find(p => p._id === e.target.value);
  setProjectId(e.target.value);
  setSelectedProject(selected);
          }}
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title || p.name || p._id}
            </option>
          ))}
        </select>
      </div>
       <div className="flex gap-2 mb-4">
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
    placeholder="Search..."
    onChange={e => setFilters({ ...filters, search: e.target.value })}
  />
</div>

      {selectedProject ? (
        <div>
          <p className="text-lg">
            Showing data for project <strong>{selectedProject.title}</strong>
          </p>
          <p><strong>Project Name:</strong> {selectedProject.name || selectedProject.title}</p>
          <p><strong>Description:</strong> {selectedProject.description}</p>
        </div>
      ) : (
        <p className="text-lg font-medium text-gray-600">Select a project</p>
      )}

     <KanbanBoard
  tickets={filteredTickets}
  onDragEnd={handleDragEnd}
  token={token}
  fetchTickets={() => {
    // re-fetch tickets (copied from useEffect above)
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.assignee) queryParams.append('assignee', filters.assignee);
    if (filters.search) queryParams.append('search', filters.search);

    axios.get(`${process.env.REACT_APP_API_URL}/tickets/project/${projectId}?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTickets(res.data))
      .catch(err => console.error('Error fetching tickets:', err));
  }}
  user={JSON.parse(localStorage.getItem("user"))} // or replace with your context value if available
/>

    </DashboardLayout>
  );
};

export default DashboardPage;