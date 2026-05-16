import AuthLayout from "@/layouts/AuthLayout";

import { Card, PageHeader } from "@/components/ui";

function LoginPage() {
  return (
    <AuthLayout>
      <Card className="p-8">
        <PageHeader
          title="Welcome back"
          description="Your thoughts and reflections are waiting for you."
        />
      </Card>
    </AuthLayout>
  );
}

export default LoginPage;
