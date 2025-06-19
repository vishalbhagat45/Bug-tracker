import React, { useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TicketComments from './ticketComment';

const columns = ['Open', 'In Progress', 'Done'];

const KanbanBoard = ({ tickets=[], onDragEnd, token, user, fetchTickets }) => {
 const grouped = columns.reduce((acc, col) => {
  acc[col] = tickets.filter(t => t.status === col);
  return acc;
}, {});


  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (ticketId) => {
    
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmDeleteId(null);
      fetchTickets(); // refresh ticket list
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const ConfirmDialog = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p className="mb-4 text-lg font-medium">Are you sure you want to delete this ticket?</p>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const [editTicket, setEditTicket] = useState(null);


  return (
    <>
    {tickets && tickets.length > 0 && (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map((col) => (
            <Droppable droppableId={col.toString()} key={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded w-1/3"
                >
                  <h2 className="text-xl font-semibold mb-2">{col}</h2>
                  {grouped[col].map((ticket, index) => (
                    <Draggable
                      key={ticket._id}
                      draggableId={ticket._id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 shadow rounded"
                        >
                          <p className="font-medium">{ticket.title}</p>
                          <p className="text-sm text-gray-500">
                            {ticket.description}
                          </p>
                          <TicketComments ticketId={ticket._id} />
                       
                            <button
      className="text-sm text-blue-500 hover:underline mr-2"
      onClick={() => setEditTicket(ticket)}
    >
      Edit
    </button>
                            <button
                              className="text-sm text-red-500 hover:underline mt-1"
                              onClick={() => setConfirmDeleteId(ticket._id)}
                            >
                              Delete
                            </button>
                                                    </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    )}
      {/* Show the confirmation dialog if needed */}
      {confirmDeleteId && (
        <ConfirmDialog
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
      {editTicket && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Edit Ticket</h2>

      <input
        type="text"
        value={editTicket.title}
        onChange={e => setEditTicket({ ...editTicket, title: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Title"
      />

      <textarea
        value={editTicket.description}
        onChange={e => setEditTicket({ ...editTicket, description: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Description"
      />

      <select
        value={editTicket.priority}
        onChange={e => setEditTicket({ ...editTicket, priority: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <select
        value={editTicket.status}
        onChange={e => setEditTicket({ ...editTicket, status: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
      >
        <option>Open</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => setEditTicket(null)}
        >
          Cancel
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={async () => {
            try {
              await axios.put(
                `${process.env.REACT_APP_API_URL}/tickets/${editTicket._id}`,
                {
                  title: editTicket.title,
                  description: editTicket.description,
                  priority: editTicket.priority,
                  status: editTicket.status
                },
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              setEditTicket(null);
              fetchTickets(); // Refresh
            } catch (err) {
              console.error("Update failed", err);
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default KanbanBoard;