export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  impact: "bullish" | "bearish" | "neutral";
  time: string;
  source: string;
  category: "Indian" | "US" | "Global";
  tag: string;
  url: string;
}

export const newsData: NewsItem[] = [
  // Indian Markets
  { id: "in1", headline: "NIFTY 50 hits record high as foreign inflows surge", summary: "Indian benchmark indices reached new all-time highs today, driven by strong buying from foreign institutional investors in banking and IT.", impact: "bullish", time: "2 hours ago", source: "Bloomberg", category: "Indian", tag: "Markets", url: "#" },
  { id: "in2", headline: "RBI holds repo rate steady at 6.5%", summary: "The Monetary Policy Committee maintained the status quo on interest rates, citing concerns over food inflation while growth remains robust.", impact: "neutral", time: "5 hours ago", source: "Mint", category: "Indian", tag: "Macro", url: "#" },
  { id: "in3", headline: "IT sector rebounds on strong guidance", summary: "Top Indian IT firms provided robust guidance for the upcoming quarters, sending sectoral indices up 2.5% led by TCS and Infosys.", impact: "bullish", time: "6 hours ago", source: "Economic Times", category: "Indian", tag: "Tech", url: "#" },
  { id: "in4", headline: "Auto sales show signs of rural slowdown", summary: "Major automakers reported a slight dip in two-wheeler sales, raising concerns about rural demand recovery in the near term.", impact: "bearish", time: "12 hours ago", source: "Reuters", category: "Indian", tag: "Earnings", url: "#" },
  { id: "in5", headline: "Banking stocks lead market rally", summary: "Public and private sector banks saw heavy buying after positive remarks from the finance ministry on asset quality.", impact: "bullish", time: "18 hours ago", source: "CNBC", category: "Indian", tag: "Markets", url: "#" },

  // US Markets
  { id: "us1", headline: "Tech giants report strong Q3 earnings", summary: "Major US technology companies exceeded Wall Street expectations, boosting the broader market despite valuation concerns.", impact: "bullish", time: "1 hour ago", source: "MarketWatch", category: "US", tag: "Earnings", url: "#" },
  { id: "us2", headline: "Federal Reserve hints at potential rate cut", summary: "Fed officials suggested that cooling inflation data might allow for a slight reduction in interest rates later this year.", impact: "bullish", time: "3 hours ago", source: "Bloomberg", category: "US", tag: "Macro", url: "#" },
  { id: "us3", headline: "Treasury yields spike after jobs data", summary: "Stronger than expected employment numbers sent 10-year Treasury yields higher, pressuring growth stocks.", impact: "bearish", time: "5 hours ago", source: "Yahoo Finance", category: "US", tag: "Markets", url: "#" },
  { id: "us4", headline: "Retail sales miss expectations", summary: "Consumer spending showed signs of fatigue in the latest retail sales report, missing consensus estimates across multiple categories.", impact: "bearish", time: "10 hours ago", source: "Reuters", category: "US", tag: "Macro", url: "#" },
  { id: "us5", headline: "S&P 500 holds key support level", summary: "The benchmark index successfully tested its 50-day moving average, drawing in technical buyers at crucial levels.", impact: "neutral", time: "14 hours ago", source: "Investing.com", category: "US", tag: "Markets", url: "#" },

  // Global Markets
  { id: "gl1", headline: "European markets stumble amidst new regulations", summary: "New tech regulations proposed by the EU have caused a sell-off in major European tech stocks.", impact: "bearish", time: "6 hours ago", source: "Reuters", category: "Global", tag: "Tech", url: "#" },
  { id: "gl2", headline: "Oil prices surge on Middle East tensions", summary: "Brent crude pushed past $85 a barrel as geopolitical concerns raised supply disruption fears in key producing regions.", impact: "bullish", time: "4 hours ago", source: "Bloomberg", category: "Global", tag: "Macro", url: "#" },
  { id: "gl3", headline: "Bank of Japan considers policy shift", summary: "Sources suggest the BOJ may adjust its yield curve control policy sooner than market participants expected.", impact: "neutral", time: "8 hours ago", source: "MarketWatch", category: "Global", tag: "Macro", url: "#" },
  { id: "gl4", headline: "China announces new stimulus measures", summary: "Beijing unveiled a fresh package of liquidity injections to support the ailing property sector and boost consumption.", impact: "bullish", time: "11 hours ago", source: "CNBC", category: "Global", tag: "Markets", url: "#" },
  { id: "gl5", headline: "Global supply chain pressures ease", summary: "Freight rates and shipping delays have returned to pre-pandemic normal levels, easing inflation fears globally.", impact: "bullish", time: "20 hours ago", source: "Economic Times", category: "Global", tag: "Macro", url: "#" }
];
