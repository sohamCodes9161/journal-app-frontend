// src/layouts/DashboardLayout.jsx
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import { JournalThemeProvider } from "@/features/journal/context/JournalThemeContext";

function DashboardLayout({ children }) {
  const location = useLocation();

  const isFocusMode =
    location.pathname.startsWith("/app/journals/") &&
    location.pathname !== "/app/journals";

  return (
    <JournalThemeProvider>
      <main className="relative min-h-screen transition-colors duration-500 overflow-x-hidden">
        <div className="relative z-10 flex min-h-screen">
          {!isFocusMode && <Sidebar />}
          <div className="flex flex-1 flex-col">
            {!isFocusMode && <Navbar />}
            {/* 
              FIXED: Removed the forced padding frame on mobile when in focus mode 
              so the journal background canvas scales edge-to-edge.
            */}
            <div
              className={`relative z-20 flex-1 transition-all duration-500 ${
                isFocusMode ? "p-0 sm:p-6 lg:p-8 pb-4" : "p-4 lg:p-8 pb-24"
              }`}
            >
              <Outlet />
            </div>
          </div>
        </div>
        {!isFocusMode && <MobileNav />}
      </main>
    </JournalThemeProvider>
  );
}

export default DashboardLayout;
