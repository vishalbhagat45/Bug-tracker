import axios from "axios";

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

// --- Project API calls ---
export const createProject = (data) => API.post("/projects", data);
export const fetchProjects = () => API.get("/projects");
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// --- Team member management ---
export const addTeamMember = (projectId, email) =>
  API.post(`/projects/${projectId}/admin-add-user`, { email });

export const removeMember = (projectId, memberId) =>
  API.post(`/projects/${projectId}/admin-remove-user`, { memberId });

// --- Users ---
export const fetchUsers = () => API.get("/users");

// --- Auth ---
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

export default API;