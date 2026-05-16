import AuthLayout from "@/layouts/AuthLayout";

import { Card, PageHeader } from "@/components/ui";

function RegisterPage() {
  return (
    <AuthLayout>
      <Card className="p-8">
        <PageHeader
          title="Create your space"
          description="Start your calm digital journaling journey."
        />
      </Card>
    </AuthLayout>
  );
}

export default RegisterPage;
