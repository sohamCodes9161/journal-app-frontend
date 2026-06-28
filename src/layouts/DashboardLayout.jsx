import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import { JournalThemeProvider } from "@/features/journal/context/JournalThemeContext";

function DashboardLayout({ children }) {
  const location = useLocation();

  // THIS IS THE BRIDGE:
  // Every time currentTheme changes, we update the data-atmosphere
  // attribute on the <body> tag. This is what triggers your globals.css!

  const isFocusMode =
    location.pathname.startsWith("/app/journals/") &&
    location.pathname !== "/app/journals";

  return (
    <JournalThemeProvider>
      {/* 
        This main container is now clean. 
        The background and text colors are fully controlled 
        by your global CSS variables.
      */}
      <main className="relative min-h-screen transition-colors duration-500 overflow-x-hidden">
        <div className="relative z-10 flex min-h-screen">
          {!isFocusMode && <Sidebar />}
          <div className="flex flex-1 flex-col">
            {!isFocusMode && <Navbar />}
            <div
              className={`relative z-20 flex-1 p-4 lg:p-8 ${isFocusMode ? "pb-4" : "pb-24"}`}
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
