import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const stocks = [
  { symbol: "AAPL", price: "189.43", change: "+1.2%", up: true },
  { symbol: "TSLA", price: "234.10", change: "-0.8%", up: false },
  { symbol: "TCS", price: "3,842.00", change: "+0.5%", up: true },
  { symbol: "NVDA", price: "721.33", change: "+2.4%", up: true },
];

export default function HeroVisuals() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 blur-[100px] rounded-full" />
      <div className="absolute top-1/4 right-1/4 w-[150px] h-[150px] bg-positive/10 blur-[80px] rounded-full" />
      
      {/* Floating Stock Cards */}
      {stocks.map((stock, i) => (
        <motion.div
          key={stock.symbol}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))/40] backdrop-blur-md shadow-2xl w-44"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + (i % 2) * 50}%`,
            zIndex: stocks.length - i
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-[hsl(var(--text-primary))]">{stock.symbol}</span>
            <span className={`text-[10px] font-mono ${stock.up ? "text-[hsl(var(--positive))]" : "text-[hsl(var(--negative))]"}`}>
              {stock.change}
            </span>
          </div>
          <div className="text-sm font-mono text-[hsl(var(--text-secondary))]">${stock.price}</div>
          
          {/* Mini Sparkline Placeholder */}
          <div className="mt-2 h-6 w-full flex items-end gap-0.5">
            {[...Array(10)].map((_, j) => (
              <motion.div
                key={j}
                animate={{ height: `${20 + Math.random() * 80}%` }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: j * 0.1 }}
                className={`flex-1 rounded-t-sm ${stock.up ? "bg-[hsl(var(--positive))]" : "bg-[hsl(var(--negative))]"}`}
                style={{ opacity: 0.4 + (j / 10) * 0.6 }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Candlestick Pattern (Subtle Background) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-around px-10">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-0.5 h-10 bg-[hsl(var(--text-primary))]" />
            <div className="w-3 h-16 bg-[hsl(var(--text-primary))] rounded-sm" />
            <div className="w-0.5 h-8 bg-[hsl(var(--text-primary))]" />
          </div>
        ))}
      </div>
    </div>
  );
}
