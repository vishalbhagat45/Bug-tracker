import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects');
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle new project creation
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setCreating(true);
      const res = await axios.post('/projects', { name: newProjectName });
      setProjects((prev) => [...prev, res.data]);
      setNewProjectName('');
    } catch (err) {
      alert('Failed to create project.');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📋 Dashboard</h1>

      {/* Create Project Form */}
      <form onSubmit={handleCreateProject} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter project name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create'}
        </button>
      </form>

      {/* Status Message */}
      {loading ? (
        <p className="text-gray-600">Loading projects...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : projects.length === 0 ? (
        <p>No projects yet. Start by creating one above!</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-100 p-4 rounded shadow hover:bg-gray-200 transition"
            >
              <Link
                to={`/project/${project._id}`}
                className="text-blue-700 text-lg font-semibold"
              >
                {project.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
