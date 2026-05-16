import { createContext, useEffect, useMemo, useState } from "react";

import { getCurrentUser } from "../api/authApi";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await getCurrentUser();

        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
      isAuthenticated: !!user,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
