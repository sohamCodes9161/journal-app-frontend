import { Navigate, Outlet } from "react-router-dom";

import FullscreenLoader from "@/components/feedback/FullscreenLoader";

import useAuth from "@/features/auth/hooks/useAuth";

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
