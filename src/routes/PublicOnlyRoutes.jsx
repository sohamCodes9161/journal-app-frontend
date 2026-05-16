import { Navigate } from "react-router-dom";

import FullscreenLoader from "@/components/feedback/FullscreenLoader";

import useAuth from "@/features/auth/hooks/useAuth";

function PublicOnlyRoutes({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

export default PublicOnlyRoutes;
