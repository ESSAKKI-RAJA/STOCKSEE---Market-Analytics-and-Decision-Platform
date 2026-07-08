export interface HeatmapBlock {
  name: string;
  change: number;
  size: number;
  metrics: {
    pe: string;
    marketCap: string;
    volume: string;
    flow: string;
    trend1M: string;
  };
  winners: string[];
  losers: string[];
  news: string[];
  insight: string;
}

export const HEATMAP_DATA: Record<string, HeatmapBlock[]> = {
  "Indian Markets": [
    { name: "Banking", change: 1.27, size: 140, metrics: { pe: "18.6x", marketCap: "₹42.8T", volume: "₹18,420 Cr", flow: "+₹1450 Cr", trend1M: "+6.4%" }, winners: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"], losers: ["Bandhan Bank", "IDFC First Bank"], news: ["RBI optimism boosts lenders", "Credit growth improves", "PSU banks outperform"], insight: "Banking sector gaining strength from credit growth and institutional inflows." },
    { name: "IT", change: 0.85, size: 120, metrics: { pe: "26.4x", marketCap: "₹35.2T", volume: "₹12,150 Cr", flow: "+₹850 Cr", trend1M: "+3.2%" }, winners: ["TCS", "Infosys"], losers: ["Wipro", "Tech Mahindra"], news: ["Deal wins remain steady", "Margin expansion expected"], insight: "IT sector showing resilience with stable deal pipelines." },
    { name: "Pharma", change: -0.4, size: 90, metrics: { pe: "32.1x", marketCap: "₹15.4T", volume: "₹6,420 Cr", flow: "-₹210 Cr", trend1M: "-1.5%" }, winners: ["Sun Pharma", "Cipla"], losers: ["Dr. Reddy's", "Lupin"], news: ["FDA observations weigh on sentiment", "Domestic sales strong"], insight: "Pharma faces short-term headwinds from regulatory scrutiny." },
    { name: "Auto", change: 1.8, size: 110, metrics: { pe: "22.5x", marketCap: "₹20.1T", volume: "₹9,840 Cr", flow: "+₹620 Cr", trend1M: "+4.8%" }, winners: ["Mahindra", "Tata Motors"], losers: ["Maruti", "Hero MotoCorp"], news: ["EV sales surge", "Rural demand recovery seen"], insight: "Auto sector driven by strong SUV and EV adoption." },
    { name: "FMCG", change: -0.2, size: 80, metrics: { pe: "45.2x", marketCap: "₹18.5T", volume: "₹4,120 Cr", flow: "-₹150 Cr", trend1M: "+0.5%" }, winners: ["ITC", "Nestle"], losers: ["HUL", "Dabur"], news: ["Input cost pressures ease", "Volume growth sluggish"], insight: "FMCG remains defensive amidst mixed volume growth." },
    { name: "Energy", change: 2.1, size: 130, metrics: { pe: "12.8x", marketCap: "₹28.4T", volume: "₹15,600 Cr", flow: "+₹1100 Cr", trend1M: "+8.5%" }, winners: ["Reliance", "ONGC"], losers: ["BPCL", "IOC"], news: ["Refining margins improve", "Green energy investments rise"], insight: "Energy sector outperforming on strong refining margins." },
    { name: "Metals", change: -1.2, size: 85, metrics: { pe: "10.5x", marketCap: "₹12.8T", volume: "₹8,450 Cr", flow: "-₹450 Cr", trend1M: "-3.2%" }, winners: ["Hindalco", "Vedanta"], losers: ["Tata Steel", "JSW Steel"], news: ["Global demand concerns", "Prices cool off"], insight: "Metals sector facing pressure from global macro uncertainties." },
    { name: "Realty", change: 3.5, size: 75, metrics: { pe: "38.4x", marketCap: "₹8.2T", volume: "₹5,120 Cr", flow: "+₹850 Cr", trend1M: "+12.4%" }, winners: ["DLF", "Macrotech"], losers: ["Oberoi Realty", "Godrej Prop"], news: ["Record pre-sales", "Inventory levels drop"], insight: "Realty sector experiencing a multi-year upcycle." },
  ],
  "US Markets": [
    { name: "Technology", change: 1.82, size: 150, metrics: { pe: "28.4x", marketCap: "$12.4T", volume: "$45B", flow: "+$2.1B", trend1M: "+5.2%" }, winners: ["Apple", "Microsoft", "Nvidia"], losers: ["Intel", "Cisco"], news: ["AI Momentum High", "Cloud growth accelerates"], insight: "Tech sector continues to lead driven by AI investments." },
    { name: "Financials", change: 0.5, size: 120, metrics: { pe: "14.2x", marketCap: "$8.5T", volume: "$25B", flow: "+$850M", trend1M: "+2.1%" }, winners: ["JPMorgan", "Visa"], losers: ["Wells Fargo", "Citigroup"], news: ["Net interest margins peak", "Investment banking recovers"], insight: "Financials stable with improving capital markets activity." },
    { name: "Healthcare", change: -0.8, size: 110, metrics: { pe: "18.5x", marketCap: "$7.2T", volume: "$18B", flow: "-$420M", trend1M: "-1.2%" }, winners: ["Eli Lilly", "UnitedHealth"], losers: ["Pfizer", "Johnson & Johnson"], news: ["GLP-1 drug sales boom", "Regulatory risks linger"], insight: "Healthcare mixed, driven by specific drug successes." },
    { name: "Consumer", change: 1.2, size: 100, metrics: { pe: "22.8x", marketCap: "$6.8T", volume: "$22B", flow: "+$550M", trend1M: "+3.5%" }, winners: ["Amazon", "Home Depot"], losers: ["Nike", "McDonald's"], news: ["Retail sales resilient", "E-commerce gains share"], insight: "Consumer sector holding up despite inflation concerns." },
    { name: "Energy", change: 2.5, size: 90, metrics: { pe: "11.5x", marketCap: "$5.4T", volume: "$15B", flow: "+$1.2B", trend1M: "+7.8%" }, winners: ["ExxonMobil", "Chevron"], losers: ["Schlumberger", "Occidental"], news: ["Oil prices rebound", "Production cuts extended"], insight: "Energy sector boosted by supply constraints." },
  ],
  "Global Markets": [
    { name: "North America", change: 1.4, size: 140, metrics: { pe: "22.4x", marketCap: "$45.2T", volume: "$120B", flow: "+$5.2B", trend1M: "+4.5%" }, winners: ["S&P 500", "Nasdaq"], losers: ["TSX", "Mexico IPC"], news: ["Fed pivot hopes", "Earnings beat estimates"], insight: "North America leads global equities on tech strength." },
    { name: "Europe", change: -0.42, size: 120, metrics: { pe: "16.8x", marketCap: "$18.4T", volume: "$45B", flow: "+$1.4B", trend1M: "+2.1%" }, winners: ["Germany (DAX)", "Spain (IBEX)"], losers: ["Italy (MIB)", "France (CAC)"], news: ["ECB cut hopes rise", "German rebound", "Energy cools"], insight: "Europe mixed as lower inflation supports equities." },
    { name: "Asia", change: 0.8, size: 130, metrics: { pe: "14.5x", marketCap: "$22.5T", volume: "$85B", flow: "+$2.8B", trend1M: "+3.2%" }, winners: ["Nifty 50", "Nikkei"], losers: ["Hang Seng", "Shanghai"], news: ["BOJ holds rates", "China stimulus expected"], insight: "Asia supported by strong performance in Japan and India." },
    { name: "Middle East", change: 1.5, size: 80, metrics: { pe: "12.2x", marketCap: "$4.5T", volume: "$12B", flow: "+$450M", trend1M: "+5.8%" }, winners: ["TADAWUL", "DFM"], losers: ["EGX", "TA-35"], news: ["Oil revenues strong", "Diversification pays off"], insight: "Middle East markets benefit from stable energy prices." },
  ],
  "Crypto Market": [
    { name: "BTC Ecosystem", change: 4.2, size: 150, metrics: { pe: "N/A", marketCap: "$1.3T", volume: "$45B", flow: "+$1.2B", trend1M: "+12.5%" }, winners: ["BTC", "STX", "ORDI"], losers: ["BCH", "BSV"], news: ["ETF inflows surge", "Halving narrative builds"], insight: "BTC ecosystem dominates on institutional adoption." },
    { name: "ETH Ecosystem", change: 2.8, size: 130, metrics: { pe: "N/A", marketCap: "$412B", volume: "$48B", flow: "+$850M", trend1M: "+9.1%" }, winners: ["ETH", "ARB", "OP", "LDO"], losers: ["ETC", "MNT"], news: ["Staking inflows rise", "Layer2 TVL climbs"], insight: "ETH ecosystem outperforming due to staking demand." },
    { name: "Solana Ecosystem", change: 8.5, size: 110, metrics: { pe: "N/A", marketCap: "$65B", volume: "$12B", flow: "+$450M", trend1M: "+25.4%" }, winners: ["SOL", "JUP", "WIF"], losers: ["RAY", "BONK"], news: ["Network activity booms", "Meme coin frenzy"], insight: "Solana sees massive growth in DEX volume and active users." },
    { name: "DeFi", change: 1.5, size: 90, metrics: { pe: "N/A", marketCap: "$85B", volume: "$8B", flow: "+$120M", trend1M: "+4.2%" }, winners: ["UNI", "AAVE", "MKR"], losers: ["CRV", "COMP"], news: ["Yields compress", "Regulatory clarity sought"], insight: "DeFi steady, waiting for broader market catalysts." },
    { name: "AI Tokens", change: 12.4, size: 100, metrics: { pe: "N/A", marketCap: "$25B", volume: "$6B", flow: "+$850M", trend1M: "+45.2%" }, winners: ["RNDR", "TAO", "FET"], losers: ["AGIX", "OCEAN"], news: ["AI narrative dominates", "New integrations announced"], insight: "AI tokens seeing parabolic growth amidst broader AI boom." },
  ],
};
