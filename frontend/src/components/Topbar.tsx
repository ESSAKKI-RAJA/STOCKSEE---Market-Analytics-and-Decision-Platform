import { useState, useRef, useMemo, useEffect } from "react";
import {
  Search, ChevronDown, ArrowUpRight, Menu, LogIn, LogOut,
  Star, Briefcase, Settings, BarChart3, X, Sun, Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { allStocks, marketIndices } from "@/data/stockData";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import NotificationsBell from "./NotificationsBell";

interface TopbarProps {
  onMenuToggle: () => void;
}

function getMarketStatus(): { open: boolean; label: string } {
  const now = new Date();
  const day = now.getUTCDay();
  // EST = UTC-5 (approximate, ignoring DST)
  const etMinutes = ((now.getUTCHours() * 60 + now.getUTCMinutes()) - 300 + 1440) % 1440;
  const open = day >= 1 && day <= 5 && etMinutes >= 570 && etMinutes < 960;
  return { open, label: open ? "OPEN" : "CLOSED" };
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const market = getMarketStatus();
  const tickerItems = useMemo(() => [...marketIndices, ...marketIndices], []);

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
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResults(false);
        setUserMenuOpen(false);
        setMobileSearchOpen(false);
      }
      if (e.key === "/" && (document.activeElement as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        (searchRef.current?.querySelector("input") as HTMLInputElement | null)?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const goToStock = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    setSearch("");
    setShowResults(false);
    setMobileSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results[0]) goToStock(results[0].symbol);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  };

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 lg:h-16 bg-bg-secondary border-b border-border flex items-center px-4 lg:px-5 gap-3">

      {/* ─── LEFT: hamburger + logo (mobile only) ─────────────── */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 bg-blue-accent rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(37,99,255,0.4)]">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-widest uppercase text-text-primary font-heading">
            STOCKSEE
          </span>
        </Link>
      </div>

      {/* ─── LIVE badge (always visible, text hidden on mobile) ── */}
      <div className="flex items-center shrink-0 lg:pl-1">
        <div className="flex items-center gap-1.5 pr-3 lg:pr-4 lg:border-r lg:border-border">
          <span
            className="w-2 h-2 rounded-full shrink-0 animate-live-glow"
            style={{ backgroundColor: "#00ff88" }}
          />
          <span className="hidden lg:inline text-[10px] font-black tracking-[0.18em] uppercase font-mono"
            style={{ color: "#00ff88" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* ─── MIDDLE: ticker tape (desktop only) ───────────────── */}
      <div className="hidden lg:flex flex-1 overflow-hidden min-w-0">
        <div className="overflow-hidden w-full relative">
          <div className="animate-ticker-scroll flex w-max">
            {tickerItems.map((idx, i) => {
              const up = idx.change >= 0;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-5 border-r border-border shrink-0 h-14 lg:h-16"
                >
                  <span className="text-[11px] font-bold tracking-wider uppercase text-text-muted whitespace-nowrap">
                    {idx.flag}&nbsp;{idx.name}
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-text-primary">
                    {idx.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                      up
                        ? "text-green-gain bg-green-gain/10"
                        : "text-red-loss bg-red-loss/10"
                    }`}
                  >
                    {up ? "▲ +" : "▼ "}{idx.change.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── RIGHT: controls ──────────────────────────────────── */}
      <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">

        {/* Search — desktop */}
        <div className="hidden md:block relative" ref={searchRef}>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                placeholder="Search stocks, ETFs… (/)"
                className="h-9 w-52 lg:w-64 bg-card-surface border border-border rounded-xl text-sm text-text-primary pl-9 pr-3 outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/15 transition-all placeholder:text-text-muted"
              />
            </div>
          </form>

          {showResults && results.length > 0 && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1a1f2e] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 max-h-80 overflow-y-auto p-1.5">
              <div className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-text-muted">
                Results
              </div>
              {results.map((s) => {
                const up = s.change >= 0;
                return (
                  <button
                    key={`${s.exchange}-${s.symbol}`}
                    onClick={() => goToStock(s.symbol)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-blue-accent/10 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-bg-primary border border-border flex items-center justify-center font-bold text-xs text-text-primary shrink-0">
                        {s.symbol[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-sm font-bold text-text-primary group-hover:text-blue-accent transition-colors">
                          {s.symbol}
                        </div>
                        <div className="text-xs text-text-muted truncate max-w-[150px]">{s.name}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
                      <span className={`font-mono text-xs font-bold ${up ? "text-green-gain" : "text-red-loss"}`}>
                        {up ? "+" : ""}{s.changePercent?.toFixed(2) ?? "0.00"}%
                      </span>
                      <span className="text-[10px] text-text-muted uppercase">{s.exchange}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search icon — mobile */}
        <div className="md:hidden relative" ref={mobileSearchRef}>
          {mobileSearchOpen ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && results[0]) goToStock(results[0].symbol);
                  }}
                  placeholder="Search…"
                  className="h-9 w-44 bg-card-surface border border-blue-accent rounded-xl text-sm text-text-primary pl-9 pr-3 outline-none"
                />
              </div>
              <button
                onClick={() => { setMobileSearchOpen(false); setSearch(""); }}
                className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
              {search && results.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1f2e] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 max-h-64 overflow-y-auto p-1.5">
                  {results.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => goToStock(s.symbol)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-blue-accent/10 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-bg-primary border border-border flex items-center justify-center font-bold text-xs text-text-primary shrink-0">
                        {s.symbol[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-sm font-bold text-text-primary">{s.symbol}</div>
                        <div className="text-xs text-text-muted truncate">{s.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Market status */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-widest uppercase whitespace-nowrap ${
            market.open
              ? "text-green-gain bg-green-gain/10 border-green-gain/20"
              : "text-text-muted bg-card-surface border-border"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              market.open
                ? "bg-green-gain shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse"
                : "bg-text-muted"
            }`}
          />
          {market.label}
        </div>

        {/* Upgrade Pro */}
        <Link
          to="/pricing"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-premium/10 text-gold-premium border border-gold-premium/20 text-[11px] font-bold uppercase tracking-wider hover:bg-gold-premium/20 transition-colors whitespace-nowrap"
        >
          Upgrade Pro <ArrowUpRight className="w-3 h-3" />
        </Link>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <NotificationsBell />

        {/* User menu */}
        {user ? (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-all duration-200 ${
                userMenuOpen
                  ? "border-blue-accent bg-blue-accent/10"
                  : "bg-card-surface border-border hover:border-blue-accent/50"
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-accent to-purple-accent flex items-center justify-center font-bold text-xs text-white shadow-sm select-none">
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
                {/* Header */}
                <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted mb-1">
                    Signed in as
                  </p>
                  <p className="text-[13px] text-text-primary font-medium truncate">{user.email}</p>
                </div>

                {/* Nav items */}
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

                {/* Sign out */}
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
      </div>
    </header>
  );
}
