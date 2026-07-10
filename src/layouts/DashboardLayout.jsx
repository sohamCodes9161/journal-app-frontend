import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import { JournalThemeProvider } from "@/features/journal/context/JournalThemeContext";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

export default function DashboardLayout() {
  const location = useLocation();

  const isFocusMode =
    location.pathname.startsWith("/app/journals/") &&
    location.pathname !== "/app/journals";

  return (
    <main
      className="relative h-[100dvh] overflow-hidden text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)]"
      style={{
        background: "var(--gradient-page, var(--background-primary))",
      }}
    >
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
