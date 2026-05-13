import AppLayout from "@/layouts/AppLayout";

import {
  Button,
  Card,
  PageHeader,
} from "@/components/ui";

function HomePage() {
  return (
    <AppLayout>
      <Card className="p-8">
        <PageHeader
          title="Journal App"
          description="Your calm digital space for reflection, thoughts, productivity, and growth."
        />

        <div className="flex gap-4">
          <Button>
            Start Journaling
          </Button>

          <Button variant="secondary">
            Explore
          </Button>
        </div>
      </Card>
    </AppLayout>
  );
}

export default HomePage;