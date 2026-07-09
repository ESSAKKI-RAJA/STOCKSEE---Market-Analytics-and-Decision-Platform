import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search, Menu, X, TrendingUp, BarChart3, Zap,
  BookOpen, Bot, LogIn, Star, Briefcase, LogOut,
  ChevronDown, Settings, Sun, Moon,
} from "lucide-react";
import StockSeeLogo from "@/components/StockSeeLogo";
import NotificationsBell from "@/components/NotificationsBell";
import { allStocks } from "@/data/stockData";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";

const NAV_ITEMS = [
  { path: "/",        label: "Discover",   icon: TrendingUp },
  { path: "/analyse", label: "Analyse",    icon: BarChart3  },
  { path: "/alerts",  label: "Alerts",     icon: Zap        },
  { path: "/academy", label: "Learn",      icon: BookOpen   },
  { path: "/advisor", label: "AI Advisor", icon: Bot        },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return allStocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [search]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToStock = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    setSearch("");
    setShowResults(false);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  };

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 lg:h-16 bg-bg-secondary/95 backdrop-blur-xl border-b border-border">
      <div className="h-full flex items-center justify-between px-4 lg:px-8 gap-4">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <StockSeeLogo className="text-xl" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-blue-accent bg-blue-accent/10"
                  : "text-text-muted hover:text-text-primary hover:bg-border"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Search — desktop */}
          <div className="hidden md:block relative" ref={searchRef}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (results[0]) goToStock(results[0].symbol);
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
                  onFocus={() => setShowResults(true)}
                  placeholder="Search stocks, ETFs…"
                  className="h-9 w-56 bg-card-surface border border-border rounded-xl text-sm text-text-primary pl-9 pr-3 outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/15 transition-all placeholder:text-text-muted"
                />
              </div>
            </form>
            {showResults && results.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1a1f2e] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 max-h-72 overflow-y-auto p-1.5">
                {results.map((s) => (
                  <button
                    key={`${s.exchange}-${s.symbol}`}
                    onClick={() => goToStock(s.symbol)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-blue-accent/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm">{s.flag}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-text-primary">{s.symbol}</p>
                        <p className="text-xs text-text-muted truncate">{s.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-border text-text-muted shrink-0">
                      {s.exchange}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <NotificationsBell />

          {/* User */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-all ${
                  userMenuOpen
                    ? "border-blue-accent bg-blue-accent/10"
                    : "bg-card-surface border-border hover:border-blue-accent/50"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-accent to-purple-accent flex items-center justify-center font-bold text-xs text-white select-none">
                  {userInitial}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-[#1a1f2e] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted mb-1">Signed in as</p>
                    <p className="text-[13px] text-text-primary font-medium truncate">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    {[
                      { to: "/watchlist", icon: Star,     label: "Watchlists"  },
                      { to: "/portfolio", icon: Briefcase, label: "Portfolio AI" },
                      { to: "/settings",  icon: Settings,  label: "Settings"    },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-text-muted rounded-lg hover:bg-blue-accent/10 hover:text-blue-accent transition-all"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                      </Link>
                    ))}
                  </div>
                  <div className="p-1.5 border-t border-[rgba(255,255,255,0.08)]">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-red-loss rounded-lg hover:bg-red-loss/10 transition-all"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-accent text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,255,0.35)] hover:bg-blue-accent/90 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-bg-secondary/98 backdrop-blur-xl">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-accent bg-blue-accent/10"
                    : "text-text-muted hover:text-text-primary hover:bg-border"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-blue-accent hover:bg-blue-accent/10 transition-colors mt-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
