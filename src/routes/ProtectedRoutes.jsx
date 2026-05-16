import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export default ProtectedRoutes;