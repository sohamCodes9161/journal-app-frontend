function AuthLayout({ children }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)]"
      style={{
        background: "var(--gradient-page, var(--background-primary))",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}

export default AuthLayout;
