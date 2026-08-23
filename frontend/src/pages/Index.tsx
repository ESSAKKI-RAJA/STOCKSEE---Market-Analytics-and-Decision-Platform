import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Activity, Star
} from "lucide-react";
import MarketContext from "../components/dashboard/MarketContext";
import EmergingSignals from "../components/dashboard/EmergingSignals";

const MODULES = [
  { name: "Global Markets", path: "/analyse", icon: Activity, desc: "Indices & macro tracking" },
  { name: "Watchlist", path: "/watchlist", icon: Star, desc: "Tracked assets" },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in-up pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary tracking-tight">
            Intelligence Command Center
          </h1>
          <p className="text-text-muted text-[13px] mt-1">
            Global macro context, emerging signals, and intelligence modules.
          </p>
        </div>
        <div className="text-[11px] font-mono text-text-muted bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded">
          SYSTEM STATUS: <span className="text-emerald-500 font-bold">ONLINE</span>
        </div>
      </div>

      {/* ── TOP ROW: Context & Signals (12-col grid) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <MarketContext />
        </div>
        <div className="xl:col-span-4">
          <EmergingSignals />
        </div>
      </div>

      {/* ── BOTTOM ROW: Intelligence Modules ── */}
      <div className="mt-4">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-4 border-b border-border pb-2">
          Intelligence Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map((mod) => (
            <div 
              key={mod.name}
              onClick={() => navigate(mod.path)}
              className="bg-card-surface border border-border p-4 rounded cursor-pointer group hover:border-zinc-700 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-sky-500">
                <ArrowRight size={16} />
              </div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-sky-500 group-hover:border-sky-500/50 transition-colors shrink-0">
                  <mod.icon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-[14px] group-hover:text-sky-500 transition-colors font-heading leading-tight mb-1">
                    {mod.name}
                  </h3>
                  <p className="text-[12px] text-text-muted leading-snug">
                    {mod.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
