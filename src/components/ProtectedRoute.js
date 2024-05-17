import { Navigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth(); // Your authentication logic hook
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;