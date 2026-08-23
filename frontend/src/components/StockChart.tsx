import { useEffect, useState } from "react";
import {
  ResponsiveContainer, ComposedChart, AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from "recharts";
import { TrendingUp, BarChart2, Activity, Loader2, Database, AlertTriangle } from "lucide-react";
import { useStockHistory, type OHLCVRow } from "@/hooks/useStockHistory";

const PERIODS = ["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y", "MAX"] as const;
type Period = typeof PERIODS[number];

const PERIOD_MAP: Record<Period, string> = {
  "1D": "1d",
  "1W": "1wk",
  "1M": "1mo",
  "3M": "3mo",
  "6M": "6mo",
  "1Y": "1y",
  "3Y": "3y",
  "5Y": "5y",
  "MAX": "max",
};

type Indicator = "volume" | "rsi" | "macd";

function computeRSI(rows: OHLCVRow[], period = 14): number[] {
  const rsi: number[] = new Array(rows.length).fill(null);
  if (rows.length < period + 1) return rsi;

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i <= period; i++) {
    const diff = rows[i].close - rows[i - 1].close;
    gains.push(Math.max(diff, 0));
    losses.push(Math.max(-diff, 0));
  }

  let avgGain = gains.reduce((a, b) => a + b) / period;
  let avgLoss = losses.reduce((a, b) => a + b) / period;

  for (let i = period; i < rows.length; i++) {
    if (i > period) {
      const diff = rows[i].close - rows[i - 1].close;
      avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi[i] = parseFloat((100 - 100 / (1 + rs)).toFixed(2));
  }

  return rsi;
}

function computeEMA(rows: OHLCVRow[], period: number): number[] {
  const ema: number[] = new Array(rows.length).fill(null);
  if (rows.length < period) return ema;

  const k = 2 / (period + 1);
  ema[period - 1] = rows.slice(0, period).reduce((s, r) => s + r.close, 0) / period;

  for (let i = period; i < rows.length; i++) {
    ema[i] = parseFloat((rows[i].close * k + ema[i - 1] * (1 - k)).toFixed(2));
  }

  return ema;
}

function computeMACD(rows: OHLCVRow[]) {
  const ema12 = computeEMA(rows, 12);
  const ema26 = computeEMA(rows, 26);
  const macdLine = rows.map((_, i) =>
    ema12[i] != null && ema26[i] != null ? parseFloat((ema12[i] - ema26[i]).toFixed(2)) : null
  );

  // Signal line: 9 EMA of MACD
  const validMacd = macdLine.filter((v) => v != null) as number[];
  if (validMacd.length < 9) return { macdLine, signalLine: new Array(rows.length).fill(null), histogram: new Array(rows.length).fill(null) };

  const signal: (number | null)[] = new Array(rows.length).fill(null);
  let firstValid = macdLine.findIndex((v) => v != null);
  let sigStart = firstValid + 8;

  if (sigStart < rows.length) {
    signal[sigStart] = macdLine.slice(firstValid, sigStart + 1).reduce((a, b) => a! + b!, 0)! / 9;
    const k = 2 / 10;
    for (let i = sigStart + 1; i < rows.length; i++) {
      if (macdLine[i] != null && signal[i - 1] != null) {
        signal[i] = parseFloat((macdLine[i]! * k + signal[i - 1]! * (1 - k)).toFixed(2));
      }
    }
  }

  const histogram = rows.map((_, i) =>
    macdLine[i] != null && signal[i] != null
      ? parseFloat((macdLine[i]! - signal[i]!).toFixed(2))
      : null
  );

  return { macdLine, signalLine: signal, histogram };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl text-xs font-mono">
      <div className="text-zinc-400 mb-2 font-bold">{label}</div>
      {d.close != null && <div className="text-zinc-100">Close: <span className="text-sky-400">{d.close?.toLocaleString()}</span></div>}
      {d.open != null && <div className="text-zinc-400">Open: {d.open?.toLocaleString()}</div>}
      {d.high != null && <div className="text-emerald-400">High: {d.high?.toLocaleString()}</div>}
      {d.low != null && <div className="text-rose-400">Low: {d.low?.toLocaleString()}</div>}
      {d.volume != null && <div className="text-zinc-500">Vol: {(d.volume / 1_000_000).toFixed(1)}M</div>}
    </div>
  );
};

const RSITooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-xl text-xs font-mono">
      <div className="text-zinc-400">{label}</div>
      <div className="text-amber-400">RSI: {payload[0]?.value?.toFixed(1)}</div>
    </div>
  );
};

interface StockChartProps {
  symbol: string;
  exchange?: string;
}

