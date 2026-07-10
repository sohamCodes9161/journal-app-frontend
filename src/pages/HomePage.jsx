import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button, Card, PageHeader } from "@/components/ui";
import useAuth from "@/features/auth/hooks/useAuth";

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the server check finishes and confirms the user is logged in,
    // seamlessly push them over to the dashboard route.
    if (!isLoading && isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <AppLayout>
      <Card className="p-8">
        <PageHeader
          title="Journal App"
          description="Your calm digital space for reflection, thoughts, productivity, and growth."
        />

        <div className="flex gap-4">
          <Button onClick={() => navigate("/auth/login")}>
            Start Journaling
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/auth/register")}
          >
            Explore
          </Button>
        </div>
      </Card>
    </AppLayout>
  );
}

export default HomePage;
