import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";

import DashboardPage from "@/pages/DashboardPage";
import JournalPage from "@/pages/JournalPage";
import TodosPage from "@/features/todos/pages/TodosPage";

import JournalFeedPage from "@/features/journal/pages/JournalFeedPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import JournalDetailPage from "@/features/journal/pages/JournalDetailPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import CreateJournalPage from "@/features/journal/pages/CreateJournalPage";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicOnlyRoutes from "./PublicOnlyRoutes";
import SettingsPage from "@/pages/SettingsPage";
import { AnalyticsPage } from "@/features/analytics/pages/AnalyticsPage";
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
    element: <ProtectedRoutes />,

    children: [
      {
        path: "/app",

        element: <DashboardLayout />,

        children: [
          {
            index: true,
            element: <DashboardPage />,
          },

          {
            path: "journals",
            element: <JournalFeedPage />,
          },

          {
            path: "todos",
            element: <TodosPage />,
          },
          {
            path: "analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "journals/new",
            element: <CreateJournalPage />,
          },
          {
            path: "journals/:journalId",
            element: <JournalDetailPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "analytics",
            element: <AnalyticsPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
