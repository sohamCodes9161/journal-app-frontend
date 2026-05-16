import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";

import ProtectedRoutes from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
