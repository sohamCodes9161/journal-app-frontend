import Navbar from "@/navigation/Navbar";
import Sidebar from "@/navigation/Sidebar";
import MobileNav from "@/navigation/MobileNav";
function DashboardLayout({ children }) {
  return (
    <main className="min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="flex-1 p-4 pb-24 lg:p-8">{children}</div>
        </div>
      </div>

      <MobileNav />
    </main>
  );
}

export default DashboardLayout;
