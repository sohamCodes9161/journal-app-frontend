import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import { JournalThemeProvider } from "@/features/journal/context/JournalThemeContext";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";
import { ALL_THEMES } from "@/theme/themes";

function DashboardContent() {
  const location = useLocation();
  const { themeId, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isFocusMode =
    location.pathname.startsWith("/app/journals/") &&
    location.pathname !== "/app/journals";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main
      className="relative h-[100dvh] overflow-hidden text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)]"
      style={{
        background: "var(--gradient-page, var(--background-primary))",
      }}
    >
      {/* Floating Theme Selector Button */}

      <div className="relative z-10 flex h-full">
        {!isFocusMode && <Sidebar />}

        <div className="flex flex-1 flex-col min-h-0">
          {!isFocusMode && <Navbar />}

          <div
            className={`relative z-20 flex flex-1 flex-col min-h-0 transition-all duration-[var(--animation-default,220ms)] ${
              isFocusMode ? "p-0 sm:p-6 lg:p-8 pb-4" : "p-4 lg:p-8 pb-24"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>

      {!isFocusMode && <MobileNav />}
    </main>
  );
}

export default function DashboardLayout() {
  return (
    <ThemeProvider>
      <JournalThemeProvider>
        <DashboardContent />
      </JournalThemeProvider>
    </ThemeProvider>
  );
}
