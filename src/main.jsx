import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import QueryProvider from "@/providers/queryProvider";
import router from "@/routes/router";

import AuthProvider from "@/features/auth/providers/AuthProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);
