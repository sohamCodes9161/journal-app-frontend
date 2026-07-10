function AppLayout({ children }) {
  return (
    <main
      className="min-h-screen px-4 py-6 text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)]"
      style={{
        background: "var(--gradient-page, var(--background-primary))",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </main>
  );
}

export default AppLayout;
