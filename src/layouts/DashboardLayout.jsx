import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import { JournalThemeProvider } from "@/features/journal/context/JournalThemeContext";

function DashboardLayout() {
  return (
    // 💡 THE FIX: Wrapping the root container here makes sure that Sidebar,
    // Navbar, and the page Outlet all have safe access to the theme state!
    <JournalThemeProvider>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex flex-1 flex-col">
            <Navbar />

            <div className="flex-1 p-4 pb-24 lg:p-8">
              <Outlet />
            </div>
          </div>
        </div>

        <MobileNav />
      </main>
    </JournalThemeProvider>
  );
}

export default DashboardLayout;
