import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProjectsPage from './pages/ProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DasboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
       <div className=" flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">

          <Routes>
           
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<DashboardPage />} />


             {/* Project list page */}
             <Route  path="/dashboard/projects"  element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>  }/>
            
            

            {/* Project detail with tickets */}
            <Route path="/projects/:id" element={<ProjectDetailPage />} />

            
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;