import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold">
        <Link to="/">Bug Tracker</Link>
      </div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/tickets" className="hover:text-yellow-300">Tickets</Link>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-300">Login</Link>
            <Link to="/register" className="hover:text-yellow-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