export default function StockChart({ symbol, exchange }: StockChartProps) {
  const { data, loading, error, fetchHistory } = useStockHistory();
  const [period, setPeriod] = useState<Period>("1M");
  const [activeIndicators, setActiveIndicators] = useState<Set<Indicator>>(new Set());

  useEffect(() => {
    fetchHistory(symbol, PERIOD_MAP[period]);
  }, [symbol, period, fetchHistory]);

  const toggleIndicator = (ind: Indicator) => {
    setActiveIndicators((prev) => {
      const next = new Set(prev);
      if (next.has(ind)) next.delete(ind);
      else next.add(ind);
      return next;
    });
  };

  // Build chart rows with computed indicators
  const chartRows = (() => {
    if (!data?.rows?.length) return [];
    const rows = data.rows;
    const rsiVals = computeRSI(rows);
    const { macdLine, signalLine, histogram } = computeMACD(rows);

    return rows.map((r, i) => ({
      ...r,
      rsi: rsiVals[i],
      macd: macdLine[i],
      macdSignal: signalLine[i],
      macdHist: histogram[i],
    }));
  })();

  const isUp = chartRows.length >= 2
    ? chartRows[chartRows.length - 1].close >= chartRows[0].close
    : true;

  const priceColor = isUp ? "#10b981" : "#f43f5e";

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <PeriodBar period={period} setPeriod={setPeriod} activeIndicators={activeIndicators} toggleIndicator={toggleIndicator} loading />
        <div className="flex-1 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
          <span className="text-xs text-zinc-500">Loading chart data…</span>
        </div>
      </div>
    );
  }

  if (error || !chartRows.length) {
    return (
      <div className="flex flex-col h-full">
        <PeriodBar period={period} setPeriod={setPeriod} activeIndicators={activeIndicators} toggleIndicator={toggleIndicator} />
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span className="text-xs text-zinc-500 text-center">
            {error || "No chart data available for this period."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Controls */}
      <PeriodBar period={period} setPeriod={setPeriod} activeIndicators={activeIndicators} toggleIndicator={toggleIndicator} />

      {/* Data source badge */}
      {data && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800/50">
          <Database className="w-3 h-3 text-zinc-600" />
          <span className="text-[10px] text-zinc-600 font-mono">
            {data.source?.toUpperCase()} · {data.data_points} points ·{" "}
            <span className={data.mode === "real" ? "text-emerald-500" : data.mode === "demo" ? "text-amber-500" : "text-zinc-500"}>
              {data.mode?.toUpperCase()} DATA
            </span>
          </span>
        </div>
      )}

      {/* Price chart */}
      <div className="h-64 px-2 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartRows} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={priceColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={priceColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              tickFormatter={(v) => {
                const d = new Date(v);
                return period === "1D" ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#6b7280", fontSize: 9, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              width={55}
              tickFormatter={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke={priceColor}
              strokeWidth={1.5}
              fill="url(#priceGrad)"
              dot={false}
              activeDot={{ r: 3, fill: priceColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume panel */}
      {activeIndicators.has("volume") && (
        <div className="h-20 px-2 border-t border-zinc-800/50 pt-2">
          <div className="text-[9px] text-zinc-600 font-mono pl-2 mb-1">VOLUME</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRows} margin={{ top: 0, right: 8, left: -10, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs font-mono">
                      <div className="text-zinc-400">{label}</div>
                      <div className="text-zinc-300">Vol: {((payload[0]?.value as number) / 1_000_000).toFixed(1)}M</div>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="volume" fill="#3b82f6" opacity={0.6} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* RSI panel */}
      {activeIndicators.has("rsi") && (
        <div className="h-24 px-2 border-t border-zinc-800/50 pt-2">
          <div className="text-[9px] text-zinc-600 font-mono pl-2 mb-1">RSI (14)</div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartRows} margin={{ top: 0, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<RSITooltip />} />
              <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Line type="monotone" dataKey="rsi" stroke="#f59e0b" strokeWidth={1.5} dot={false} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MACD panel */}
      {activeIndicators.has("macd") && (
        <div className="h-24 px-2 border-t border-zinc-800/50 pt-2">
          <div className="text-[9px] text-zinc-600 font-mono pl-2 mb-1">MACD (12,26,9)</div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartRows} margin={{ top: 0, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis tick={{ fill: "#6b7280", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs font-mono">
                      <div className="text-zinc-400">{label}</div>
                      {payload.map((p: any) => (
                        <div key={p.name} style={{ color: p.color }}>
                          {p.name}: {p.value?.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="macdHist" fill="#6b7280" opacity={0.7} radius={[1, 1, 0, 0]} name="Histogram" />
              <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="MACD" connectNulls />
              <Line type="monotone" dataKey="macdSignal" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Signal" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function PeriodBar({
  period, setPeriod, activeIndicators, toggleIndicator, loading
}: {
  period: Period;
  setPeriod: (p: Period) => void;
  activeIndicators: Set<Indicator>;
  toggleIndicator: (i: Indicator) => void;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
      {/* Period buttons */}
      <div className="flex gap-0.5">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono transition-all ${
              period === p
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "text-zinc-600 hover:text-zinc-300 border border-transparent"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Indicator toggles */}
      <div className="flex gap-1.5 items-center">
        {loading && <Loader2 className="w-3 h-3 text-zinc-600 animate-spin" />}
        {(["volume", "rsi", "macd"] as Indicator[]).map((ind) => (
          <button
            key={ind}
            onClick={() => toggleIndicator(ind)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all border ${
              activeIndicators.has(ind)
                ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                : "text-zinc-600 border-zinc-800 hover:text-zinc-400"
            }`}
          >
            {ind.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
