import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { cryptoData, generateChartData } from "@/data/stockData";
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

const timeframes = ["1W", "1M", "6M", "1Y"] as const;
const tfDays: Record<string, number> = { "1W": 7, "1M": 30, "6M": 180, "1Y": 365 };

export default function CryptoDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const crypto = cryptoData.find((c) => c.symbol === symbol) || cryptoData[0];
  const [tf, setTf] = useState("1M");
  const chartData = useMemo(() => generateChartData(tfDays[tf]), [tf]);
  const isUp = crypto.change >= 0;

  const glowColor = isUp ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)";
  const borderColor = isUp ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)";
  const stopColor = isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)";

  return (
    <div className="min-h-screen pt-16 bg-background relative overflow-hidden">
      
      <div className="container py-8 max-w-6xl relative z-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Markets
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground tracking-tight">{crypto.symbol}</h1>
            <p className="text-muted-foreground text-lg">{crypto.name}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl font-bold text-foreground drop-shadow-md">
              ${crypto.price.toLocaleString()}
            </p>
            <span className={`inline-flex items-center gap-1 px-3 py-1 mt-2 rounded-full text-sm font-medium border shadow-[0_0_10px_${glowColor}] ${isUp ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
              {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isUp ? "+" : ""}${Math.abs(crypto.change).toLocaleString()} ({isUp ? "+" : ""}{crypto.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-container p-6 mb-6 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group bg-[hsl(var(--card))]"
          style={{ 
            boxShadow: `0 8px 32px 0 ${glowColor}`,
            borderColor: borderColor
          }}
        >
          {/* Subtle gradient overlay behind chart */}
          <div 
            className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${stopColor} 100%)`
            }}
          />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" /> Price History
            </h2>
            <div className="flex gap-1 p-1 rounded-lg bg-black/10 dark:bg-white/5 backdrop-blur-sm">
              {timeframes.map((t) => (
                <button 
                  key={t} 
                  onClick={() => setTf(t)} 
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${tf === t ? "bg-[hsl(var(--accent))] text-white shadow-md" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[400px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cryptoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={stopColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={stopColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                  interval="preserveStartEnd" 
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                  domain={["auto", "auto"]} 
                  orientation="right"
                  dx={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(15, 23, 42, 0.8)", 
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: "12px", 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    fontSize: 12, 
                    color: "hsl(210,20%,92%)" 
                  }} 
                  itemStyle={{ color: "hsl(210,20%,92%)", fontWeight: "bold" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke={stopColor} 
                  fill="url(#cryptoGrad)" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: stopColor, stroke: "rgba(255,255,255,0.8)", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 card-pro"
          >
            <h2 className="font-heading font-semibold text-foreground mb-4">Volume Analysis</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-30)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <Tooltip 
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{ 
                      background: "rgba(15, 23, 42, 0.8)", 
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: "8px" 
                    }} 
                  />
                  <Bar dataKey="volume" fill="hsl(var(--accent))" opacity={0.6} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {[
              { label: "Market Cap", value: crypto.marketCap, icon: "💎" },
              { label: "24h Volume", value: crypto.volume, icon: "📊" },
              { label: "24h Change", value: `${isUp ? "+" : ""}${crypto.changePercent.toFixed(2)}%`, icon: "📈", isColor: true },
              { label: "Trend", value: isUp ? "Bullish" : "Bearish", icon: "🧭", isColor: true }
            ].map((s, i) => (
              <div key={s.label} className="card-pro flex items-center gap-4 hover:bg-white/5 transition-colors cursor-default">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{s.label}</p>
                  <p className={`font-mono font-bold text-lg ${s.isColor ? (isUp ? "text-green-400" : "text-red-400") : "text-foreground"}`}>
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
