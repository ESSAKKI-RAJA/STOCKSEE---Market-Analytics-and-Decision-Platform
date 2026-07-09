import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Zap } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) {
    return (
      <Link
        to="/auth"
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        title="Sign in for notifications"
      >
        <Bell className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-neon-red text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[28rem] rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col z-50"
          >
            <div className="flex items-center justify-between px-3 py-3 border-b border-white/10">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-accent transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Zap className="w-6 h-6 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No notifications yet</p>
                  <Link to="/alerts" onClick={() => setOpen(false)} className="text-xs text-accent hover:underline mt-1 inline-block">
                    Create your first alert
                  </Link>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/10 transition-colors ${!n.read ? "bg-accent/10" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.read && <span className="w-2 h-2 mt-1.5 rounded-full bg-accent shrink-0 shadow-[0_0_8px_hsl(var(--accent))]" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5 opacity-70">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <Link
              to="/alerts"
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-xs font-medium text-center text-accent hover:bg-white/5 border-t border-white/10 transition-colors"
            >
              Manage alerts →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
