import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  AuthenticationError,
  type CurrentUser,
  type LoginCredentials,
} from "../api/auth";

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  authenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch (error) {
      if (!(error instanceof AuthenticationError)) {
        console.error("Erro ao consultar sessão:", error);
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function login(credentials: LoginCredentials) {
    const response = await loginRequest(credentials);
    setUser(response.user);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authenticated: user !== null,
      login,
      logout,
      refresh,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider.",
    );
  }

  return context;
}
