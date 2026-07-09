import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const run = async () => {
      const hash = window.location.hash || "";
      if (hash.includes("error=") || hash.includes("error_description=")) {
        toast.error("Authentication failed or was canceled.");
        navigate("/login", { replace: true });
        return;
      }

      const qs = new URLSearchParams(location.search);
      const code = qs.get("code");

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.getSession().then(({ error }) => ({ error }));
          if (error) throw error;
        }

        const stored = sessionStorage.getItem("auth:redirect");
        sessionStorage.removeItem("auth:redirect");
        const destination = stored && stored.startsWith("/") ? stored : "/dashboard";

        toast.success("Signed in successfully!");
        navigate(destination, { replace: true });
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Authentication failed");
        navigate("/login", { replace: true });
      }
    };

    void run();
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
