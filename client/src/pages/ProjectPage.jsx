import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import KanbanBoard from '../components/KanbanBoard';

const ProjectPage = () => {
  const { id } = useParams(); // project ID from URL
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      setProject(res.data.project);
      setTickets(res.data.tickets);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch project:', err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <KanbanBoard projectId={project._id} tickets={tickets} />
    </div>
  );
};

export default ProjectPage;
