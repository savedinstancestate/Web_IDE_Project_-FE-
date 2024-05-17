import { Navigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

export default PublicRoute;
