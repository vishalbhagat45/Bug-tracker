import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import TicketDetail from './pages/TicketDetail';
import AllTickets from './pages/AllTickets';
import KanbanBoard from './components/KanbanBoard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute'; // ✅ you already made this earlier

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/tickets" element={<AllTickets />} />
          <Route path="/project/:id/kanban" element={<KanbanBoard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
