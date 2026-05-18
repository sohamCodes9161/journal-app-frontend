import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import useAuth from "./useAuth";

import { logoutUser } from "../api/authApi";

import { clearAuthState } from "../utils/clearAuthState";

function useLogout() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  return useMutation({
    mutationFn: logoutUser,

    onSettled: () => {
      clearAuthState(setUser);

      navigate("/auth/login");
    },
  });
}

export default useLogout;
