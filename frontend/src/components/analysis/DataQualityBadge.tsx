interface DataQualityBadgeProps {
  source?: string;
  delay_label?: string;
}

export default function DataQualityBadge({ source, delay_label }: DataQualityBadgeProps) {
  if (!delay_label) return null;

  const isLive = delay_label.includes("LIVE");
  const isDemo = source === "demo";

  if (isDemo) {
    return (
      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-amber-500/20 text-amber-500 bg-amber-500/10 font-mono">
        DEMO / FALLBACK
      </span>
    );
  }

  return (
    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border font-mono ${
      isLive
        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
        : "text-amber-500 bg-amber-500/10 border-amber-500/20"
    }`}>
      {delay_label} {source && `(${source})`}
    </span>
  );
}
