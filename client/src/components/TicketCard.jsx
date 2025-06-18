import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';

const TicketCard = ({ ticket, index }) => {
  return (
    <Draggable draggableId={ticket._id} index={index}>
      {(provided) => (
        <Link
          to={`/ticket/${ticket._id}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="block p-3 mb-2 bg-white border rounded shadow-sm hover:bg-gray-100"
        >
          <h4 className="font-semibold text-lg">{ticket.title}</h4>
          <p className="text-sm text-gray-600">{ticket.priority} priority</p>
          <p className="text-xs text-gray-500 mt-1">
            Assigned to: {ticket.assignedTo?.name || 'Unassigned'}
          </p>
        </Link>
      )}
    </Draggable>
  );
};

export default TicketCard;
