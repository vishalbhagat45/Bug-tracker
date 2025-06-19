import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { token } = useContext(AuthContext);

  // If authenticated, allow access. Else, redirect to login.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
