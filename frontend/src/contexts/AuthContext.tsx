import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

interface AuthCtx {
  user: {
    id: string;
    email: string;
    full_name?: string;
    is_active: boolean;
  } | null;
  loading: boolean;
  login: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // We no longer need a Context Provider because Clerk handles it
  return <>{children}</>;
}

export const useAuth = (): AuthCtx => {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();

  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      full_name: user.fullName || "",
      is_active: true
    } : null,
    loading: !isLoaded,
    login: async () => { clerk.openSignIn() },
    signOut: async () => { await clerk.signOut() },
  };
};
