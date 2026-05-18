import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
function DashboardLayout() {
  return (
    <main className="min-h-screen">
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
  );
}

export default DashboardLayout;
