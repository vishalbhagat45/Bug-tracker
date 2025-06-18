// File: src/components/KanbanBoard.jsx

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../api/axios';
import TicketCard from './TicketCard';

const statuses = ['To Do', 'In Progress', 'Done'];

const KanbanBoard = ({ projectId }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, [projectId]);

  const fetchTickets = async () => {
    const res = await axios.get(`/tickets/project/${projectId}`);
    setTickets(res.data);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTickets = [...tickets];
    const ticket = updatedTickets.find(t => t._id === draggableId);
    ticket.status = destination.droppableId;

    setTickets(updatedTickets);
    await axios.put(`/tickets/${draggableId}`, { status: destination.droppableId });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-4">
        {statuses.map(status => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded shadow min-h-[400px]"
              >
                <h3 className="text-lg font-bold mb-2">{status}</h3>
                {tickets
                  .filter(ticket => ticket.status === status)
                  .map((ticket, index) => (
                    <Draggable draggableId={ticket._id} index={index} key={ticket._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2"
                        >
                          <TicketCard ticket={ticket} />
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
  );
};

export default KanbanBoard;
