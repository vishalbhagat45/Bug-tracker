import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import Navbar from './components/Navbar';
import TicketDetail from './pages/TicketDetail';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
      </Routes>
    </>
  );
}

export default App;
