import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Folder, Settings, LogOut } from 'lucide-react';
import LogoutButton from './Logout';
import { Settings as SettingsIcon } from 'lucide-react'; // or your icon library

const DashboardLayout = ({ children }) => {
  return (
     <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col p-6 border-r border-gray-200">
        <h2 className="text-2xl font-bold text-cyan-600 mb-6">Dashboard</h2>

        <nav className="flex flex-col space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-cyan-600 transition"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>

          <Link
            to="/dashboard/projects"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-cyan-600 transition"
          >
            <Folder className="w-5 h-5" />
            Projects
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-cyan-600 transition"
          >
            <SettingsIcon className="w-5 h-5" />
            Settings
          </Link>

          <div className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition cursor-pointer">
            <LogOut className="w-5 h-5" />
            <LogoutButton />
          </div>
        </nav>
      </aside>

         {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-xl shadow-md">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
