import AuthLayout from "@/layouts/AuthLayout";

import { Card } from "@/components/ui";

function AuthFormContainer({ children }) {
  return (
    <AuthLayout>
      <Card className="p-8">{children}</Card>
    </AuthLayout>
  );
}

export default AuthFormContainer;
