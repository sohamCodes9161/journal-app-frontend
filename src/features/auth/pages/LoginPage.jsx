import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { Button, Input, PageHeader } from "@/components/ui";

import FormField from "@/components/forms/FormField";

import { loginSchema } from "../validation/loginSchema";

import { loginUser } from "../api/authApi";

import useAuth from "../hooks/useAuth";

import AuthFormContainer from "../components/AuthFormContainer";
import AuthRedirectLink from "../components/AuthRedirectLink";

function LoginPage() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      setUser(data.user);

      if (data.user.themePreference) {
        localStorage.setItem("theme", data.user.themePreference);
      }

      navigate("/app");
    },

    onError: (error) => {
      console.error(error);
    },
  });

  function onSubmit(formData) {
    loginMutation.mutate(formData);
  }

  return (
    <AuthFormContainer>
      <PageHeader
        title="Welcome back"
        description="Continue your reflections and thoughts."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
        </FormField>

        <Button
          type="submit"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          Sign in
        </Button>

        {loginMutation.isError && (
          <p className="text-sm text-red-400">Invalid email or password</p>
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
