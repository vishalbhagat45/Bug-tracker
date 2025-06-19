import LogoutButton from './Logout';
const DashboardLayout = ({ children }) => {

  
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r hidden md:block">
        <h2 className="text-xl font-bold mb-6">My Dashboard</h2>
        <nav className="space-y-2">
          <a href="/" className="block p-2 rounded hover:bg-gray-200">Home</a>
          <a href="/dashboard/projects" className="block p-2 rounded hover:bg-gray-200">Projects</a>
          <a href="/" className="block p-2 rounded hover:bg-gray-200">Settings</a>
          <LogoutButton />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
       {children}{ }
      </main>
     

    </div>
  );
};

export default DashboardLayout;