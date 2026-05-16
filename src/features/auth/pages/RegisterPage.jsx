import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import { Button, Input, PageHeader } from "@/components/ui";

import useAuth from "../hooks/useAuth";

import { registerUser } from "../api/authApi";

import AuthFormContainer from "../components/AuthFormContainer";
import AuthRedirectLink from "../components/AuthRedirectLink";

function RegisterPage() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: (data) => {
      setUser(data.user);

      navigate("/app");
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

    registerMutation.mutate(formData);
  }

  return (
    <AuthFormContainer>
      <PageHeader
        title="Create your space"
        description="A calm place for your thoughts, growth, and reflections."
      />

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          type="text"
          name="username"
          placeholder="Your username"
          value={formData.username}
          onChange={handleChange}
        />

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
          isLoading={registerMutation.isPending}
        >
          Create account
        </Button>
      </form>

      <div className="mt-6">
        <AuthRedirectLink
          text="Already have an account?"
          linkText="Sign in"
          to="/auth/login"
        />
      </div>

      {registerMutation.isError && (
        <p className="text-sm text-red-400">
          {registerMutation.error?.response?.data?.message ||
            "Something went wrong"}
        </p>
      )}
    </AuthFormContainer>
  );
}

export default RegisterPage;
