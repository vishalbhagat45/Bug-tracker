import { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Optional: Keep token in sync if changed from another tab
  useEffect(() => {
    const syncToken = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    };
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, [token]);

  // Login function
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
