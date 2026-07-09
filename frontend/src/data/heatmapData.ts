// Curated sector lists per region. Live prices are overlaid from the orchestrator.
// Used by SectorHeatmap to compute aggregate sector performance per region.

export type Region = "IND" | "US" | "GLOBAL";

export interface HeatmapSector {
  sector: string;
  symbols: string[]; // matched against allStocks for live overlay
}

export const heatmapBySector: Record<Region, HeatmapSector[]> = {
  IND: [
    { sector: "Technology", symbols: ["TCS", "INFY", "WIPRO", "HCLTECH", "TECHM", "LTIM"] },
    { sector: "Financial", symbols: ["HDFCBANK", "ICICIBANK", "SBIN", "AXISBANK", "KOTAKBANK", "BAJFINANCE"] },
    { sector: "Energy", symbols: ["RELIANCE", "ONGC", "COALINDIA", "GAIL", "BPCL", "IOC"] },
    { sector: "Automotive", symbols: ["TATAMOTORS", "MARUTI", "M&M", "EICHERMOT", "BAJAJ-AUTO", "HEROMOTOCO"] },
    { sector: "Healthcare", symbols: ["SUNPHARMA", "DRREDDY", "DIVISLAB"] },
    { sector: "Consumer", symbols: ["ITC", "HINDUNILVR", "ASIANPAINT", "TITAN", "NESTLEIND", "BRITANNIA", "DABUR"] },
    { sector: "Industrial", symbols: ["LT", "ADANIENT", "ADANIPORTS"] },
    { sector: "Defence", symbols: ["HAL", "BEL", "BDL", "COCHINSHIP", "MAZAGON", "GRSE", "SOLARINDS"] },
    { sector: "Materials", symbols: ["TATASTEEL", "JSWSTEEL", "ULTRACEMCO"] },
    { sector: "Utilities", symbols: ["POWERGRID", "NTPC", "TATAPOWER", "ADANIGREEN"] },
    { sector: "Telecom", symbols: ["BHARTIARTL"] },
  ],
  US: [
    { sector: "Technology", symbols: ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "AMD", "ORCL", "CRM", "ADBE"] },
    { sector: "Consumer", symbols: ["AMZN", "TSLA", "NKE", "MCD", "SBUX", "DIS", "HD", "WMT"] },
    { sector: "Financial", symbols: ["JPM", "BAC", "GS", "MS", "V", "MA", "WFC"] },
    { sector: "Healthcare", symbols: ["JNJ", "PFE", "UNH", "LLY", "ABBV", "MRK"] },
    { sector: "Energy", symbols: ["XOM", "CVX", "COP"] },
    { sector: "Industrial", symbols: ["BA", "CAT", "GE", "HON"] },
    { sector: "Communication", symbols: ["NFLX", "T", "VZ"] },
    { sector: "Semiconductor", symbols: ["INTC", "TSM", "AVGO", "QCOM"] },
  ],
  GLOBAL: [
    { sector: "US Tech", symbols: ["AAPL", "MSFT", "GOOGL", "NVDA", "META"] },
    { sector: "India Tech", symbols: ["TCS", "INFY", "WIPRO"] },
    { sector: "US Finance", symbols: ["JPM", "BAC", "V"] },
    { sector: "India Finance", symbols: ["HDFCBANK", "ICICIBANK", "SBIN"] },
    { sector: "Energy", symbols: ["XOM", "CVX", "RELIANCE", "ONGC"] },
    { sector: "Auto/EV", symbols: ["TSLA", "TATAMOTORS", "MARUTI"] },
    { sector: "Consumer", symbols: ["AMZN", "WMT", "ITC", "HINDUNILVR"] },
    { sector: "Healthcare", symbols: ["JNJ", "LLY", "SUNPHARMA"] },
    { sector: "Defence", symbols: ["BA", "HAL", "BEL"] },
    { sector: "Semiconductor", symbols: ["NVDA", "AMD", "TSM", "INTC"] },
  ],
};
