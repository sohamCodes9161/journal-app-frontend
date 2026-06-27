import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import { JournalThemeProvider } from "@/features/journal/context/JournalThemeContext";
import Container from "@/components/ui/Container";

// 1. THE MAIN DASHBOARD LAYOUT (Fixed Layering & Background)
function DashboardLayout() {
  return (
    <JournalThemeProvider>
      {/* We removed the hardcoded bg-slate-950 dark mode. 
        Instead, we use relative positioning so the background theme 
        stays AT THE BOTTOM, and content stays ON TOP.
      */}
      <main className="relative min-h-screen transition-colors duration-500 overflow-x-hidden text-slate-100">
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />

          <div className="flex flex-1 flex-col">
            <Navbar />

            {/* Content layer explicitly pulled to the front */}
            <div className="relative z-20 flex-1 p-4 pb-24 lg:p-8">
              <Outlet />
            </div>
          </div>
        </div>

        <MobileNav />
      </main>
    </JournalThemeProvider>
  );
}

// 2. APP LAYOUT
function AppLayout({ children }) {
  return (
    <main className="relative z-10 min-h-screen px-4 py-6">
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </main>
  );
}

// 3. PUBLIC LAYOUT
function PublicLayout({ children }) {
  return (
    <main className="relative z-10 min-h-screen py-6">
      <Container>{children}</Container>
    </main>
  );
}

// 4. AUTH LAYOUT
function AuthLayout({ children }) {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}

// CLEANED EXPORTS (Only export DashboardLayout as default, export others cleanly)
export default DashboardLayout;
export { AppLayout, PublicLayout, AuthLayout };
