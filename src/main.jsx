import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import QueryProvider from "@/providers/queryProvider";
import router from "@/routes/router";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/features/auth/providers/AuthProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,

            style: {
              background: "var(--surface-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);
