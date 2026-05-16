import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/authApi";

function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],

    queryFn: getCurrentUser,

    retry: false,
  });
}

export default useCurrentUser;
