import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await apiClient.get<User>("/api/auth/me");
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        await signOut();
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const signOut = async () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, token, login, signOut, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(Ctx);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
