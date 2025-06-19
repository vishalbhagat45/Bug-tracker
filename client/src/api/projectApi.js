// src/api/projectApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ for Vite
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH ---
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);


// ========== ✅ PROJECTS ==========
export const createProject = (data) => API.post("/projects", data);
export const fetchProjects = () => API.get("/projects");
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// ========== ✅ TEAM ==========
export const addTeamMember = (projectId, email) =>
  API.post(`/projects/${projectId}/admin-add-user`, { email });

export const removeMember = (projectId, memberId) =>
  API.post(`/projects/${projectId}/admin-remove-user`, { memberId });

// ========== ✅ USERS ==========
export const fetchUsers = () => API.get("/users");

export default API;
