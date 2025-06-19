import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';
import AddProjectUserForm from '../components/AddprojectUser';
import { AuthContext } from '../context/AuthContext';  
import KanbanBoard from '../components/kanbanboard';

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);   
  const { id: projectId } = useParams();       
  const [refreshKey, setRefreshKey] = useState(0);
  const [ticketToEdit, setTicketToEdit] = useState(null);

  if (!token) {
    return <p>Please log in to view this page.</p>;
  }

  return (
    <div className="w-[90%] mx-auto space-y-6 py-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-gray-700"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-blue-700">Project Tickets</h1>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Project Board</h2>
        <KanbanBoard projectId={projectId} token={token} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white shadow-md p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Add User to Project</h2>
          <AddProjectUserForm
            projectId={projectId}
            token={token}
            onUserAdded={() => {}}
          />
        </div>

        <div className="flex-1 bg-white shadow-md p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Create Ticket</h2>
          <TicketForm
            projectId={projectId}
            token={token}
            initialData={ticketToEdit}
            onTicketUpdated={() => {
              setTicketToEdit(null);
              setRefreshKey((old) => old + 1);
            }}
          />
        </div>

        <div className="flex-1 bg-white shadow-md p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Tickets for This Project</h2>
          <TicketList
            key={refreshKey}
            projectId={projectId}
            token={token}
            onEditTicket={(ticket) => setTicketToEdit(ticket)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;