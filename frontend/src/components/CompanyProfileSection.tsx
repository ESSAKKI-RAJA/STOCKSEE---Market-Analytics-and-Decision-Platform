import { Building2, Users, Package, Briefcase, MapPin, Calendar, Loader2, TrendingUp, ChevronRight } from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

interface Props {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  onlyDescription?: boolean;
}

export default function CompanyProfileSection({ symbol, name, exchange, sector, onlyDescription }: Props) {
  const { data, loading, error } = useCompanyProfile(symbol, name, exchange, sector);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[var(--blue)] font-mono text-xs font-semibold tracking-wider animate-pulse">
        <Loader2 className="w-4 h-4 animate-spin" /> 
        LOADING PROFILE DATA...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-[var(--text-muted)] font-mono text-xs font-semibold bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.1)] rounded-lg p-3 inline-block">
        Live Profile Data Ready
      </div>
    );
  }

  if (onlyDescription) {
    return (
      <div className="flex flex-col gap-4">
        {data.summary && (
          <p className="text-sm text-[var(--text-1)] leading-relaxed m-0 italic border-l-2 border-[var(--blue)] pl-3">
            {data.summary}
          </p>
        )}
        <div className="flex flex-col gap-2 mt-2">
          {data.ceo && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-[var(--text-muted)] w-8">CEO</span>
              <span className="text-white font-bold">{data.ceo}</span>
            </div>
          )}
          {data.headquarters && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-[var(--text-muted)] w-8">HQ</span>
              <span className="text-white font-bold">{data.headquarters}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const factPills = [
    data.ceo && { label: "CEO", value: data.ceo },
    data.headquarters && { label: "HQ", value: data.headquarters },
    data.founded && { label: "FOUNDED", value: data.founded },
    data.employees && { label: "EMPLOYEES", value: data.employees },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col gap-6">
      {/* Overview */}
      <div className="t-panel p-0 overflow-hidden shadow-lg border-[rgba(59,130,246,0.2)]">
        <div className="px-5 py-4 border-b border-[var(--border-1)] bg-[var(--surface-1)] flex justify-between items-center">
          <span className="font-semibold text-white tracking-wide flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-[var(--blue)]" />
            </div>
            Company Overview
          </span>
          <span className="text-[9px] text-[var(--text-muted)] font-mono tracking-widest uppercase">
            SRC: {data.source === "curated" ? "MANUAL" : data.source === "ai" ? "AI_GEN" : "LIMITED"}
          </span>
        </div>
        <div className="p-5">
          {data.summary && (
            <p className="text-sm text-[var(--text-1)] leading-relaxed mb-6 italic border-l-2 border-[var(--blue)] pl-3">
              {data.summary}
            </p>
          )}
          {factPills.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-[var(--border-1)] rounded-lg overflow-hidden">
                <tbody className="divide-y divide-[var(--border-1)]">
                  {factPills.map((p) => (
                    <tr key={p.label} className="hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                      <td className="py-2.5 px-4 text-xs font-mono text-[var(--text-muted)] font-semibold tracking-wider bg-[rgba(59,130,246,0.02)] w-1/3 border-r border-[var(--border-1)]">
                        {p.label}
                      </td>
                      <td className="py-2.5 px-4 text-sm text-white font-medium">
                        {p.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Leadership */}
      {data.executives && data.executives.length > 0 && (
        <div className="t-panel p-0 overflow-hidden shadow-lg border-[rgba(59,130,246,0.2)]">
          <div className="px-5 py-4 border-b border-[var(--border-1)] bg-[var(--surface-1)] flex justify-between items-center">
            <span className="font-semibold text-white tracking-wide flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[var(--blue)]" />
              </div>
              Leadership
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(59,130,246,0.02)] border-b border-[var(--border-1)] text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                  <th className="py-3 px-5 font-medium">Name</th>
                  <th className="py-3 px-5 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-1)]">
                {data.executives.map((e) => (
                  <tr key={e.name} className="hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                    <td className="py-3 px-5 text-sm text-white font-bold">{e.name}</td>
                    <td className="py-3 px-5 text-sm text-[var(--text-1)]">{e.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products & Revenue */}
      {(data.segments?.length > 0 || data.revenue_drivers?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.segments?.length > 0 && (
            <div className="t-panel p-0 overflow-hidden shadow-lg border-[rgba(59,130,246,0.2)]">
              <div className="px-5 py-4 border-b border-[var(--border-1)] bg-[var(--surface-1)]">
                <span className="font-semibold text-white tracking-wide flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                    <Package className="w-3.5 h-3.5 text-[var(--blue)]" />
                  </div>
                  Business Segments
                </span>
              </div>
              <ul className="m-0 p-5 list-none flex flex-col gap-3">
                {data.segments.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-[var(--text-1)]">
                    <ChevronRight className="w-4 h-4 text-[var(--blue)] flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.revenue_drivers?.length > 0 && (
            <div className="t-panel p-0 overflow-hidden shadow-lg border-[rgba(16,185,129,0.2)]">
              <div className="px-5 py-4 border-b border-[var(--border-1)] bg-[var(--surface-1)]">
                <span className="font-semibold text-white tracking-wide flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--green)]" />
                  </div>
                  Revenue Drivers
                </span>
              </div>
              <ul className="m-0 p-5 list-none flex flex-col gap-3">
                {data.revenue_drivers.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-[var(--text-1)]">
                    <ChevronRight className="w-4 h-4 text-[var(--green)] flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
