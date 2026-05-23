import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import QueryProvider from "@/providers/queryProvider";
import router from "@/routes/router";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/features/auth/providers/AuthProvider";

import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,

            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "14px 16px",
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);
