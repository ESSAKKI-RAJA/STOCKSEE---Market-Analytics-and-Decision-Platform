import { Link, useLocation } from "react-router-dom";
import {
  X, BarChart3, LayoutGrid, Activity, Star, Briefcase,
  Zap, Newspaper, Map, Filter, BookOpen, Settings,
} from "lucide-react";

const NAV = [
  { path: "/",          label: "Dashboard",    icon: LayoutGrid },
  { path: "/analyse",   label: "Analyse",      icon: Activity },
  { path: "/watchlist", label: "Watchlist",    icon: Star },

  { path: "/alerts",    label: "Alerts",       icon: Zap },
  { path: "/news",      label: "News Center",  icon: Newspaper },
  { path: "/heatmaps",  label: "Heatmaps",     icon: Map },
  { path: "/screener",  label: "Screener Pro", icon: Filter },
  { path: "/academy",   label: "Academy",      icon: BookOpen },
  { path: "/settings",  label: "Settings",     icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop — mobile/tablet only */}
      <div
        className={`fixed inset-0 top-14 lg:top-16 bg-black/60 z-[35] lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`
          fixed left-0 top-14 bottom-0 w-[240px] z-40
          flex flex-col overflow-y-auto
          bg-bg-secondary border-r border-border
          transition-transform duration-300 ease-in-out
          lg:top-16 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo row */}
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-5 border-b border-border hover:bg-blue-accent/5 transition-colors group"
          onClick={onClose}
        >
          <div className="w-8 h-8 bg-blue-accent rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(37,99,255,0.4)] group-hover:shadow-[0_0_20px_rgba(37,99,255,0.55)] transition-shadow flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-widest uppercase text-text-primary group-hover:text-blue-accent transition-colors font-heading">
            STOCKSEE
          </span>
        </Link>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-[18px] right-4 w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Section label */}
        <div className="px-6 pt-5 pb-2 text-[10px] font-bold tracking-widest uppercase text-text-muted select-none">
          Navigation
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 pb-4">
          {NAV.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  relative flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg
                  text-[13px] font-semibold transition-all group
                  ${isActive
                    ? "text-blue-accent bg-blue-accent/10"
                    : "text-text-muted hover:text-white hover:bg-blue-accent/5"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-1/2 bg-blue-accent rounded-r-full shadow-[0_0_8px_rgba(37,99,255,0.5)]" />
                )}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 border border-blue-accent/10 rounded-lg pointer-events-none transition-opacity" />
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive ? "text-blue-accent" : "text-text-muted group-hover:text-white"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
