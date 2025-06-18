import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  // Fetch user's projects
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await axios.get('/projects');
      setProjects(res.data);
    };
    fetchProjects();
  }, []);

  // Create new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const res = await axios.post('/projects', { name: newProjectName });
    setProjects([...projects, res.data]);
    setNewProjectName('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Create Project */}
      <form onSubmit={handleCreateProject} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="border p-2 flex-1"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>

      {/* Project List */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p>No projects yet. Create one!</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-100 p-4 rounded shadow hover:bg-gray-200 transition"
            >
              <Link to={`/project/${project._id}`} className="text-blue-700 text-lg font-semibold">
                {project.name}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
