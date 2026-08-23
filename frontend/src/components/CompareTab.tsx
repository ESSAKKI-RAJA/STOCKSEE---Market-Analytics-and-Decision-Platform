import { useState } from "react";
import { Search, Loader2, ArrowRightLeft, Database } from "lucide-react";
import { useEssai, type EssaiComparison } from "@/hooks/useEssai";
import { allStocks } from "@/data/stockData";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useStockHistory, type OHLCVRow } from "@/hooks/useStockHistory";

interface CompareTabProps {
  baseSymbol: string;
}

export default function CompareTab({ baseSymbol }: CompareTabProps) {
  const [targetSymbol, setTargetSymbol] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { compareSymbols } = useEssai();
  const [comparison, setComparison] = useState<EssaiComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: baseData, fetchHistory: fetchBase } = useStockHistory();
  const { data: targetData, fetchHistory: fetchTarget } = useStockHistory();

  const handleCompare = async (target: string) => {
    setTargetSymbol(target);
    setLoading(true);
    setError("");
    try {
      const res = await compareSymbols(baseSymbol, target);
      setComparison(res);
      fetchBase(baseSymbol, "1mo");
      fetchTarget(target, "1mo");
    } catch (err) {
      setError("Failed to generate comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchResults = allStocks.filter(s =>
    s.symbol !== baseSymbol &&
    (s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 5);

  const getNormalizedChartData = () => {
    if (!baseData?.rows?.length || !targetData?.rows?.length) return [];

    // Create a map of date to target close
    const targetMap = new Map(targetData.rows.map((r: OHLCVRow) => [r.date, r.close]));

    const chartData = [];
    let baseStart = 0;
    let targetStart = 0;

    for (const r of baseData.rows) {
      if (targetMap.has(r.date)) {
        if (baseStart === 0) baseStart = r.close;
        if (targetStart === 0) targetStart = targetMap.get(r.date)!;

        chartData.push({
          date: r.date,
          [baseSymbol]: ((r.close - baseStart) / baseStart) * 100,
          [targetSymbol]: ((targetMap.get(r.date)! - targetStart) / targetStart) * 100
        });
      }
    }
    return chartData;
  };

  const chartData = getNormalizedChartData();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-[450px] p-5">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-50 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-sky-500" /> Compare {baseSymbol}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Compare performance, signal, and evidence against another asset.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search symbol to compare..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-50 text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-sky-500 w-full md:w-64"
          />
          {searchTerm && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl z-10 overflow-hidden">
              {searchResults.map(s => (
                <button
                  key={s.symbol}
                  onClick={() => {
                    setSearchTerm("");
                    handleCompare(s.symbol);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-900 text-sm flex items-center justify-between"
                >
                  <span className="font-bold text-zinc-50">{s.symbol}</span>
                  <span className="text-xs text-zinc-500">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Generating Comparison...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {!loading && !comparison && !targetSymbol && (
        <div className="flex items-center justify-center py-20 text-sm text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
          Search and select a symbol above to compare against {baseSymbol}.
        </div>
      )}

      {!loading && comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-sky-500/20 p-5 rounded-xl lg:col-span-2">
            <h3 className="text-[11px] font-bold text-sky-500 tracking-widest uppercase mb-3">ESSAI Intelligence Summary</h3>
            <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-sky-500 pl-3">
              {comparison.comparison_summary}
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-[11px] text-zinc-400"><strong>Assessment:</strong> {comparison.relative_assessment}</span>
              <span className="text-[9px] text-zinc-600 font-mono">MODE: {comparison._mode?.toUpperCase()}</span>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-zinc-50">{comparison.symbol_a?.symbol || baseSymbol}</h3>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded">Score: {comparison.symbol_a?.confidence_score}/100</span>
            </div>
            <div className="mb-4">
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">Signal</span>
              <span className="font-mono text-emerald-400">{comparison.symbol_a?.view}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">Key Evidence</span>
              <ul className="text-xs text-zinc-400 space-y-1">
                {comparison.symbol_a?.key_evidence?.map((e: string, i: number) => <li key={i}>• {e}</li>)}
              </ul>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-zinc-50">{comparison.symbol_b?.symbol || targetSymbol}</h3>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded">Score: {comparison.symbol_b?.confidence_score}/100</span>
            </div>
            <div className="mb-4">
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">Signal</span>
              <span className="font-mono text-emerald-400">{comparison.symbol_b?.view}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">Key Evidence</span>
              <ul className="text-xs text-zinc-400 space-y-1">
                {comparison.symbol_b?.key_evidence?.map((e: string, i: number) => <li key={i}>• {e}</li>)}
              </ul>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="border border-zinc-800 rounded-xl p-5 lg:col-span-2">
              <h3 className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-4 flex items-center justify-between">
                <span>1-Month Normalized Performance (%)</span>
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500"></span>{baseSymbol}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>{targetSymbol}</span>
                </span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#71717a", fontSize: 10 }}
                      tickFormatter={(v) => {
                        const d = new Date(v);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 10 }}
                      tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                      formatter={(v: number) => [`${v > 0 ? '+' : ''}${v.toFixed(2)}%`]}
                      labelFormatter={(l) => new Date(l).toLocaleDateString()}
                    />
                    <Line type="monotone" dataKey={baseSymbol} stroke="#0ea5e9" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey={targetSymbol} stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
