// src/pages/ProjectsPage.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchProjects, createProject } from "../api/projectApi";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch projects on mount
  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        const res = await fetchProjects();
        setProjects(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch projects", err);
        setError("Could not load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) getProjects();
  }, [token]);

  // Handle project creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const res = await createProject(form);
      setProjects((prev) => [...prev, res.data]);
      setForm({ title: "", description: "" });
    } catch (err) {
      console.error("❌ Project creation failed:", err);
      setError("Failed to create project.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-blue-700">Projects</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md space-y-4"
      >
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Project
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-600">Loading projects...</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((proj) => (
            <li
              key={proj._id}
              className="border p-4 rounded shadow-sm flex flex-col md:flex-row md:items-center md:justify-between bg-white hover:shadow-md transition"
            >
              <div>
                <h2 className="text-lg font-semibold">{proj.title}</h2>
                <p className="text-gray-600">{proj.description}</p>
              </div>
              <button
                onClick={() => navigate(`/project/${proj._id}`)}
                className="mt-3 md:mt-0 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                View Tickets
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPage;
