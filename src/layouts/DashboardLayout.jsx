function DashboardLayout({ children }) {
  return (
    <main className="min-h-screen">
      <div className="flex">
        {/* sidebar later */}

        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </main>
  );
}

export default DashboardLayout;