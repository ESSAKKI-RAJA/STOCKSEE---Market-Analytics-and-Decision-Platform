import { Link, useLocation } from "react-router-dom";
import {
  X, BarChart3, LayoutGrid, Activity, Star
} from "lucide-react";

const NAV = [
  { path: "/",          label: "Dashboard",    icon: LayoutGrid },
  { path: "/analyse",   label: "Analyse",      icon: Activity },
  { path: "/watchlist", label: "Watchlist",    icon: Star },
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
          className="flex items-center gap-3 px-6 py-5 border-b border-border hover:bg-zinc-900 transition-colors group"
          onClick={onClose}
        >
          <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center group-hover:border-sky-500 transition-colors flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-sky-500" />
          </div>
          <span className="font-extrabold text-base tracking-widest uppercase text-text-primary group-hover:text-sky-500 transition-colors font-heading">
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
                  relative flex items-center gap-3 px-4 py-2.5 mb-1 rounded
                  text-[13px] font-semibold transition-all group
                  ${isActive
                    ? "text-zinc-50 bg-zinc-900 border-l-[3px] border-sky-500 rounded-l-none"
                    : "text-text-muted hover:text-white hover:bg-zinc-900 border-l-[3px] border-transparent"
                  }
                `}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive ? "text-sky-500" : "text-text-muted group-hover:text-white"
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
