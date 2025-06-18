import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../api/axios';
import TicketCard from './TicketCard';
import { useAuth } from '../context/AuthContext';

const statuses = ['To Do', 'In Progress', 'Done'];

const KanbanBoard = ({ projectId }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, [projectId]);

  const fetchTickets = async () => {
    const res = await axios.get(`/tickets/project/${projectId}`);
    setTickets(res.data);
  };

  const canDrag = (ticket) => {
    if (!user || !ticket) return false;
    return (
      user.role === 'manager' ||
      user.role === 'admin' ||
      user._id === ticket.createdBy?._id ||
      user._id === ticket.assignedTo?._id
    );
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const ticket = tickets.find(t => t._id === draggableId);
    if (!canDrag(ticket)) return; // Block unauthorized drag

    const updatedTickets = [...tickets];
    const updatedTicket = updatedTickets.find(t => t._id === draggableId);
    updatedTicket.status = destination.droppableId;

    setTickets(updatedTickets);
    await axios.put(`/tickets/${draggableId}`, { status: destination.droppableId });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
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
                  .map((ticket, index) => {
                    const isDraggable = canDrag(ticket);
                    return isDraggable ? (
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
                    ) : (
                      <div key={ticket._id} className="mb-2 opacity-70 cursor-not-allowed">
                        <TicketCard ticket={ticket} />
                      </div>
                    );
                  })}
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
