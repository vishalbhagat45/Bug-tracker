// src/api/projectApi.js

import axios from "axios";

// ✅ Create axios instance with correct base URL (from .env or fallback)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ✅ Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- ✅ AUTH ---
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);


// --- ✅ PROJECTS ---
export const createProject = (data) => API.post("/projects", data);
export const fetchProjects = () => API.get("/projects");
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// --- ✅ TEAM MEMBERS ---
export const addTeamMember = (projectId, email) =>
  API.post(`/projects/${projectId}/admin-add-user`, { email });

export const removeMember = (projectId, memberId) =>
  API.post(`/projects/${projectId}/admin-remove-user`, { memberId });

// --- ✅ USERS ---
export const fetchUsers = () => API.get("/users");

export default API;
