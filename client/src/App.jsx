// App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ProjectDetail from './pages/ProjectDetailPage';
import TicketDetail from './pages/TicketDetail';
import AllTickets from './pages/AllTickets';
import KanbanBoard from './components/KanbanBoard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectDetailPage from './pages/ProjectDetailPage';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/tickets" element={<AllTickets />} />
          <Route path="/project/:id/kanban" element={<KanbanBoard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;
