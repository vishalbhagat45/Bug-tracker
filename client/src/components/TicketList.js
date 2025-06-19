import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import TicketForm from './TicketForm';

const TicketList = ({ projectId, token }) => {
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null); // ⬅️ For modal

  const fetchTickets =useCallback( async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/tickets/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  },[projectId,token]);

  useEffect(() => {
   fetchTickets();
  }, [fetchTickets]);

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tickets/${ticketToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets((prev) => prev.filter((t) => t._id !== ticketToDelete._id));
      setTicketToDelete(null); // close modal
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Tickets for This Project</h3>

      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found for this project.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <h4 className="text-xl font-bold text-gray-800">{ticket.title}</h4>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Priority:</strong> {ticket.priority}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Status:</strong> {ticket.status}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Assignee:</strong> {ticket.assignee?.name || 'Unassigned'}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleEdit(ticket)}
                className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => setTicketToDelete(ticket)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Ticket Modal */}
      {editingTicket && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow w-[400px]">
            <h2 className="text-lg font-bold mb-4">Edit Ticket</h2>
            <TicketForm
              token={token}
              projectId={projectId}
              mode="edit"
              initialData={editingTicket}
              onTicketUpdated={() => {
                setEditingTicket(null);
                fetchTickets();
              }}
            />
            <button
              onClick={() => setEditingTicket(null)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {ticketToDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-[400px] text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this ticket?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setTicketToDelete(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;