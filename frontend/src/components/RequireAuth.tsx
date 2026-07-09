import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="flex items-center gap-3 bg-card-surface border border-border rounded-2xl px-6 py-4 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "300ms" }} />
          <span className="ml-2 font-mono text-text-muted text-sm">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return <Outlet />;
}

