import { useState } from "react";

const ADMIN_CREDENTIALS = {
  email: "admin@tereverde.com.br",
  password: "123456",
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("tv_admin_auth") === "true",
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);

    // Simula latência de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem("tv_admin_auth", "true");
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }

    setAuthError("E-mail ou senha inválidos.");
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("tv_admin_auth");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, authError, isLoading, login, logout };
}
