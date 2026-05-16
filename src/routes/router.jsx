import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import PublicOnlyRoutes from "./PublicOnlyRoutes";
import ProtectedRoutes from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/auth/login",
    element: (
      <PublicOnlyRoutes>
        <LoginPage />
      </PublicOnlyRoutes>
    ),
  },

  {
    path: "/auth/register",
    element: (
      <PublicOnlyRoutes>
        <RegisterPage />
      </PublicOnlyRoutes>
    ),
  },

  {
    path: "/app",
    element: (
      <ProtectedRoutes>
        <DashboardPage />
      </ProtectedRoutes>
    ),
  },
]);

export default router;
