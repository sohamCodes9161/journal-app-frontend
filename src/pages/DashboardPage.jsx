import DashboardLayout from "@/layouts/DashboardLayout";

import {
  Card,
  PageHeader,
} from "@/components/ui";

function DashboardPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="A gentle overview of your thoughts, habits, and progress."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-6">
          Mood Overview
        </Card>

        <Card className="p-6">
          Journal Activity
        </Card>

        <Card className="p-6">
          Weekly Reflection
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;