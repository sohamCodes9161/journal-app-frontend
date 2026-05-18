import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import { Button, Input, PageHeader } from "@/components/ui";

import { loginUser } from "../api/authApi";

import useAuth from "../hooks/useAuth";

import AuthFormContainer from "../components/AuthFormContainer";
import AuthRedirectLink from "../components/AuthRedirectLink";

function LoginPage() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (response) => {
      console.log("LOGIN RESPONSE:", response);

      const user = response.user || response.data?.user;

      if (!user) {
        console.error("User object missing in response");

        return;
      }

      setUser(user);

      navigate("/app");
    },

    onError: (error) => {
      console.error(error);
    },
  });

  function handleChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    loginMutation.mutate(formData);
  }

  return (
    <AuthFormContainer>
      <PageHeader
        title="Welcome back"
        description="Continue your reflections and thoughts."
      />

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          Sign in
        </Button>

        {loginMutation.isError && (
          <p className="text-sm text-red-400">Login failed</p>
        )}
      </form>

      <div className="mt-6">
        <AuthRedirectLink
          text="Don't have an account?"
          linkText="Create one"
          to="/auth/register"
        />
      </div>
    </AuthFormContainer>
  );
}

export default LoginPage;
