import { useState } from "react";
import { Zap, Plus, Trash2, ArrowLeft, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { allStocks } from "@/data/stockData";
import { useAlerts, type AlertType } from "@/hooks/useAlerts";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/currency";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ALERT_TYPE_META: Record<AlertType, { label: string; color: string }> = {
  price_above: { label: "Price >= Target", color: "text-green-gain bg-green-gain/10 border-green-gain/20" },
  price_below: { label: "Price <= Target", color: "text-red-loss bg-red-loss/10 border-red-loss/20" },
  sma_crossover_bullish: { label: "SMA Bullish Cross", color: "text-green-gain bg-green-gain/10 border-green-gain/20" },
  sma_crossover_bearish: { label: "SMA Bearish Cross", color: "text-red-loss bg-red-loss/10 border-red-loss/20" },
};

export default function Alerts() {
  const { user } = useAuth();
  const { alerts, loading, createAlert, toggleAlert, deleteAlert } = useAlerts();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof allStocks[number] | null>(null);
  const [type, setType] = useState<AlertType>("price_above");
  const [threshold, setThreshold] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  const filtered = allStocks
    .filter((s) => !search || s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 12);

  const resetForm = () => {
    setSelected(null);
    setType("price_above");
    setThreshold("");
    setSearch("");
    setShowCreate(false);
  };

  const handleCreate = async () => {
    if (!selected) return;
    const isPriceAlert = type === "price_above" || type === "price_below";
    if (isPriceAlert && (!threshold || isNaN(Number(threshold)))) {
      toast.error("Invalid threshold value");
      return;
    }
    const result = await createAlert({
      symbol: selected.symbol,
      exchange: selected.exchange,
      alert_type: type,
      threshold: isPriceAlert ? Number(threshold) : null,
      sma_fast: isPriceAlert ? null : 20,
      sma_slow: isPriceAlert ? null : 50,
      note: null,
    });
    if (result) resetForm();
  };

  const runEvaluatorNow = async () => {
    setEvaluating(true);
    const { data, error } = await supabase.functions.invoke("alerts-evaluator");
    setEvaluating(false);
    if (error) {
      toast.error("Evaluator failed to run");
      return;
    }
    toast.success(`Evaluation complete. Triggered: ${data?.triggered ?? 0}`);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-card-surface border border-border rounded-2xl max-w-md w-full p-8 text-center relative overflow-hidden shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-blue-accent/10 border border-blue-accent/20 flex items-center justify-center mx-auto mb-6">
            <Bell className="w-8 h-8 text-blue-accent" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Authentication Required</h2>
          <p className="text-text-muted text-sm mb-8 leading-relaxed">
            Sign in to configure custom market alerts and predictive triggers.
          </p>
          <Link to="/auth" className="bg-blue-accent text-white flex items-center justify-center w-full py-3 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,255,0.39)] hover:bg-blue-accent/90 transition-all">
            Access Terminal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center shadow-inner">
            <Zap className="w-6 h-6 text-purple-accent" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-1">System Alerts</h1>
            <p className="text-text-muted text-sm font-medium">
              Configure algorithmic triggers and price level notifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={runEvaluatorNow} 
            disabled={evaluating} 
            className="bg-bg-secondary text-text-primary hover:bg-card-surface border border-border px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
          >
            {evaluating ? "Evaluating..." : "Force Eval"}
          </button>
          <button 
            onClick={() => setShowCreate(!showCreate)} 
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm ${showCreate ? 'bg-bg-secondary text-text-primary border border-border' : 'bg-blue-accent text-white hover:bg-blue-accent/90 shadow-[0_4px_14px_rgba(37,99,255,0.3)]'}`}
          >
            {showCreate ? "Cancel" : <><Plus size={16} /> New Alert</>}
          </button>
        </div>
      </div>

      <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg-secondary/50">
          <span className="font-heading font-bold text-text-primary tracking-wide flex items-center gap-2">
            Active Triggers
            <span className="bg-blue-accent/10 text-blue-accent border border-blue-accent/20 px-2 py-0.5 rounded text-xs font-bold ml-2">
              {alerts.length}
            </span>
          </span>
          <button className="text-text-muted hover:text-text-primary transition-colors">
            <Settings size={18} />
          </button>
        </div>

        {showCreate && (
          <div className="p-6 border-b border-border bg-bg-secondary/30">
            {!selected ? (
              <div className="flex flex-col gap-4 max-w-2xl">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest">Select Asset</label>
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search symbol (e.g. AAPL)..."
                    className="w-full bg-card-surface border border-border rounded-xl py-3 px-4 text-text-primary placeholder:text-text-muted outline-none focus:border-blue-accent/50 focus:ring-1 focus:ring-blue-accent/50 transition-all font-medium text-sm shadow-sm"
                    autoFocus
                  />
                </div>
                <div className="max-h-[240px] overflow-y-auto border border-border rounded-xl bg-card-surface shadow-sm divide-y divide-border/50">
                  {filtered.map((s) => (
                    <button
                      key={`${s.exchange}-${s.symbol}`}
                      onClick={() => { setSelected(s); setThreshold(s.price.toString()); }}
                      className="w-full flex justify-between items-center px-4 py-3 hover:bg-blue-accent/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{s.flag}</span>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-text-primary group-hover:text-blue-accent transition-colors">{s.symbol}</span>
                          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{s.name.substring(0,25)}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-text-primary text-sm">{formatCurrency(s.price, s.exchange)}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div className="p-4 text-center text-text-muted text-sm font-medium">No assets found.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-2xl">
                <div className="flex justify-between items-center p-4 bg-card-surface border border-border rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{selected.flag}</span>
                    <span className="font-heading font-bold text-text-primary text-lg">{selected.symbol}</span>
                    <span className="px-2 py-1 bg-bg-secondary rounded text-xs font-mono font-bold text-text-muted border border-border">
                      Current: {formatCurrency(selected.price, selected.exchange)}
                    </span>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors underline underline-offset-2">Change Asset</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-3 block">Trigger Type</label>
                    <div className="flex flex-col gap-2">
                      {(Object.keys(ALERT_TYPE_META) as AlertType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setType(t)}
                          className={`px-4 py-3 rounded-xl text-xs font-bold transition-all text-left border ${
                            type === t 
                              ? "bg-blue-accent/10 border-blue-accent/30 text-blue-accent shadow-sm" 
                              : "bg-card-surface border-border text-text-muted hover:border-blue-accent/30 hover:text-text-primary"
                          }`}
                        >
                          {ALERT_TYPE_META[t].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(type === "price_above" || type === "price_below") && (
                    <div>
                      <label className="text-xs font-bold text-text-primary uppercase tracking-widest mb-3 block">Target Level</label>
                      <input
                        type="number"
                        step="0.01"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        placeholder="Enter target price"
                        className="w-full bg-card-surface border border-border rounded-xl py-3 px-4 text-text-primary placeholder:text-text-muted outline-none focus:border-blue-accent/50 focus:ring-1 focus:ring-blue-accent/50 transition-all font-medium text-sm shadow-sm font-mono"
                      />
                      <div className="mt-3 text-[10px] text-text-muted uppercase tracking-widest font-bold bg-bg-secondary p-2 rounded border border-border">
                        Difference: <span className="font-mono ml-1">{Math.abs(selected.price - Number(threshold || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-border/50">
                  <button onClick={handleCreate} className="bg-blue-accent text-white hover:bg-blue-accent/90 px-6 py-3 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,255,0.3)] transition-all">
                    Deploy Trigger
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-text-muted font-mono text-sm animate-pulse tracking-widest uppercase">
            Loading triggers...
          </div>
        ) : alerts.length === 0 ? (
           <div className="p-16 text-center">
             <Bell className="w-12 h-12 text-border mx-auto mb-4" />
             <h3 className="text-lg font-heading font-bold text-text-primary mb-2">No active alerts</h3>
             <p className="text-text-muted mb-6 text-sm">You haven't configured any system triggers yet.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary/30 border-b border-border text-[10px] font-bold tracking-widest text-text-muted uppercase">
                  <th className="py-4 px-6">Asset</th>
                  <th className="py-4 px-6">Condition</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Last Trigger</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {alerts.map((a) => {
                  const meta = ALERT_TYPE_META[a.alert_type];
                  const condition =
                    a.alert_type === "price_above"
                      ? `>= ${formatCurrency(Number(a.threshold), a.exchange)}`
                      : a.alert_type === "price_below"
                      ? `<= ${formatCurrency(Number(a.threshold), a.exchange)}`
                      : a.alert_type === "sma_crossover_bullish"
                      ? `SMA-${a.sma_fast} > SMA-${a.sma_slow}`
                      : `SMA-${a.sma_fast} < SMA-${a.sma_slow}`;
                  return (
                    <tr key={a.id} className={`hover:bg-blue-accent/5 transition-colors group ${!a.active ? 'opacity-60' : ''}`}>
                      <td className="py-4 px-6">
                        <Link to={`/stock/${a.symbol}`} className="font-heading font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors">
                          {a.symbol}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${meta.color}`}>
                            {meta.label.split(' ')[0]}
                          </span>
                          <span className="font-mono font-bold text-sm text-text-primary">{condition}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => toggleAlert(a.id, !a.active)}
                          className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase border transition-colors ${
                            a.active 
                              ? "bg-green-gain/10 border-green-gain/30 text-green-gain hover:bg-green-gain/20" 
                              : "bg-bg-secondary border-border text-text-muted hover:bg-card-surface"
                          }`}
                        >
                          {a.active ? "Active" : "Paused"}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-xs font-bold text-text-muted">
                        {a.last_triggered_at ? formatDistanceToNow(new Date(a.last_triggered_at), { addSuffix: true }) : "NEVER"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => deleteAlert(a.id)}
                          className="p-2 text-text-muted hover:text-red-loss hover:bg-red-loss/10 rounded-lg transition-colors inline-flex mx-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
