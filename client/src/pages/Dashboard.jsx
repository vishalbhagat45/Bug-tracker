import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('/projects').then(res => setProjects(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Projects</h2>
      <ul>
        {projects.map(p => (
          <li key={p._id} className="mb-2">
            <Link to={`/project/${p._id}`} className="text-blue-600 underline">{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
