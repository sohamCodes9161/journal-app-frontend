import Container from "@/components/ui/Container";

function PublicLayout({ children }) {
  return (
    <main className="min-h-screen py-6">
      <Container>
        {children}
      </Container>
    </main>
  );
}

export default PublicLayout;