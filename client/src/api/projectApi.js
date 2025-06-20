// src/api/projectApi.js

import axios from 'axios';

// ✅ Option A: Full path here (recommended)
const API = axios.create({
  baseURL: 'http://localhost:5000', // or use import.meta.env.VITE_API_URL if using Vite
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ AUTH ROUTES (include /api here)
export const register = (data) => API.post('/api/auth/register', data);
export const login = (data) => API.post('/api/auth/login', data);

// ✅ PROJECT ROUTES
export const createProject = (data) => API.post('/api/projects', data);
export const fetchProjects = () => API.get('/api/projects');
export const updateProject = (id, data) => API.put(`/api/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/api/projects/${id}`);

// ✅ TEAM
export const addTeamMember = (projectId, email) =>
  API.post(`/api/projects/${projectId}/admin-add-user`, { email });

export const removeMember = (projectId, memberId) =>
  API.post(`/api/projects/${projectId}/admin-remove-user`, { memberId });

// ✅ USERS
export const fetchUsers = () => API.get('/api/users');

export default API;
