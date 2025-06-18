import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';

const ProjectPage = () => {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Project Kanban Board</h2>
      <KanbanBoard projectId={id} />
    </div>
  );
};

export default ProjectPage;
