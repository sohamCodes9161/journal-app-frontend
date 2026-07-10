import Container from "@/components/ui/Container";

function PublicLayout({ children }) {
  return (
    <main
      className="min-h-screen py-6 text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)]"
      style={{
        background: "var(--gradient-page, var(--background-primary))",
        backgroundAttachment: "fixed",
      }}
    >
      <Container>{children}</Container>
    </main>
  );
}

export default PublicLayout;
