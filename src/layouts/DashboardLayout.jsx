import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";

export default function DashboardLayout() {
  const location = useLocation();

  const isFocusMode =
    location.pathname.startsWith("/app/journals/") &&
    location.pathname !== "/app/journals";

  return (
    <main
      className="relative h-[100dvh] w-full max-w-full overflow-x-hidden text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)]"
      style={{
        background: "var(--gradient-page, var(--background-primary))",
      }}
    >
      <div className="relative z-10 flex h-full w-full max-w-full min-w-0">
        {!isFocusMode && <Sidebar />}

        <div className="flex flex-1 flex-col min-h-0 min-w-0 w-full max-w-full overflow-x-hidden">
          {!isFocusMode && <Navbar />}

          <div
            className={`relative z-20 flex flex-1 flex-col min-h-0 min-w-0 w-full max-w-full overflow-x-hidden transition-all duration-[var(--animation-default,220ms)] ${
              isFocusMode ? "p-0 sm:p-6 lg:p-8 pb-4" : "p-3 sm:p-6 lg:p-8 pb-28"
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
