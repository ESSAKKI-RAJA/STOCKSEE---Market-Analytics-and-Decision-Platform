import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Briefcase, Plus, Trash2, PieChart, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Lightbulb, Activity, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useStockPrices } from "@/hooks/useStockPrices";
import { formatCurrency } from "@/lib/currency";
import { allStocks } from "@/data/stockData";
import { toast } from "sonner";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";

interface Holding {
  id: string;
  symbol: string;
  exchange: string;
  quantity: number;
  avg_buy_price: number;
}

export default function Portfolio() {
  const { user, loading: authLoading } = useAuth();
  const { stocks } = useStockPrices();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol: "", exchange: "NSE", quantity: "", avg_buy_price: "" });

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("user_portfolio")
      .select("id, symbol, exchange, quantity, avg_buy_price")
      .order("created_at", { ascending: false });
    if (!error && data) setHoldings(data as Holding[]);
    setLoading(false);
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [user]);

  const addHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const stock = allStocks.find((s) => s.symbol === form.symbol.toUpperCase());
    const exchange = stock?.exchange || form.exchange;
    const { error } = await supabase.from("user_portfolio").insert({
      user_id: user.id,
      symbol: form.symbol.toUpperCase(),
      exchange,
      quantity: Number(form.quantity),
      avg_buy_price: Number(form.avg_buy_price),
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Holding added to portfolio");
    setForm({ symbol: "", exchange: "NSE", quantity: "", avg_buy_price: "" });
    setShowForm(false);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("user_portfolio").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Holding removed");
    refresh();
  };

  if (authLoading) return (
    <div className="flex justify-center p-12">
      <div className="flex items-center gap-3 bg-card-surface border border-border rounded-2xl px-6 py-4 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        <span className="ml-2 font-mono text-text-muted text-sm">Authenticating...</span>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-card-surface border border-border rounded-2xl max-w-md w-full p-8 text-center relative overflow-hidden group shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-accent/10 border border-blue-accent/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,255,0.15)]">
              <Briefcase className="w-8 h-8 text-blue-accent" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Portfolio Locked</h2>
            <p className="text-text-muted text-sm mb-8 leading-relaxed">
              Sign in to manage your portfolio, track your investments in real-time, and get AI-powered insights.
            </p>
            <Link to="/auth" className="bg-blue-accent text-white flex items-center justify-center w-full py-3 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,255,0.39)] hover:bg-blue-accent/90 transition-all">
              Access Terminal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

  let totalCost = 0, totalValue = 0;
  const sectorData: Record<string, number> = {};
  
  const enriched = holdings.map((h) => {
    const live = stockMap.get(h.symbol) || allStocks.find((s) => s.symbol === h.symbol);
    const currentPrice = live?.price ?? h.avg_buy_price;
    const cost = h.quantity * h.avg_buy_price;
    const value = h.quantity * currentPrice;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    
    totalCost += cost;
    totalValue += value;
    
    const sector = live?.sector || "Other";
    sectorData[sector] = (sectorData[sector] || 0) + value;
    
    return { ...h, live, currentPrice, cost, value, pnl, pnlPct, sector };
  });
  
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  // Pie chart data
  const pieData = Object.entries(sectorData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#2563ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-2 flex items-center gap-3">
            Portfolio AI
            <PieChart className="text-blue-accent w-7 h-7" />
          </h1>
          <div className="flex items-center gap-2 text-text-muted text-sm uppercase tracking-wider text-[11px] font-bold">
            <Link to="/" className="hover:text-blue-accent transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-text-primary">Portfolio AI</span>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-accent hover:bg-blue-accent/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,255,0.3)] transition-all flex items-center gap-2">
          <Plus size={18} /> Add Position
        </button>
      </div>

      {showForm && (
        <div className="bg-card-surface border border-blue-accent/30 rounded-2xl p-6 shadow-[0_8px_30px_rgba(37,99,255,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-accent to-purple-accent" />
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-blue-accent" /> New Position
          </h3>
          <form onSubmit={addHolding} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input required placeholder="Symbol (e.g. AAPL)" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} className="bg-bg-secondary border border-border rounded-xl py-3 px-4 text-text-primary placeholder-text-muted outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent transition-all font-mono" />
            <select value={form.exchange} onChange={(e) => setForm({ ...form, exchange: e.target.value })} className="bg-bg-secondary border border-border rounded-xl py-3 px-4 text-text-primary outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent transition-all">
              <option>NSE</option><option>BSE</option><option>NASDAQ</option><option>NYSE</option><option>LSE</option><option>XETRA</option>
            </select>
            <input required type="number" step="0.0001" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="bg-bg-secondary border border-border rounded-xl py-3 px-4 text-text-primary placeholder-text-muted outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent transition-all font-mono" />
            <input required type="number" step="0.01" placeholder="Avg Buy Price" value={form.avg_buy_price} onChange={(e) => setForm({ ...form, avg_buy_price: e.target.value })} className="bg-bg-secondary border border-border rounded-xl py-3 px-4 text-text-primary placeholder-text-muted outline-none focus:border-blue-accent focus:ring-1 focus:ring-blue-accent transition-all font-mono" />
            <button type="submit" className="bg-blue-accent hover:bg-blue-accent/90 text-white rounded-xl py-3 font-bold transition-all shadow-md">Execute Trade</button>
          </form>
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-surface border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <DollarSign className="w-24 h-24 text-white" />
          </div>
          <div className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-3">Total Invested</div>
          <div className="font-mono text-3xl font-bold text-text-primary mb-1">
            ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-card-surface border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <Briefcase className="w-24 h-24 text-white" />
          </div>
          <div className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-3">Current Value</div>
          <div className="font-mono text-3xl font-bold text-text-primary mb-1">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className={`bg-card-surface rounded-2xl p-6 relative overflow-hidden shadow-sm border ${totalPnl >= 0 ? "border-green-gain/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "border-red-loss/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]"}`}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            {totalPnl >= 0 ? <TrendingUp className="w-24 h-24 text-green-gain" /> : <TrendingDown className="w-24 h-24 text-red-loss" />}
          </div>
          <div className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-3">Total P&L</div>
          <div className={`font-mono text-3xl font-bold mb-1 flex items-baseline gap-2 ${totalPnl >= 0 ? "text-green-gain" : "text-red-loss"}`}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-sm font-semibold opacity-80">({totalPnl >= 0 ? "+" : ""}{totalPnlPct.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COL: Holdings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-bg-secondary/50">
              <span className="font-heading font-bold text-text-primary tracking-wide flex items-center gap-2">
                Active Positions
                <span className="bg-blue-accent/10 text-blue-accent border border-blue-accent/20 px-2 py-0.5 rounded text-xs font-bold ml-2">
                  {enriched.length}
                </span>
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-text-muted font-mono text-sm animate-pulse">
                LOADING POSITIONS...
              </div>
            ) : enriched.length === 0 ? (
               <div className="p-16 text-center">
                 <Briefcase className="w-12 h-12 text-border mx-auto mb-4" />
                 <div className="text-lg font-medium text-text-primary mb-2 font-heading">No positions found</div>
                 <div className="text-sm text-text-muted">Click 'Add Position' to start tracking your portfolio.</div>
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-secondary/30 border-b border-border text-[10px] font-bold tracking-widest text-text-muted uppercase">
                      <th className="py-4 px-6">Asset</th>
                      <th className="py-4 px-6 text-right">Avg Buy</th>
                      <th className="py-4 px-6 text-right">Current</th>
                      <th className="py-4 px-6 text-right">Qty</th>
                      <th className="py-4 px-6 text-right">P&L</th>
                      <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {enriched.map((h) => {
                      const isUp = h.pnl >= 0;
                      return (
                        <tr key={h.id} className="hover:bg-blue-accent/5 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-bg-secondary border border-border flex items-center justify-center font-bold text-xs text-text-primary">
                                {h.symbol[0]}
                              </div>
                              <div>
                                <Link to={`/stock/${h.symbol}`} className="font-mono font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors">
                                  {h.symbol}
                                </Link>
                                <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">
                                  {h.exchange}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="font-mono font-medium text-text-muted text-sm">
                              {formatCurrency(h.avg_buy_price, h.exchange)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="font-mono font-bold text-text-primary text-sm group-hover:text-blue-accent transition-colors">
                              {formatCurrency(h.currentPrice, h.exchange)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="font-mono text-text-primary text-sm">
                              {h.quantity}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className={`font-mono text-sm font-bold ${isUp ? "text-green-gain" : "text-red-loss"}`}>
                              {isUp ? "+" : ""}{h.pnlPct.toFixed(2)}%
                            </div>
                            <div className={`font-mono text-[11px] mt-0.5 ${isUp ? "text-green-gain/70" : "text-red-loss/70"}`}>
                              {isUp ? "+" : ""}{h.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => remove(h.id)}
                              className="p-2 text-text-muted hover:text-red-loss hover:bg-red-loss/10 rounded-lg transition-colors inline-flex mx-auto"
                              title="Remove Position"
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

        {/* RIGHT COL: AI Insights & Allocation */}
        <div className="flex flex-col gap-6">
          
          {/* Allocation */}
          <div className="bg-card-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
              <span className="font-heading font-bold text-text-primary tracking-wide">Sector Allocation</span>
            </div>
            <div className="p-6">
              {pieData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                          contentStyle={{ backgroundColor: 'var(--card-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                          itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <div className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Holdings</div>
                      <div className="font-mono font-bold text-xl">{enriched.length}</div>
                    </div>
                  </div>
                  <div className="w-full mt-4 flex flex-col gap-2">
                    {pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-text-muted font-medium">{entry.name}</span>
                        </div>
                        <span className="font-mono font-bold text-text-primary">{((entry.value / totalValue) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-text-muted text-sm py-8">Add positions to see allocation.</div>
              )}
            </div>
          </div>

          {/* AI Insights Module */}
          <div className="bg-card-surface border border-purple-accent/30 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(124,58,237,0.05)]">
            <div className="px-6 py-4 border-b border-border bg-bg-secondary/50 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-accent" />
              <span className="font-heading font-bold text-text-primary tracking-wide">AI Portfolio Analysis</span>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Diversification Score</span>
                <span className="font-mono font-bold text-green-gain bg-green-gain/10 px-2 py-0.5 rounded border border-green-gain/20 text-sm">78/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Risk Profile</span>
                <span className="font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 text-sm">Moderate-High</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Est. 1Y Return</span>
                <span className="font-mono font-bold text-text-primary">12.5% - 18.0%</span>
              </div>
              
              <div className="pt-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary mb-1">Overweight in Technology</div>
                    <div className="text-xs text-text-muted leading-relaxed">Your portfolio has heavy exposure to Tech. Consider diversifying into defensive sectors like Healthcare or Utilities.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Lightbulb className="w-4 h-4 text-purple-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary mb-1">Rebalancing Idea</div>
                    <div className="text-xs text-text-muted leading-relaxed">Taking 15% profit from top performers and reallocating to undervalued dividend ETFs could optimize Sharpe ratio.</div>
                  </div>
                </div>
              </div>
              
              <button className="mt-2 w-full py-2.5 rounded-lg border border-purple-accent/30 text-purple-accent hover:bg-purple-accent/10 transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                Full AI Audit <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
