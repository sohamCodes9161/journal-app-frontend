function AuthLayout({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;