import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const columnsFromBackend = {
  todo: { name: "To Do", items: [] },
  inprogress: { name: "In Progress", items: [] },
  done: { name: "Done", items: [] },
};

const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState(columnsFromBackend);

  useEffect(() => {
    axios.get(`/projects/${projectId}/tickets`).then(res => {
      const grouped = { todo: [], inprogress: [], done: [] };
      res.data.forEach(ticket => {
        grouped[ticket.status].push(ticket);
      });
      setColumns({
        todo: { ...columns.todo, items: grouped.todo },
        inprogress: { ...columns.inprogress, items: grouped.inprogress },
        done: { ...columns.done, items: grouped.done },
      });
    });
  }, [projectId]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.status = destination.droppableId;
    destItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems },
    });

    await axios.put(`/tickets/${movedItem._id}`, { status: movedItem.status });
  };

  return (
    <div className="flex gap-4 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column], index) => (
          <div key={columnId} className="bg-gray-100 rounded p-3 w-80 min-w-[300px] shadow">
            <h3 className="font-bold mb-2">{column.name}</h3>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] p-2 rounded ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                  }`}
                >
                  {column.items.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-3 rounded shadow mb-2 ${
                            snapshot.isDragging ? 'bg-blue-100' : ''
                          }`}
                        >
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.priority} | {item.assignee?.name || 'Unassigned'}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
