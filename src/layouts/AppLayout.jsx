function AppLayout({ children }) {
  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </main>
  );
}

export default AppLayout;
