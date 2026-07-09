import { useMemo, useState } from "react";
import { heatmapBySector, type Region } from "@/data/heatmapData";
import { useStockPrices } from "@/hooks/useStockPrices";

const regionLabels: { key: Region; label: string; flag: string }[] = [
  { key: "IND", label: "IND Market", flag: "🇮🇳" },
  { key: "US", label: "US Market", flag: "🇺🇸" },
  { key: "GLOBAL", label: "Global", flag: "🌍" },
];

export default function SectorHeatmap() {
  const [region, setRegion] = useState<Region>("IND");
  const { stocks } = useStockPrices();

  const sectors = useMemo(() => {
    const sectorList = heatmapBySector[region];
    const stockMap = new Map(stocks.map((s) => [s.symbol, s]));
    return sectorList.map((sec) => {
      const matched = sec.symbols.map((sym) => stockMap.get(sym)).filter(Boolean) as typeof stocks;
      const change =
        matched.length > 0
          ? matched.reduce((sum, s) => sum + s.changePercent, 0) / matched.length
          : 0;
      const weight = matched.length;
      return { sector: sec.sector, change: Number(change.toFixed(2)), weight };
    });
  }, [region, stocks]);

  return (
    <div className="card-pro">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-semibold text-[hsl(var(--text-primary))]">Sector Heatmap</h2>
        <div className="flex gap-1 rounded-lg bg-[hsl(var(--surface-1))] border border-[hsl(var(--border))] p-1">
          {regionLabels.map((r) => (
            <button
              key={r.key}
              onClick={() => setRegion(r.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                region === r.key
                  ? "bg-[hsl(var(--accent))] text-white"
                  : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
              }`}
            >
              <span className="mr-1">{r.flag}</span>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {sectors.map((s) => {
          const intensity = Math.min(Math.abs(s.change) / 3, 1);
          const bg =
            s.change >= 0
              ? `hsla(142, 71%, 45%, ${0.05 + intensity * 0.25})`
              : `hsla(0, 84%, 60%, ${0.05 + intensity * 0.25})`;
          const border =
            s.change >= 0
              ? `hsla(142, 71%, 45%, 0.15)`
              : `hsla(0, 84%, 60%, 0.15)`;
          return (
            <div
              key={s.sector}
              className="rounded-lg p-3 text-center border transition-all hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: bg, borderColor: border, minHeight: `${60 + s.weight * 2}px` }}
            >
              <p className="text-[11px] font-medium text-[hsl(var(--text-primary))]">{s.sector}</p>
              <p
                className={`text-sm font-mono font-bold ${
                  s.change >= 0 ? "text-[hsl(var(--positive))]" : "text-[hsl(var(--negative))]"
                }`}
              >
                {s.change >= 0 ? "+" : ""}
                {s.change}%
              </p>
              <p className="text-[9px] text-[hsl(var(--text-muted))] mt-0.5 uppercase tracking-wider">{s.weight} stocks</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
