export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  country: string;
  flag: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
  pe?: number;
  high52w?: number;
  low52w?: number;
}

export const allStocks: Stock[] = [
  // ============================================================
  // 🇮🇳 NSE/BSE — NIFTY 50 + NIFTY Next 50 + Defence + IT + More
  // ============================================================
  { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2847.65, change: 45.30, changePercent: 1.62, volume: "12.4M", marketCap: "₹19.3T", sector: "Energy", pe: 28.5, high52w: 3025, low52w: 2220 },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", country: "India", flag: "🇮🇳", price: 3892.40, change: -23.15, changePercent: -0.59, volume: "4.2M", marketCap: "₹14.1T", sector: "Technology", pe: 32.1, high52w: 4250, low52w: 3060 },
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1567.80, change: 12.45, changePercent: 0.80, volume: "8.7M", marketCap: "₹6.5T", sector: "Technology", pe: 27.3, high52w: 1690, low52w: 1210 },
  { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1685.25, change: -8.90, changePercent: -0.53, volume: "6.1M", marketCap: "₹12.8T", sector: "Financial", pe: 19.8, high52w: 1795, low52w: 1420 },
  { symbol: "ICICIBANK", name: "ICICI Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1125.30, change: 15.20, changePercent: 1.37, volume: "10.2M", marketCap: "₹7.9T", sector: "Financial", pe: 18.2, high52w: 1180, low52w: 890 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1842.60, change: -12.30, changePercent: -0.66, volume: "3.8M", marketCap: "₹3.7T", sector: "Financial", pe: 25.1, high52w: 1950, low52w: 1540 },
  { symbol: "SBIN", name: "State Bank of India", exchange: "NSE", country: "India", flag: "🇮🇳", price: 812.45, change: 8.75, changePercent: 1.09, volume: "15.6M", marketCap: "₹7.3T", sector: "Financial", pe: 11.2, high52w: 875, low52w: 600 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1645.80, change: 22.40, changePercent: 1.38, volume: "5.4M", marketCap: "₹9.8T", sector: "Telecom", pe: 78.5, high52w: 1780, low52w: 1100 },
  { symbol: "ITC", name: "ITC Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 465.30, change: -3.20, changePercent: -0.68, volume: "18.9M", marketCap: "₹5.8T", sector: "Consumer", pe: 27.8, high52w: 510, low52w: 380 },
  { symbol: "WIPRO", name: "Wipro Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 478.90, change: 5.60, changePercent: 1.18, volume: "7.3M", marketCap: "₹2.5T", sector: "Technology", pe: 22.5, high52w: 520, low52w: 370 },
  { symbol: "HCLTECH", name: "HCL Technologies", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1567.40, change: 18.90, changePercent: 1.22, volume: "4.1M", marketCap: "₹4.3T", sector: "Technology", pe: 25.8, high52w: 1680, low52w: 1190 },
  { symbol: "TATAMOTORS", name: "Tata Motors", exchange: "NSE", country: "India", flag: "🇮🇳", price: 985.20, change: -14.30, changePercent: -1.43, volume: "12.8M", marketCap: "₹3.6T", sector: "Automotive", pe: 8.5, high52w: 1080, low52w: 620 },
  { symbol: "MARUTI", name: "Maruti Suzuki", exchange: "NSE", country: "India", flag: "🇮🇳", price: 12450.75, change: 185.40, changePercent: 1.51, volume: "1.2M", marketCap: "₹3.9T", sector: "Automotive", pe: 32.4, high52w: 13200, low52w: 9800 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1712.50, change: 28.30, changePercent: 1.68, volume: "3.5M", marketCap: "₹4.1T", sector: "Healthcare", pe: 35.2, high52w: 1850, low52w: 1200 },
  { symbol: "DRREDDY", name: "Dr. Reddy's Labs", exchange: "NSE", country: "India", flag: "🇮🇳", price: 6245.80, change: -42.50, changePercent: -0.68, volume: "0.8M", marketCap: "₹1.04T", sector: "Healthcare", pe: 21.3, high52w: 6800, low52w: 4900 },
  { symbol: "ADANIENT", name: "Adani Enterprises", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2945.30, change: 67.80, changePercent: 2.35, volume: "5.8M", marketCap: "₹3.4T", sector: "Industrial", pe: 85.4, high52w: 3400, low52w: 2100 },
  { symbol: "ADANIPORTS", name: "Adani Ports", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1385.60, change: 18.90, changePercent: 1.38, volume: "4.2M", marketCap: "₹3.0T", sector: "Industrial", pe: 32.7, high52w: 1500, low52w: 980 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", exchange: "NSE", country: "India", flag: "🇮🇳", price: 6892.40, change: -45.20, changePercent: -0.65, volume: "2.1M", marketCap: "₹4.3T", sector: "Financial", pe: 28.9, high52w: 7600, low52w: 5800 },
  { symbol: "LTIM", name: "LTIMindtree", exchange: "NSE", country: "India", flag: "🇮🇳", price: 5245.80, change: 65.30, changePercent: 1.26, volume: "1.5M", marketCap: "₹1.6T", sector: "Technology", pe: 30.2, high52w: 5800, low52w: 4200 },
  { symbol: "TATASTEEL", name: "Tata Steel", exchange: "NSE", country: "India", flag: "🇮🇳", price: 165.40, change: 3.80, changePercent: 2.35, volume: "35.2M", marketCap: "₹2.0T", sector: "Materials", pe: 12.8, high52w: 185, low52w: 110 },
  { symbol: "POWERGRID", name: "Power Grid Corp", exchange: "NSE", country: "India", flag: "🇮🇳", price: 312.80, change: 4.50, changePercent: 1.46, volume: "12.4M", marketCap: "₹2.9T", sector: "Utilities", pe: 17.5, high52w: 340, low52w: 220 },
  { symbol: "NTPC", name: "NTPC Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 385.60, change: -2.10, changePercent: -0.54, volume: "14.8M", marketCap: "₹3.7T", sector: "Utilities", pe: 18.2, high52w: 420, low52w: 280 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", exchange: "NSE", country: "India", flag: "🇮🇳", price: 278.40, change: 5.60, changePercent: 2.05, volume: "18.5M", marketCap: "₹3.5T", sector: "Energy", pe: 8.5, high52w: 310, low52w: 190 },
  { symbol: "COALINDIA", name: "Coal India", exchange: "NSE", country: "India", flag: "🇮🇳", price: 478.90, change: -6.30, changePercent: -1.30, volume: "8.9M", marketCap: "₹2.9T", sector: "Energy", pe: 9.2, high52w: 530, low52w: 340 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2485.60, change: -18.40, changePercent: -0.73, volume: "3.2M", marketCap: "₹5.8T", sector: "Consumer", pe: 58.2, high52w: 2700, low52w: 2100 },
  { symbol: "ASIANPAINT", name: "Asian Paints", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2875.30, change: 32.10, changePercent: 1.13, volume: "2.1M", marketCap: "₹2.8T", sector: "Consumer", pe: 55.4, high52w: 3400, low52w: 2500 },
  { symbol: "TITAN", name: "Titan Company", exchange: "NSE", country: "India", flag: "🇮🇳", price: 3542.80, change: 48.60, changePercent: 1.39, volume: "1.8M", marketCap: "₹3.1T", sector: "Consumer", pe: 72.3, high52w: 3900, low52w: 2800 },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement", exchange: "NSE", country: "India", flag: "🇮🇳", price: 10245.60, change: 125.30, changePercent: 1.24, volume: "0.6M", marketCap: "₹3.0T", sector: "Materials", pe: 38.5, high52w: 11200, low52w: 8500 },
  { symbol: "JSWSTEEL", name: "JSW Steel", exchange: "NSE", country: "India", flag: "🇮🇳", price: 892.40, change: 14.80, changePercent: 1.69, volume: "5.8M", marketCap: "₹2.2T", sector: "Materials", pe: 24.6, high52w: 980, low52w: 680 },
  { symbol: "M&M", name: "Mahindra & Mahindra", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2685.40, change: 42.30, changePercent: 1.60, volume: "3.4M", marketCap: "₹3.3T", sector: "Automotive", pe: 28.7, high52w: 2900, low52w: 1800 },
  { symbol: "TECHM", name: "Tech Mahindra", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1345.20, change: -8.60, changePercent: -0.64, volume: "4.5M", marketCap: "₹1.3T", sector: "Technology", pe: 28.9, high52w: 1480, low52w: 1020 },
  // 🇮🇳 Defence
  { symbol: "HAL", name: "Hindustan Aeronautics", exchange: "NSE", country: "India", flag: "🇮🇳", price: 4285.60, change: 92.30, changePercent: 2.20, volume: "3.2M", marketCap: "₹2.9T", sector: "Defence", pe: 38.5, high52w: 4800, low52w: 2800 },
  { symbol: "BEL", name: "Bharat Electronics", exchange: "NSE", country: "India", flag: "🇮🇳", price: 285.40, change: 8.70, changePercent: 3.14, volume: "25.8M", marketCap: "₹2.1T", sector: "Defence", pe: 42.3, high52w: 320, low52w: 180 },
  { symbol: "BDL", name: "Bharat Dynamics", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1685.30, change: 45.60, changePercent: 2.78, volume: "2.1M", marketCap: "₹310B", sector: "Defence", pe: 52.8, high52w: 1900, low52w: 950 },
  { symbol: "COCHINSHIP", name: "Cochin Shipyard", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2145.80, change: 68.40, changePercent: 3.29, volume: "3.5M", marketCap: "₹565B", sector: "Defence", pe: 48.5, high52w: 2500, low52w: 1100 },
  { symbol: "MAZAGON", name: "Mazagon Dock Shipbuilders", exchange: "NSE", country: "India", flag: "🇮🇳", price: 4520.30, change: 112.80, changePercent: 2.56, volume: "1.2M", marketCap: "₹912B", sector: "Defence", pe: 35.2, high52w: 5200, low52w: 2800 },
  { symbol: "GRSE", name: "Garden Reach Shipbuilders", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1842.60, change: 52.30, changePercent: 2.92, volume: "1.8M", marketCap: "₹212B", sector: "Defence", pe: 45.8, high52w: 2200, low52w: 900 },
  { symbol: "PARAS", name: "Paras Defence", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1125.40, change: 28.90, changePercent: 2.64, volume: "0.8M", marketCap: "₹45B", sector: "Defence", pe: 68.2, high52w: 1350, low52w: 650 },
  { symbol: "SOLARINDS", name: "Solar Industries", exchange: "NSE", country: "India", flag: "🇮🇳", price: 9845.30, change: 245.60, changePercent: 2.56, volume: "0.3M", marketCap: "₹890B", sector: "Defence", pe: 72.5, high52w: 11200, low52w: 6500 },
  // 🇮🇳 BSE + More NSE
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", exchange: "BSE", country: "India", flag: "🇮🇳", price: 8945.60, change: 125.30, changePercent: 1.42, volume: "0.9M", marketCap: "₹2.5T", sector: "Automotive", pe: 32.1, high52w: 9800, low52w: 6500 },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp", exchange: "BSE", country: "India", flag: "🇮🇳", price: 5678.40, change: 82.60, changePercent: 1.48, volume: "1.1M", marketCap: "₹1.1T", sector: "Automotive", pe: 24.8, high52w: 6200, low52w: 3800 },
  { symbol: "NESTLEIND", name: "Nestle India", exchange: "BSE", country: "India", flag: "🇮🇳", price: 2485.30, change: -15.40, changePercent: -0.62, volume: "0.8M", marketCap: "₹2.4T", sector: "Consumer", pe: 72.5, high52w: 2700, low52w: 2100 },
  { symbol: "BRITANNIA", name: "Britannia Industries", exchange: "BSE", country: "India", flag: "🇮🇳", price: 5342.80, change: 48.90, changePercent: 0.92, volume: "0.5M", marketCap: "₹1.3T", sector: "Consumer", pe: 55.8, high52w: 5800, low52w: 4200 },
  { symbol: "DABUR", name: "Dabur India", exchange: "BSE", country: "India", flag: "🇮🇳", price: 578.40, change: 6.80, changePercent: 1.19, volume: "3.2M", marketCap: "₹1.0T", sector: "Consumer", pe: 58.2, high52w: 640, low52w: 480 },
  { symbol: "GAIL", name: "GAIL India", exchange: "BSE", country: "India", flag: "🇮🇳", price: 198.50, change: 4.30, changePercent: 2.21, volume: "12.5M", marketCap: "₹1.3T", sector: "Energy", pe: 12.8, high52w: 220, low52w: 135 },
  { symbol: "BPCL", name: "Bharat Petroleum", exchange: "BSE", country: "India", flag: "🇮🇳", price: 625.80, change: 12.40, changePercent: 2.02, volume: "8.5M", marketCap: "₹1.4T", sector: "Energy", pe: 8.5, high52w: 680, low52w: 420 },
  { symbol: "IOC", name: "Indian Oil Corp", exchange: "BSE", country: "India", flag: "🇮🇳", price: 168.30, change: 3.20, changePercent: 1.94, volume: "22.5M", marketCap: "₹2.4T", sector: "Energy", pe: 6.8, high52w: 195, low52w: 115 },
  { symbol: "AXISBANK", name: "Axis Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1145.20, change: 18.40, changePercent: 1.63, volume: "8.5M", marketCap: "₹3.5T", sector: "Financial", pe: 14.8, high52w: 1260, low52w: 890 },
  { symbol: "INDUSINDBK", name: "IndusInd Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1485.60, change: -22.30, changePercent: -1.48, volume: "4.2M", marketCap: "₹1.2T", sector: "Financial", pe: 12.5, high52w: 1680, low52w: 1100 },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance", exchange: "NSE", country: "India", flag: "🇮🇳", price: 642.30, change: 8.50, changePercent: 1.34, volume: "5.8M", marketCap: "₹1.4T", sector: "Financial", pe: 85.2, high52w: 720, low52w: 520 },
  { symbol: "SBILIFE", name: "SBI Life Insurance", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1542.80, change: 22.40, changePercent: 1.47, volume: "2.1M", marketCap: "₹1.5T", sector: "Financial", pe: 72.5, high52w: 1700, low52w: 1200 },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1685.40, change: -15.20, changePercent: -0.89, volume: "2.8M", marketCap: "₹2.7T", sector: "Financial", pe: 32.1, high52w: 1900, low52w: 1400 },
  { symbol: "LT", name: "Larsen & Toubro", exchange: "NSE", country: "India", flag: "🇮🇳", price: 3542.80, change: 48.60, changePercent: 1.39, volume: "3.5M", marketCap: "₹4.9T", sector: "Industrial", pe: 35.8, high52w: 3900, low52w: 2800 },
  { symbol: "EICHERMOT", name: "Eicher Motors", exchange: "NSE", country: "India", flag: "🇮🇳", price: 4285.60, change: 62.30, changePercent: 1.47, volume: "1.2M", marketCap: "₹1.2T", sector: "Automotive", pe: 32.5, high52w: 4800, low52w: 3200 },
  { symbol: "TATAPOWER", name: "Tata Power", exchange: "NSE", country: "India", flag: "🇮🇳", price: 425.80, change: 8.40, changePercent: 2.01, volume: "18.5M", marketCap: "₹1.4T", sector: "Utilities", pe: 42.5, high52w: 480, low52w: 280 },
  { symbol: "ADANIGREEN", name: "Adani Green Energy", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1842.60, change: 45.30, changePercent: 2.52, volume: "3.2M", marketCap: "₹2.9T", sector: "Utilities", pe: 248, high52w: 2100, low52w: 1200 },
  { symbol: "DIVISLAB", name: "Divi's Laboratories", exchange: "NSE", country: "India", flag: "🇮🇳", price: 4685.30, change: 52.80, changePercent: 1.14, volume: "0.8M", marketCap: "₹1.2T", sector: "Healthcare", pe: 62.5, high52w: 5200, low52w: 3400 },
  { symbol: "CIPLA", name: "Cipla Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1485.60, change: 18.40, changePercent: 1.25, volume: "3.2M", marketCap: "₹1.2T", sector: "Healthcare", pe: 28.5, high52w: 1600, low52w: 1050 },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals", exchange: "NSE", country: "India", flag: "🇮🇳", price: 6245.80, change: 85.30, changePercent: 1.38, volume: "0.6M", marketCap: "₹890B", sector: "Healthcare", pe: 72.5, high52w: 6800, low52w: 4800 },
  { symbol: "TRENT", name: "Trent Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 5842.60, change: 142.30, changePercent: 2.50, volume: "1.2M", marketCap: "₹2.1T", sector: "Consumer", pe: 148, high52w: 6500, low52w: 3200 },
  { symbol: "ZOMATO", name: "Zomato Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 245.80, change: 8.40, changePercent: 3.54, volume: "42.5M", marketCap: "₹2.2T", sector: "Technology", pe: 320, high52w: 280, low52w: 120 },
  { symbol: "PAYTM", name: "One97 Communications", exchange: "NSE", country: "India", flag: "🇮🇳", price: 842.30, change: -18.50, changePercent: -2.15, volume: "8.5M", marketCap: "₹535B", sector: "Technology", pe: 0, high52w: 1050, low52w: 450 },
  { symbol: "NYKAA", name: "FSN E-Commerce", exchange: "NSE", country: "India", flag: "🇮🇳", price: 178.40, change: 4.20, changePercent: 2.41, volume: "5.2M", marketCap: "₹510B", sector: "Consumer", pe: 850, high52w: 220, low52w: 130 },
  { symbol: "POLICYBZR", name: "PB Fintech", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1542.80, change: 38.60, changePercent: 2.56, volume: "2.8M", marketCap: "₹698B", sector: "Financial", pe: 0, high52w: 1800, low52w: 800 },
  { symbol: "DELHIVERY", name: "Delhivery Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 412.50, change: 8.80, changePercent: 2.18, volume: "3.5M", marketCap: "₹302B", sector: "Industrial", pe: 0, high52w: 480, low52w: 310 },
  { symbol: "VEDL", name: "Vedanta Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 442.80, change: 12.50, changePercent: 2.91, volume: "22.5M", marketCap: "₹1.6T", sector: "Materials", pe: 8.5, high52w: 500, low52w: 280 },
  { symbol: "HINDALCO", name: "Hindalco Industries", exchange: "NSE", country: "India", flag: "🇮🇳", price: 642.30, change: 15.80, changePercent: 2.52, volume: "8.5M", marketCap: "₹1.4T", sector: "Materials", pe: 12.5, high52w: 720, low52w: 450 },
  { symbol: "GRASIM", name: "Grasim Industries", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2485.60, change: 32.40, changePercent: 1.32, volume: "1.8M", marketCap: "₹1.6T", sector: "Materials", pe: 18.5, high52w: 2800, low52w: 1900 },
  { symbol: "SHREECEM", name: "Shree Cement", exchange: "NSE", country: "India", flag: "🇮🇳", price: 26845.30, change: 345.60, changePercent: 1.30, volume: "0.2M", marketCap: "₹968B", sector: "Materials", pe: 42.5, high52w: 29000, low52w: 22000 },
  { symbol: "AMBUJACEM", name: "Ambuja Cements", exchange: "NSE", country: "India", flag: "🇮🇳", price: 625.40, change: 8.80, changePercent: 1.43, volume: "4.2M", marketCap: "₹1.2T", sector: "Materials", pe: 28.5, high52w: 700, low52w: 480 },
  { symbol: "PIDILITIND", name: "Pidilite Industries", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2985.60, change: 42.30, changePercent: 1.44, volume: "0.8M", marketCap: "₹1.5T", sector: "Materials", pe: 72.5, high52w: 3200, low52w: 2400 },
  { symbol: "GODREJCP", name: "Godrej Consumer", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1285.40, change: 15.60, changePercent: 1.23, volume: "1.5M", marketCap: "₹1.3T", sector: "Consumer", pe: 55.2, high52w: 1450, low52w: 980 },
  { symbol: "MARICO", name: "Marico Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 585.20, change: 6.80, changePercent: 1.18, volume: "3.2M", marketCap: "₹756B", sector: "Consumer", pe: 52.8, high52w: 650, low52w: 480 },
  { symbol: "HAVELLS", name: "Havells India", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1642.30, change: 22.50, changePercent: 1.39, volume: "1.8M", marketCap: "₹1.0T", sector: "Industrial", pe: 65.2, high52w: 1800, low52w: 1200 },
  { symbol: "SIEMENS", name: "Siemens Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 6485.60, change: 85.30, changePercent: 1.33, volume: "0.3M", marketCap: "₹2.3T", sector: "Industrial", pe: 82.5, high52w: 7200, low52w: 4800 },
  { symbol: "ABB", name: "ABB India", exchange: "NSE", country: "India", flag: "🇮🇳", price: 7245.80, change: 125.40, changePercent: 1.76, volume: "0.2M", marketCap: "₹1.5T", sector: "Industrial", pe: 92.5, high52w: 8000, low52w: 5200 },
  { symbol: "IRCTC", name: "IRCTC Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 842.60, change: 18.40, changePercent: 2.23, volume: "4.2M", marketCap: "₹672B", sector: "Consumer", pe: 52.8, high52w: 980, low52w: 620 },
  { symbol: "IRFC", name: "Indian Railway Finance", exchange: "NSE", country: "India", flag: "🇮🇳", price: 178.40, change: 5.20, changePercent: 3.00, volume: "42.5M", marketCap: "₹2.3T", sector: "Financial", pe: 28.5, high52w: 210, low52w: 95 },
  { symbol: "RECLTD", name: "REC Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 542.80, change: 15.60, changePercent: 2.96, volume: "8.5M", marketCap: "₹1.4T", sector: "Financial", pe: 8.5, high52w: 620, low52w: 340 },
  { symbol: "PFC", name: "Power Finance Corp", exchange: "NSE", country: "India", flag: "🇮🇳", price: 478.40, change: 12.80, changePercent: 2.75, volume: "12.5M", marketCap: "₹1.6T", sector: "Financial", pe: 7.2, high52w: 540, low52w: 290 },
  { symbol: "NHPC", name: "NHPC Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 92.40, change: 2.80, changePercent: 3.13, volume: "35.2M", marketCap: "₹928B", sector: "Utilities", pe: 22.5, high52w: 110, low52w: 55 },
  { symbol: "SJVN", name: "SJVN Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 128.40, change: 4.20, changePercent: 3.38, volume: "18.5M", marketCap: "₹505B", sector: "Utilities", pe: 42.5, high52w: 155, low52w: 72 },
  { symbol: "JIOFIN", name: "Jio Financial Services", exchange: "NSE", country: "India", flag: "🇮🇳", price: 342.80, change: 8.50, changePercent: 2.54, volume: "15.2M", marketCap: "₹2.2T", sector: "Financial", pe: 125, high52w: 400, low52w: 215 },
  { symbol: "TATACONSUM", name: "Tata Consumer Products", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1085.40, change: 12.30, changePercent: 1.15, volume: "3.5M", marketCap: "₹1.0T", sector: "Consumer", pe: 68.5, high52w: 1250, low52w: 850 },
  { symbol: "MPHASIS", name: "Mphasis Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2845.60, change: 35.40, changePercent: 1.26, volume: "0.8M", marketCap: "₹535B", sector: "Technology", pe: 28.5, high52w: 3200, low52w: 2200 },
  { symbol: "PERSISTENT", name: "Persistent Systems", exchange: "NSE", country: "India", flag: "🇮🇳", price: 5642.30, change: 82.50, changePercent: 1.48, volume: "0.5M", marketCap: "₹868B", sector: "Technology", pe: 65.2, high52w: 6200, low52w: 3800 },
  { symbol: "COFORGE", name: "Coforge Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 6845.80, change: 95.40, changePercent: 1.41, volume: "0.3M", marketCap: "₹425B", sector: "Technology", pe: 42.5, high52w: 7500, low52w: 4800 },
  { symbol: "BIOCON", name: "Biocon Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 342.80, change: 5.60, changePercent: 1.66, volume: "5.2M", marketCap: "₹410B", sector: "Healthcare", pe: 35.2, high52w: 380, low52w: 240 },
  { symbol: "LUPIN", name: "Lupin Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1842.60, change: 28.40, changePercent: 1.57, volume: "2.1M", marketCap: "₹838B", sector: "Healthcare", pe: 32.5, high52w: 2050, low52w: 1350 },
  { symbol: "TORNTPHARM", name: "Torrent Pharmaceuticals", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2685.40, change: 32.60, changePercent: 1.23, volume: "0.5M", marketCap: "₹908B", sector: "Healthcare", pe: 58.2, high52w: 3000, low52w: 2100 },
  { symbol: "MAXHEALTH", name: "Max Healthcare", exchange: "NSE", country: "India", flag: "🇮🇳", price: 885.60, change: 15.20, changePercent: 1.75, volume: "2.8M", marketCap: "₹860B", sector: "Healthcare", pe: 72.5, high52w: 980, low52w: 640 },
  { symbol: "INDIANB", name: "Indian Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 542.30, change: 12.80, changePercent: 2.42, volume: "5.8M", marketCap: "₹728B", sector: "Financial", pe: 8.5, high52w: 600, low52w: 380 },
  { symbol: "BANKBARODA", name: "Bank of Baroda", exchange: "NSE", country: "India", flag: "🇮🇳", price: 268.40, change: 5.60, changePercent: 2.13, volume: "18.5M", marketCap: "₹1.4T", sector: "Financial", pe: 7.2, high52w: 300, low52w: 195 },
  { symbol: "CANBK", name: "Canara Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 112.40, change: 3.20, changePercent: 2.93, volume: "25.8M", marketCap: "₹1.0T", sector: "Financial", pe: 6.5, high52w: 130, low52w: 78 },
  { symbol: "PNB", name: "Punjab National Bank", exchange: "NSE", country: "India", flag: "🇮🇳", price: 128.60, change: 4.80, changePercent: 3.87, volume: "42.5M", marketCap: "₹1.4T", sector: "Financial", pe: 12.5, high52w: 145, low52w: 82 },
  { symbol: "DLF", name: "DLF Ltd", exchange: "NSE", country: "India", flag: "🇮🇳", price: 842.30, change: 18.50, changePercent: 2.25, volume: "4.2M", marketCap: "₹2.1T", sector: "Real Estate", pe: 55.2, high52w: 950, low52w: 580 },
  { symbol: "GODREJPROP", name: "Godrej Properties", exchange: "NSE", country: "India", flag: "🇮🇳", price: 2685.40, change: 52.30, changePercent: 1.99, volume: "1.2M", marketCap: "₹745B", sector: "Real Estate", pe: 85.2, high52w: 3100, low52w: 1800 },
  { symbol: "OBEROIRLTY", name: "Oberoi Realty", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1785.60, change: 32.40, changePercent: 1.85, volume: "0.8M", marketCap: "₹650B", sector: "Real Estate", pe: 28.5, high52w: 2000, low52w: 1200 },
  { symbol: "IDEA", name: "Vodafone Idea", exchange: "NSE", country: "India", flag: "🇮🇳", price: 14.85, change: 0.45, changePercent: 3.13, volume: "285M", marketCap: "₹730B", sector: "Telecom", pe: 0, high52w: 18, low52w: 8 },
  { symbol: "TATACOMM", name: "Tata Communications", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1842.60, change: 25.40, changePercent: 1.40, volume: "0.5M", marketCap: "₹525B", sector: "Telecom", pe: 35.2, high52w: 2100, low52w: 1400 },
  { symbol: "MUTHOOTFIN", name: "Muthoot Finance", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1685.40, change: 22.80, changePercent: 1.37, volume: "1.2M", marketCap: "₹676B", sector: "Financial", pe: 15.2, high52w: 1850, low52w: 1250 },
  { symbol: "CHOLAFIN", name: "Cholamandalam Investment", exchange: "NSE", country: "India", flag: "🇮🇳", price: 1342.80, change: 18.60, changePercent: 1.40, volume: "1.8M", marketCap: "₹1.1T", sector: "Financial", pe: 28.5, high52w: 1500, low52w: 1000 },

  // ============================================================
  // 🇺🇸 NASDAQ — 80+ stocks
  // ============================================================
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 198.45, change: 3.21, changePercent: 1.64, volume: "58.2M", marketCap: "$3.1T", sector: "Technology", pe: 31.2, high52w: 210, low52w: 155 },
  { symbol: "MSFT", name: "Microsoft Corp", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 428.73, change: 7.89, changePercent: 1.87, volume: "22.1M", marketCap: "$3.2T", sector: "Technology", pe: 36.4, high52w: 445, low52w: 310 },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 178.92, change: -1.34, changePercent: -0.74, volume: "18.9M", marketCap: "$2.2T", sector: "Technology", pe: 25.8, high52w: 192, low52w: 120 },
  { symbol: "NVDA", name: "NVIDIA Corp", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 875.42, change: 32.18, changePercent: 3.82, volume: "45.6M", marketCap: "$2.2T", sector: "Technology", pe: 65.2, high52w: 950, low52w: 390 },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 245.67, change: -5.43, changePercent: -2.16, volume: "98.4M", marketCap: "$780B", sector: "Automotive", pe: 72.1, high52w: 300, low52w: 150 },
  { symbol: "AMZN", name: "Amazon.com", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 185.34, change: 2.78, changePercent: 1.52, volume: "32.5M", marketCap: "$1.9T", sector: "Consumer", pe: 42.7, high52w: 195, low52w: 118 },
  { symbol: "META", name: "Meta Platforms", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 502.30, change: 8.45, changePercent: 1.71, volume: "15.8M", marketCap: "$1.3T", sector: "Technology", pe: 28.9, high52w: 540, low52w: 280 },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 628.50, change: 12.30, changePercent: 2.00, volume: "8.2M", marketCap: "$272B", sector: "Consumer", pe: 45.8, high52w: 700, low52w: 380 },
  { symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 178.90, change: 5.60, changePercent: 3.23, volume: "42.3M", marketCap: "$289B", sector: "Technology", pe: 48.2, high52w: 228, low52w: 95 },
  { symbol: "INTC", name: "Intel Corp", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 42.80, change: -1.20, changePercent: -2.73, volume: "35.8M", marketCap: "$180B", sector: "Technology", pe: 25.4, high52w: 52, low52w: 28 },
  { symbol: "AVGO", name: "Broadcom Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 1345.80, change: 28.40, changePercent: 2.16, volume: "5.2M", marketCap: "$625B", sector: "Technology", pe: 32.8, high52w: 1450, low52w: 800 },
  { symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 542.30, change: -8.90, changePercent: -1.61, volume: "3.8M", marketCap: "$242B", sector: "Technology", pe: 38.5, high52w: 640, low52w: 430 },
  { symbol: "CRM", name: "Salesforce", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 265.80, change: 4.50, changePercent: 1.72, volume: "6.2M", marketCap: "$258B", sector: "Technology", pe: 42.1, high52w: 320, low52w: 195 },
  { symbol: "CSCO", name: "Cisco Systems", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 52.40, change: 0.85, changePercent: 1.65, volume: "18.5M", marketCap: "$213B", sector: "Technology", pe: 15.8, high52w: 58, low52w: 42 },
  { symbol: "PYPL", name: "PayPal Holdings", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 68.90, change: 2.30, changePercent: 3.45, volume: "12.8M", marketCap: "$75B", sector: "Financial", pe: 18.2, high52w: 85, low52w: 55 },
  { symbol: "QCOM", name: "Qualcomm", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 168.40, change: 3.80, changePercent: 2.31, volume: "7.8M", marketCap: "$188B", sector: "Technology", pe: 22.5, high52w: 195, low52w: 110 },
  { symbol: "ORCL", name: "Oracle Corp", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 178.50, change: 4.20, changePercent: 2.41, volume: "8.5M", marketCap: "$492B", sector: "Technology", pe: 35.2, high52w: 195, low52w: 105 },
  { symbol: "COST", name: "Costco Wholesale", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 742.30, change: 8.50, changePercent: 1.16, volume: "2.8M", marketCap: "$329B", sector: "Consumer", pe: 48.5, high52w: 780, low52w: 540 },
  { symbol: "SBUX", name: "Starbucks Corp", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 98.40, change: 1.80, changePercent: 1.86, volume: "8.5M", marketCap: "$112B", sector: "Consumer", pe: 25.8, high52w: 110, low52w: 72 },
  { symbol: "ABNB", name: "Airbnb Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 152.80, change: 3.40, changePercent: 2.27, volume: "5.2M", marketCap: "$97B", sector: "Consumer", pe: 22.5, high52w: 170, low52w: 110 },
  { symbol: "UBER", name: "Uber Technologies", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 72.50, change: 2.10, changePercent: 2.98, volume: "18.5M", marketCap: "$150B", sector: "Technology", pe: 85.2, high52w: 82, low52w: 40 },
  { symbol: "SNOW", name: "Snowflake Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 185.40, change: 5.80, changePercent: 3.23, volume: "4.2M", marketCap: "$62B", sector: "Technology", pe: 0, high52w: 240, low52w: 120 },
  { symbol: "PANW", name: "Palo Alto Networks", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 312.50, change: 8.40, changePercent: 2.76, volume: "3.8M", marketCap: "$102B", sector: "Technology", pe: 52.5, high52w: 380, low52w: 220 },
  { symbol: "CRWD", name: "CrowdStrike Holdings", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 285.40, change: 6.80, changePercent: 2.44, volume: "4.5M", marketCap: "$69B", sector: "Technology", pe: 72.5, high52w: 370, low52w: 190 },
  { symbol: "MRVL", name: "Marvell Technology", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 72.30, change: 2.50, changePercent: 3.58, volume: "12.8M", marketCap: "$62B", sector: "Technology", pe: 42.5, high52w: 88, low52w: 48 },
  { symbol: "AMAT", name: "Applied Materials", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 198.40, change: 5.60, changePercent: 2.91, volume: "6.2M", marketCap: "$164B", sector: "Technology", pe: 22.5, high52w: 232, low52w: 130 },
  { symbol: "LRCX", name: "Lam Research", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 842.30, change: 18.50, changePercent: 2.25, volume: "2.1M", marketCap: "$110B", sector: "Technology", pe: 25.8, high52w: 960, low52w: 580 },
  { symbol: "KLAC", name: "KLA Corp", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 685.40, change: 15.20, changePercent: 2.27, volume: "1.5M", marketCap: "$92B", sector: "Technology", pe: 28.5, high52w: 760, low52w: 460 },
  { symbol: "MU", name: "Micron Technology", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 112.40, change: 4.80, changePercent: 4.46, volume: "22.5M", marketCap: "$124B", sector: "Technology", pe: 28.5, high52w: 135, low52w: 60 },
  { symbol: "NXPI", name: "NXP Semiconductors", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 248.60, change: 5.20, changePercent: 2.14, volume: "2.8M", marketCap: "$63B", sector: "Technology", pe: 22.5, high52w: 275, low52w: 180 },
  { symbol: "DDOG", name: "Datadog Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 128.40, change: 3.80, changePercent: 3.05, volume: "5.8M", marketCap: "$42B", sector: "Technology", pe: 252, high52w: 150, low52w: 85 },
  { symbol: "ZS", name: "Zscaler Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 218.50, change: 5.40, changePercent: 2.53, volume: "2.5M", marketCap: "$32B", sector: "Technology", pe: 0, high52w: 260, low52w: 155 },
  { symbol: "TTD", name: "The Trade Desk", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 92.40, change: 3.20, changePercent: 3.59, volume: "8.5M", marketCap: "$45B", sector: "Technology", pe: 185, high52w: 105, low52w: 55 },
  { symbol: "DASH", name: "DoorDash Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 142.80, change: 4.50, changePercent: 3.25, volume: "4.2M", marketCap: "$56B", sector: "Technology", pe: 0, high52w: 160, low52w: 85 },
  { symbol: "COIN", name: "Coinbase Global", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 245.60, change: 12.80, changePercent: 5.50, volume: "8.5M", marketCap: "$60B", sector: "Financial", pe: 35.2, high52w: 280, low52w: 110 },
  { symbol: "SQ", name: "Block Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 78.40, change: 2.80, changePercent: 3.70, volume: "8.5M", marketCap: "$47B", sector: "Financial", pe: 42.5, high52w: 92, low52w: 48 },
  { symbol: "SHOP", name: "Shopify Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 78.50, change: 2.40, changePercent: 3.15, volume: "12.8M", marketCap: "$98B", sector: "Technology", pe: 72.5, high52w: 92, low52w: 48 },
  { symbol: "ROKU", name: "Roku Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 68.40, change: 2.20, changePercent: 3.32, volume: "5.2M", marketCap: "$10B", sector: "Technology", pe: 0, high52w: 85, low52w: 48 },
  { symbol: "MELI", name: "MercadoLibre", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 1685.40, change: 42.50, changePercent: 2.59, volume: "0.8M", marketCap: "$85B", sector: "Consumer", pe: 55.2, high52w: 1950, low52w: 1200 },
  { symbol: "PDD", name: "PDD Holdings", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 142.80, change: 5.80, changePercent: 4.23, volume: "12.5M", marketCap: "$195B", sector: "Consumer", pe: 12.5, high52w: 165, low52w: 88 },
  { symbol: "BIDU", name: "Baidu Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 112.40, change: 3.80, changePercent: 3.50, volume: "5.8M", marketCap: "$40B", sector: "Technology", pe: 15.8, high52w: 140, low52w: 85 },
  { symbol: "JD", name: "JD.com Inc.", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 35.80, change: 1.20, changePercent: 3.47, volume: "12.5M", marketCap: "$56B", sector: "Consumer", pe: 12.8, high52w: 45, low52w: 22 },
  { symbol: "RIVN", name: "Rivian Automotive", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 18.40, change: 0.85, changePercent: 4.84, volume: "32.5M", marketCap: "$18B", sector: "Automotive", pe: 0, high52w: 28, low52w: 10 },
  { symbol: "LCID", name: "Lucid Group", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 4.85, change: 0.22, changePercent: 4.75, volume: "42.5M", marketCap: "$14B", sector: "Automotive", pe: 0, high52w: 8, low52w: 3 },
  { symbol: "PLTR", name: "Palantir Technologies", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 22.40, change: 1.20, changePercent: 5.66, volume: "52.5M", marketCap: "$48B", sector: "Technology", pe: 185, high52w: 28, low52w: 14 },
  { symbol: "ARM", name: "Arm Holdings", exchange: "NASDAQ", country: "USA", flag: "🇺🇸", price: 142.80, change: 8.50, changePercent: 6.33, volume: "8.5M", marketCap: "$148B", sector: "Technology", pe: 285, high52w: 165, low52w: 55 },

  // ============================================================
  // 🇺🇸 NYSE — 60+ stocks
  // ============================================================
  { symbol: "JPM", name: "JPMorgan Chase", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 198.40, change: 3.20, changePercent: 1.64, volume: "12.5M", marketCap: "$572B", sector: "Financial", pe: 11.8, high52w: 210, low52w: 145 },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 282.50, change: 4.80, changePercent: 1.73, volume: "8.2M", marketCap: "$580B", sector: "Financial", pe: 30.5, high52w: 295, low52w: 225 },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 158.40, change: -1.20, changePercent: -0.75, volume: "6.8M", marketCap: "$382B", sector: "Healthcare", pe: 18.5, high52w: 175, low52w: 140 },
  { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 165.80, change: 2.40, changePercent: 1.47, volume: "8.5M", marketCap: "$445B", sector: "Consumer", pe: 28.2, high52w: 175, low52w: 135 },
  { symbol: "PG", name: "Procter & Gamble", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 162.30, change: 1.80, changePercent: 1.12, volume: "5.8M", marketCap: "$382B", sector: "Consumer", pe: 25.8, high52w: 170, low52w: 140 },
  { symbol: "UNH", name: "UnitedHealth Group", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 528.40, change: -8.50, changePercent: -1.58, volume: "3.8M", marketCap: "$490B", sector: "Healthcare", pe: 22.1, high52w: 580, low52w: 445 },
  { symbol: "BAC", name: "Bank of America", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 38.50, change: 0.85, changePercent: 2.26, volume: "42.5M", marketCap: "$305B", sector: "Financial", pe: 12.5, high52w: 42, low52w: 28 },
  { symbol: "DIS", name: "Walt Disney", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 112.40, change: 2.80, changePercent: 2.55, volume: "10.2M", marketCap: "$205B", sector: "Consumer", pe: 42.8, high52w: 125, low52w: 82 },
  { symbol: "KO", name: "Coca-Cola", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 62.30, change: 0.45, changePercent: 0.73, volume: "12.8M", marketCap: "$269B", sector: "Consumer", pe: 24.5, high52w: 65, low52w: 52 },
  { symbol: "XOM", name: "Exxon Mobil", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 112.80, change: 2.40, changePercent: 2.17, volume: "15.2M", marketCap: "$450B", sector: "Energy", pe: 12.8, high52w: 125, low52w: 85 },
  { symbol: "CVX", name: "Chevron Corp", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 158.40, change: 3.20, changePercent: 2.06, volume: "8.5M", marketCap: "$295B", sector: "Energy", pe: 11.5, high52w: 175, low52w: 135 },
  { symbol: "PFE", name: "Pfizer Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 28.50, change: 0.65, changePercent: 2.33, volume: "32.5M", marketCap: "$160B", sector: "Healthcare", pe: 18.2, high52w: 35, low52w: 24 },
  { symbol: "LMT", name: "Lockheed Martin", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 478.30, change: 12.50, changePercent: 2.68, volume: "1.8M", marketCap: "$115B", sector: "Defence", pe: 16.8, high52w: 510, low52w: 380 },
  { symbol: "RTX", name: "RTX Corporation", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 98.50, change: 2.80, changePercent: 2.93, volume: "6.2M", marketCap: "$132B", sector: "Defence", pe: 32.5, high52w: 108, low52w: 72 },
  { symbol: "NOC", name: "Northrop Grumman", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 485.20, change: 8.40, changePercent: 1.76, volume: "1.2M", marketCap: "$72B", sector: "Defence", pe: 18.5, high52w: 520, low52w: 410 },
  { symbol: "GD", name: "General Dynamics", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 278.40, change: 5.60, changePercent: 2.05, volume: "1.5M", marketCap: "$76B", sector: "Defence", pe: 20.2, high52w: 300, low52w: 225 },
  { symbol: "BA", name: "Boeing Co", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 215.80, change: -4.20, changePercent: -1.91, volume: "8.5M", marketCap: "$132B", sector: "Defence", pe: 0, high52w: 265, low52w: 165 },
  { symbol: "GS", name: "Goldman Sachs", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 442.60, change: 8.90, changePercent: 2.05, volume: "2.8M", marketCap: "$148B", sector: "Financial", pe: 14.2, high52w: 475, low52w: 335 },
  { symbol: "MS", name: "Morgan Stanley", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 98.40, change: 2.10, changePercent: 2.18, volume: "8.5M", marketCap: "$160B", sector: "Financial", pe: 15.8, high52w: 108, low52w: 75 },
  { symbol: "MA", name: "Mastercard Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 468.50, change: 8.20, changePercent: 1.78, volume: "3.5M", marketCap: "$438B", sector: "Financial", pe: 35.2, high52w: 495, low52w: 370 },
  { symbol: "BRK.B", name: "Berkshire Hathaway B", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 412.30, change: 5.40, changePercent: 1.33, volume: "3.8M", marketCap: "$895B", sector: "Financial", pe: 8.5, high52w: 450, low52w: 340 },
  { symbol: "C", name: "Citigroup Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 58.40, change: 1.20, changePercent: 2.10, volume: "15.2M", marketCap: "$113B", sector: "Financial", pe: 9.5, high52w: 65, low52w: 42 },
  { symbol: "WFC", name: "Wells Fargo", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 52.80, change: 1.10, changePercent: 2.13, volume: "18.5M", marketCap: "$185B", sector: "Financial", pe: 11.2, high52w: 58, low52w: 38 },
  { symbol: "AXP", name: "American Express", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 228.40, change: 4.50, changePercent: 2.01, volume: "3.2M", marketCap: "$168B", sector: "Financial", pe: 18.5, high52w: 245, low52w: 170 },
  { symbol: "HD", name: "Home Depot", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 342.50, change: 4.80, changePercent: 1.42, volume: "4.2M", marketCap: "$342B", sector: "Consumer", pe: 22.5, high52w: 380, low52w: 280 },
  { symbol: "NKE", name: "Nike Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 98.40, change: 2.20, changePercent: 2.29, volume: "8.5M", marketCap: "$150B", sector: "Consumer", pe: 28.5, high52w: 125, low52w: 75 },
  { symbol: "MCD", name: "McDonald's Corp", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 292.80, change: 3.40, changePercent: 1.18, volume: "3.5M", marketCap: "$212B", sector: "Consumer", pe: 25.8, high52w: 310, low52w: 245 },
  { symbol: "T", name: "AT&T Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 18.50, change: 0.25, changePercent: 1.37, volume: "32.5M", marketCap: "$132B", sector: "Telecom", pe: 8.5, high52w: 22, low52w: 14 },
  { symbol: "VZ", name: "Verizon Communications", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 42.80, change: 0.55, changePercent: 1.30, volume: "15.8M", marketCap: "$180B", sector: "Telecom", pe: 9.8, high52w: 48, low52w: 32 },
  { symbol: "ABT", name: "Abbott Laboratories", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 112.40, change: 1.80, changePercent: 1.63, volume: "5.8M", marketCap: "$195B", sector: "Healthcare", pe: 28.5, high52w: 125, low52w: 92 },
  { symbol: "TMO", name: "Thermo Fisher Scientific", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 542.80, change: 8.50, changePercent: 1.59, volume: "1.8M", marketCap: "$208B", sector: "Healthcare", pe: 32.5, high52w: 600, low52w: 440 },
  { symbol: "DHR", name: "Danaher Corp", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 248.60, change: 3.80, changePercent: 1.55, volume: "2.5M", marketCap: "$183B", sector: "Healthcare", pe: 35.2, high52w: 275, low52w: 200 },
  { symbol: "LLY", name: "Eli Lilly", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 785.40, change: 18.50, changePercent: 2.41, volume: "3.2M", marketCap: "$745B", sector: "Healthcare", pe: 85.2, high52w: 850, low52w: 400 },
  { symbol: "MRK", name: "Merck & Co", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 128.40, change: 2.20, changePercent: 1.74, volume: "8.5M", marketCap: "$325B", sector: "Healthcare", pe: 18.5, high52w: 140, low52w: 100 },
  { symbol: "ABBV", name: "AbbVie Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 168.50, change: 2.80, changePercent: 1.69, volume: "5.2M", marketCap: "$298B", sector: "Healthcare", pe: 15.8, high52w: 185, low52w: 135 },
  { symbol: "BMY", name: "Bristol-Myers Squibb", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 52.40, change: 0.85, changePercent: 1.65, volume: "12.5M", marketCap: "$106B", sector: "Healthcare", pe: 8.5, high52w: 58, low52w: 42 },
  { symbol: "CAT", name: "Caterpillar Inc.", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 298.40, change: 5.80, changePercent: 1.98, volume: "3.2M", marketCap: "$148B", sector: "Industrial", pe: 16.8, high52w: 320, low52w: 230 },
  { symbol: "DE", name: "Deere & Company", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 398.50, change: 6.20, changePercent: 1.58, volume: "1.8M", marketCap: "$115B", sector: "Industrial", pe: 12.5, high52w: 440, low52w: 340 },
  { symbol: "GE", name: "GE Aerospace", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 168.40, change: 4.50, changePercent: 2.75, volume: "5.8M", marketCap: "$184B", sector: "Industrial", pe: 32.5, high52w: 180, low52w: 105 },
  { symbol: "HON", name: "Honeywell International", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 198.50, change: 2.80, changePercent: 1.43, volume: "3.5M", marketCap: "$130B", sector: "Industrial", pe: 22.5, high52w: 220, low52w: 175 },
  { symbol: "COP", name: "ConocoPhillips", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 118.40, change: 2.80, changePercent: 2.42, volume: "6.2M", marketCap: "$142B", sector: "Energy", pe: 12.5, high52w: 135, low52w: 95 },
  { symbol: "SLB", name: "Schlumberger NV", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 52.80, change: 1.20, changePercent: 2.33, volume: "8.5M", marketCap: "$75B", sector: "Energy", pe: 15.8, high52w: 62, low52w: 42 },
  { symbol: "NEE", name: "NextEra Energy", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 72.40, change: 1.10, changePercent: 1.54, volume: "8.5M", marketCap: "$149B", sector: "Utilities", pe: 22.5, high52w: 80, low52w: 55 },
  { symbol: "SO", name: "Southern Company", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 78.50, change: 0.85, changePercent: 1.09, volume: "5.2M", marketCap: "$86B", sector: "Utilities", pe: 22.5, high52w: 85, low52w: 65 },
  { symbol: "DUK", name: "Duke Energy", exchange: "NYSE", country: "USA", flag: "🇺🇸", price: 102.40, change: 1.20, changePercent: 1.19, volume: "3.8M", marketCap: "$79B", sector: "Utilities", pe: 18.5, high52w: 110, low52w: 88 },

  // ============================================================
  // 🇬🇧 LSE — 20+ stocks
  // ============================================================
  { symbol: "SHELL", name: "Shell plc", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 2645.50, change: 18.00, changePercent: 0.69, volume: "5.3M", marketCap: "£165B", sector: "Energy", pe: 11.2, high52w: 2850, low52w: 2100 },
  { symbol: "AZN", name: "AstraZeneca", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 11245.00, change: 185.00, changePercent: 1.67, volume: "2.8M", marketCap: "£175B", sector: "Healthcare", pe: 32.5, high52w: 12500, low52w: 9200 },
  { symbol: "HSBA", name: "HSBC Holdings", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 678.40, change: 8.20, changePercent: 1.22, volume: "18.5M", marketCap: "£128B", sector: "Financial", pe: 6.8, high52w: 720, low52w: 540 },
  { symbol: "ULVR", name: "Unilever", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 4285.00, change: -32.00, changePercent: -0.74, volume: "3.2M", marketCap: "£108B", sector: "Consumer", pe: 18.5, high52w: 4600, low52w: 3600 },
  { symbol: "BP", name: "BP plc", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 485.60, change: 6.80, changePercent: 1.42, volume: "22.5M", marketCap: "£88B", sector: "Energy", pe: 8.2, high52w: 540, low52w: 380 },
  { symbol: "GSK", name: "GSK plc", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 1542.00, change: 18.50, changePercent: 1.21, volume: "6.8M", marketCap: "£65B", sector: "Healthcare", pe: 12.5, high52w: 1680, low52w: 1280 },
  { symbol: "RIO", name: "Rio Tinto", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 5245.00, change: 85.00, changePercent: 1.65, volume: "3.5M", marketCap: "£85B", sector: "Materials", pe: 8.5, high52w: 5800, low52w: 4200 },
  { symbol: "BAES", name: "BAE Systems", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 1385.00, change: 42.50, changePercent: 3.17, volume: "5.2M", marketCap: "£42B", sector: "Defence", pe: 22.8, high52w: 1500, low52w: 950 },
  { symbol: "LSEG", name: "London Stock Exchange", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 9845.00, change: 125.00, changePercent: 1.29, volume: "0.8M", marketCap: "£55B", sector: "Financial", pe: 42.5, high52w: 10800, low52w: 8200 },
  { symbol: "BATS", name: "British American Tobacco", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 2685.00, change: -18.00, changePercent: -0.67, volume: "3.2M", marketCap: "£60B", sector: "Consumer", pe: 8.5, high52w: 2900, low52w: 2200 },
  { symbol: "DGE", name: "Diageo", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 2845.00, change: 32.00, changePercent: 1.14, volume: "2.5M", marketCap: "£65B", sector: "Consumer", pe: 22.5, high52w: 3400, low52w: 2500 },
  { symbol: "LLOY", name: "Lloyds Banking Group", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 52.40, change: 0.85, changePercent: 1.65, volume: "85.2M", marketCap: "£35B", sector: "Financial", pe: 7.2, high52w: 58, low52w: 42 },
  { symbol: "BARC", name: "Barclays plc", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 178.40, change: 3.20, changePercent: 1.83, volume: "22.5M", marketCap: "£28B", sector: "Financial", pe: 5.8, high52w: 195, low52w: 135 },
  { symbol: "VOD", name: "Vodafone Group", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 72.40, change: -0.85, changePercent: -1.16, volume: "42.5M", marketCap: "£20B", sector: "Telecom", pe: 12.5, high52w: 85, low52w: 62 },
  { symbol: "AAL", name: "Anglo American", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 2485.00, change: 42.00, changePercent: 1.72, volume: "3.8M", marketCap: "£36B", sector: "Materials", pe: 12.5, high52w: 2800, low52w: 1800 },
  { symbol: "GLEN", name: "Glencore plc", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 442.80, change: 8.50, changePercent: 1.96, volume: "18.5M", marketCap: "£55B", sector: "Materials", pe: 8.5, high52w: 520, low52w: 380 },
  { symbol: "RR", name: "Rolls-Royce Holdings", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 378.40, change: 12.80, changePercent: 3.50, volume: "8.5M", marketCap: "£32B", sector: "Defence", pe: 32.5, high52w: 420, low52w: 180 },
  { symbol: "ANTO", name: "Antofagasta plc", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 1685.00, change: 28.00, changePercent: 1.69, volume: "1.2M", marketCap: "£17B", sector: "Materials", pe: 18.5, high52w: 1900, low52w: 1300 },
  { symbol: "BT.A", name: "BT Group", exchange: "LSE", country: "UK", flag: "🇬🇧", price: 128.40, change: 2.20, changePercent: 1.74, volume: "15.2M", marketCap: "£13B", sector: "Telecom", pe: 5.8, high52w: 145, low52w: 95 },

  // ============================================================
  // 🇯🇵 TSE — 20+ stocks
  // ============================================================
  { symbol: "7203", name: "Toyota Motor", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 3285.00, change: -42.00, changePercent: -1.26, volume: "9.8M", marketCap: "¥42.5T", sector: "Automotive", pe: 10.5, high52w: 3550, low52w: 2400 },
  { symbol: "6758", name: "Sony Group", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 13250.00, change: 185.00, changePercent: 1.42, volume: "4.2M", marketCap: "¥16.7T", sector: "Technology", pe: 18.5, high52w: 14500, low52w: 10200 },
  { symbol: "6861", name: "Keyence Corp", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 62450.00, change: 850.00, changePercent: 1.38, volume: "0.5M", marketCap: "¥15.2T", sector: "Technology", pe: 42.5, high52w: 68000, low52w: 48000 },
  { symbol: "8306", name: "Mitsubishi UFJ", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 1285.00, change: 18.50, changePercent: 1.46, volume: "32.5M", marketCap: "¥15.8T", sector: "Financial", pe: 9.8, high52w: 1400, low52w: 950 },
  { symbol: "9984", name: "SoftBank Group", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 8450.00, change: -120.00, changePercent: -1.40, volume: "8.5M", marketCap: "¥12.4T", sector: "Technology", pe: 15.2, high52w: 9800, low52w: 5800 },
  { symbol: "7974", name: "Nintendo", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 7850.00, change: 125.00, changePercent: 1.62, volume: "4.8M", marketCap: "¥10.2T", sector: "Technology", pe: 18.8, high52w: 8500, low52w: 5800 },
  { symbol: "7011", name: "Mitsubishi Heavy Industries", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 1285.00, change: 42.00, changePercent: 3.38, volume: "6.2M", marketCap: "¥4.3T", sector: "Defence", pe: 22.5, high52w: 1450, low52w: 800 },
  { symbol: "9432", name: "Nippon Telegraph", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 168.50, change: 2.20, changePercent: 1.32, volume: "15.2M", marketCap: "¥15.2T", sector: "Telecom", pe: 12.5, high52w: 185, low52w: 145 },
  { symbol: "6501", name: "Hitachi Ltd", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 9845.00, change: 142.00, changePercent: 1.46, volume: "2.8M", marketCap: "¥9.5T", sector: "Industrial", pe: 18.5, high52w: 10800, low52w: 7500 },
  { symbol: "6902", name: "Denso Corp", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 2485.00, change: -28.00, changePercent: -1.11, volume: "3.5M", marketCap: "¥7.5T", sector: "Automotive", pe: 15.8, high52w: 2800, low52w: 1900 },
  { symbol: "4502", name: "Takeda Pharmaceutical", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 4285.00, change: 52.00, changePercent: 1.23, volume: "3.2M", marketCap: "¥6.8T", sector: "Healthcare", pe: 22.5, high52w: 4800, low52w: 3500 },
  { symbol: "4568", name: "Daiichi Sankyo", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 4685.00, change: 85.00, changePercent: 1.85, volume: "5.8M", marketCap: "¥9.1T", sector: "Healthcare", pe: 42.5, high52w: 5200, low52w: 3200 },
  { symbol: "7267", name: "Honda Motor", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 1685.00, change: -22.00, changePercent: -1.29, volume: "5.2M", marketCap: "¥8.5T", sector: "Automotive", pe: 8.5, high52w: 1850, low52w: 1300 },
  { symbol: "8035", name: "Tokyo Electron", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 22450.00, change: 485.00, changePercent: 2.21, volume: "1.8M", marketCap: "¥10.5T", sector: "Technology", pe: 28.5, high52w: 25000, low52w: 16000 },
  { symbol: "6367", name: "Daikin Industries", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 24850.00, change: 285.00, changePercent: 1.16, volume: "0.5M", marketCap: "¥7.3T", sector: "Industrial", pe: 32.5, high52w: 28000, low52w: 20000 },
  { symbol: "8001", name: "ITOCHU Corp", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 6285.00, change: 85.00, changePercent: 1.37, volume: "3.2M", marketCap: "¥9.2T", sector: "Industrial", pe: 8.5, high52w: 7000, low52w: 4800 },
  { symbol: "8058", name: "Mitsubishi Corp", exchange: "TSE", country: "Japan", flag: "🇯🇵", price: 2785.00, change: 42.00, changePercent: 1.53, volume: "4.5M", marketCap: "¥8.5T", sector: "Industrial", pe: 7.2, high52w: 3100, low52w: 2100 },

  // ============================================================
  // 🇭🇰 HKEX — 15+ stocks
  // ============================================================
  { symbol: "0700", name: "Tencent Holdings", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 368.40, change: 5.60, changePercent: 1.54, volume: "15.2M", marketCap: "HK$3.5T", sector: "Technology", pe: 22.4, high52w: 420, low52w: 270 },
  { symbol: "9988", name: "Alibaba Group", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 82.50, change: 2.30, changePercent: 2.87, volume: "42.5M", marketCap: "HK$1.6T", sector: "Technology", pe: 12.8, high52w: 110, low52w: 62 },
  { symbol: "3690", name: "Meituan", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 142.50, change: 3.80, changePercent: 2.74, volume: "18.5M", marketCap: "HK$880B", sector: "Technology", pe: 35.2, high52w: 165, low52w: 85 },
  { symbol: "1299", name: "AIA Group", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 62.40, change: -0.80, changePercent: -1.27, volume: "12.8M", marketCap: "HK$680B", sector: "Financial", pe: 14.5, high52w: 78, low52w: 55 },
  { symbol: "0005", name: "HSBC Holdings", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 68.50, change: 0.85, changePercent: 1.26, volume: "25.8M", marketCap: "HK$1.3T", sector: "Financial", pe: 7.2, high52w: 75, low52w: 52 },
  { symbol: "2318", name: "Ping An Insurance", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 42.80, change: 0.65, changePercent: 1.54, volume: "32.5M", marketCap: "HK$780B", sector: "Financial", pe: 5.8, high52w: 52, low52w: 35 },
  { symbol: "0941", name: "China Mobile", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 72.40, change: 0.85, changePercent: 1.19, volume: "15.8M", marketCap: "HK$1.6T", sector: "Telecom", pe: 9.8, high52w: 82, low52w: 60 },
  { symbol: "1810", name: "Xiaomi Corp", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 18.50, change: 0.65, changePercent: 3.64, volume: "85.2M", marketCap: "HK$462B", sector: "Technology", pe: 25.8, high52w: 22, low52w: 10 },
  { symbol: "9618", name: "JD.com HK", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 142.80, change: 4.50, changePercent: 3.25, volume: "8.5M", marketCap: "HK$438B", sector: "Consumer", pe: 12.5, high52w: 175, low52w: 95 },
  { symbol: "0388", name: "Hong Kong Exchanges", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 285.40, change: 5.80, changePercent: 2.07, volume: "3.5M", marketCap: "HK$362B", sector: "Financial", pe: 35.2, high52w: 320, low52w: 240 },
  { symbol: "2020", name: "Anta Sports", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 85.40, change: 2.30, changePercent: 2.77, volume: "5.8M", marketCap: "HK$232B", sector: "Consumer", pe: 22.5, high52w: 105, low52w: 62 },
  { symbol: "0883", name: "CNOOC Ltd", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 15.80, change: 0.35, changePercent: 2.27, volume: "52.5M", marketCap: "HK$710B", sector: "Energy", pe: 5.2, high52w: 18, low52w: 12 },
  { symbol: "3968", name: "China Merchants Bank", exchange: "HKEX", country: "Hong Kong", flag: "🇭🇰", price: 38.50, change: 0.65, changePercent: 1.72, volume: "18.5M", marketCap: "HK$965B", sector: "Financial", pe: 5.8, high52w: 45, low52w: 30 },

  // ============================================================
  // 🇩🇪 XETRA — 20+ stocks
  // ============================================================
  { symbol: "SAP", name: "SAP SE", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 178.92, change: 2.34, changePercent: 1.33, volume: "3.2M", marketCap: "€220B", sector: "Technology", pe: 38.5, high52w: 195, low52w: 120 },
  { symbol: "SIE", name: "Siemens AG", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 178.50, change: 3.20, changePercent: 1.83, volume: "2.8M", marketCap: "€142B", sector: "Industrial", pe: 18.5, high52w: 195, low52w: 140 },
  { symbol: "ALV", name: "Allianz SE", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 262.40, change: 4.80, changePercent: 1.86, volume: "1.8M", marketCap: "€105B", sector: "Financial", pe: 12.5, high52w: 280, low52w: 210 },
  { symbol: "DTE", name: "Deutsche Telekom", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 24.80, change: 0.35, changePercent: 1.43, volume: "12.5M", marketCap: "€124B", sector: "Telecom", pe: 15.8, high52w: 28, low52w: 18 },
  { symbol: "BAS", name: "BASF SE", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 48.50, change: -0.65, changePercent: -1.32, volume: "5.2M", marketCap: "€43B", sector: "Materials", pe: 22.5, high52w: 55, low52w: 38 },
  { symbol: "BMW", name: "BMW AG", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 98.40, change: 1.80, changePercent: 1.86, volume: "2.5M", marketCap: "€62B", sector: "Automotive", pe: 6.2, high52w: 112, low52w: 78 },
  { symbol: "RHM", name: "Rheinmetall AG", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 485.60, change: 18.40, changePercent: 3.94, volume: "1.2M", marketCap: "€22B", sector: "Defence", pe: 28.5, high52w: 540, low52w: 250 },
  { symbol: "VOW3", name: "Volkswagen AG", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 118.40, change: 2.20, changePercent: 1.89, volume: "2.5M", marketCap: "€60B", sector: "Automotive", pe: 3.8, high52w: 135, low52w: 92 },
  { symbol: "MBG", name: "Mercedes-Benz Group", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 68.50, change: 1.20, changePercent: 1.78, volume: "3.8M", marketCap: "€72B", sector: "Automotive", pe: 5.2, high52w: 78, low52w: 52 },
  { symbol: "ADS", name: "Adidas AG", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 228.40, change: 5.80, changePercent: 2.60, volume: "1.8M", marketCap: "€42B", sector: "Consumer", pe: 52.5, high52w: 260, low52w: 155 },
  { symbol: "MUV2", name: "Munich RE", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 448.50, change: 6.20, changePercent: 1.40, volume: "0.8M", marketCap: "€60B", sector: "Financial", pe: 12.5, high52w: 480, low52w: 350 },
  { symbol: "DBK", name: "Deutsche Bank", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 14.85, change: 0.32, changePercent: 2.20, volume: "12.5M", marketCap: "€30B", sector: "Financial", pe: 5.8, high52w: 17, low52w: 10 },
  { symbol: "HEN3", name: "Henkel AG", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 78.40, change: 1.20, changePercent: 1.55, volume: "1.2M", marketCap: "€33B", sector: "Consumer", pe: 18.5, high52w: 85, low52w: 62 },
  { symbol: "IFX", name: "Infineon Technologies", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 32.50, change: 0.85, changePercent: 2.69, volume: "8.5M", marketCap: "€42B", sector: "Technology", pe: 22.5, high52w: 42, low52w: 25 },
  { symbol: "EOAN", name: "E.ON SE", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 12.85, change: 0.15, changePercent: 1.18, volume: "12.5M", marketCap: "€34B", sector: "Utilities", pe: 15.8, high52w: 14, low52w: 10 },
  { symbol: "RWE", name: "RWE AG", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 32.40, change: 0.45, changePercent: 1.41, volume: "5.2M", marketCap: "€24B", sector: "Utilities", pe: 12.5, high52w: 42, low52w: 28 },
  { symbol: "AIR", name: "Airbus SE", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 148.50, change: 3.80, changePercent: 2.63, volume: "2.5M", marketCap: "€118B", sector: "Defence", pe: 28.5, high52w: 172, low52w: 120 },
  { symbol: "DTG", name: "Daimler Truck", exchange: "XETRA", country: "Germany", flag: "🇩🇪", price: 38.50, change: 0.85, changePercent: 2.26, volume: "3.2M", marketCap: "€32B", sector: "Automotive", pe: 8.5, high52w: 45, low52w: 28 },
];

// Keep backward compat
export const trendingStocks = allStocks;

export const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 68432.18, change: 1245.67, changePercent: 1.85, volume: "$42.3B", marketCap: "$1.34T" },
  { symbol: "ETH", name: "Ethereum", price: 3654.82, change: -45.23, changePercent: -1.22, volume: "$18.7B", marketCap: "$439B" },
  { symbol: "SOL", name: "Solana", price: 178.45, change: 8.92, changePercent: 5.26, volume: "$4.2B", marketCap: "$80B" },
  { symbol: "BNB", name: "Binance Coin", price: 612.30, change: 12.45, changePercent: 2.08, volume: "$2.1B", marketCap: "$94B" },
  { symbol: "XRP", name: "Ripple", price: 0.628, change: 0.035, changePercent: 5.90, volume: "$1.8B", marketCap: "$34B" },
  { symbol: "ADA", name: "Cardano", price: 0.485, change: -0.012, changePercent: -2.41, volume: "$0.8B", marketCap: "$17B" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.142, change: 0.008, changePercent: 5.97, volume: "$1.2B", marketCap: "$20B" },
  { symbol: "DOT", name: "Polkadot", price: 7.85, change: 0.32, changePercent: 4.25, volume: "$0.5B", marketCap: "$10B" },
  { symbol: "MATIC", name: "Polygon", price: 0.785, change: 0.042, changePercent: 5.65, volume: "$0.6B", marketCap: "$7.3B" },
  { symbol: "AVAX", name: "Avalanche", price: 38.50, change: 1.85, changePercent: 5.05, volume: "$0.8B", marketCap: "$14B" },
];

export const sectorHeatmapData = [
  { sector: "Technology", change: 2.14, weight: 28 },
  { sector: "Financial", change: -0.45, weight: 18 },
  { sector: "Energy", change: 1.23, weight: 12 },
  { sector: "Healthcare", change: 0.87, weight: 14 },
  { sector: "Consumer", change: -1.12, weight: 10 },
  { sector: "Industrial", change: 0.34, weight: 8 },
  { sector: "Materials", change: -0.67, weight: 5 },
  { sector: "Utilities", change: 0.12, weight: 5 },
  { sector: "Automotive", change: 1.58, weight: 8 },
  { sector: "Defence", change: 3.24, weight: 7 },
  { sector: "Telecom", change: 0.92, weight: 6 },
  { sector: "Real Estate", change: -0.28, weight: 4 },
  { sector: "Pharma", change: 1.15, weight: 6 },
  { sector: "FMCG", change: -0.32, weight: 5 },
  { sector: "IT Services", change: 1.45, weight: 7 },
  { sector: "Media", change: 0.68, weight: 3 },
];

export function generateChartData(days: number) {
  const data = [];
  let price = 150 + Math.random() * 100;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const open = price;
    const volatility = price * 0.03;
    const change = (Math.random() - 0.48) * volatility;
    price = Math.max(price + change, 10);
    const high = Math.max(open, price) + Math.random() * volatility * 0.5;
    const low = Math.min(open, price) - Math.random() * volatility * 0.5;
    const volume = Math.floor(5000000 + Math.random() * 15000000);
    data.push({
      date: new Date(now - i * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      timestamp: now - i * 86400000,
      open: +open.toFixed(2),
      close: +price.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      volume,
      ma20: 0,
      ma50: 0,
    });
  }
  for (let i = 0; i < data.length; i++) {
    if (i >= 19) data[i].ma20 = +(data.slice(i - 19, i + 1).reduce((s, d) => s + d.close, 0) / 20).toFixed(2);
    if (i >= 49) data[i].ma50 = +(data.slice(i - 49, i + 1).reduce((s, d) => s + d.close, 0) / 50).toFixed(2);
  }
  return data;
}

export const marketIndices = [
  { name: "Nifty 50", value: 22456.80, change: 0.92, flag: "🇮🇳" },
  { name: "Sensex", value: 73852.94, change: 0.85, flag: "🇮🇳" },
  { name: "Dow Jones", value: 39150.33, change: 0.85, flag: "🇺🇸" },
  { name: "Nasdaq", value: 16742.39, change: 1.54, flag: "🇺🇸" },
  { name: "S&P 500", value: 5234.18, change: 1.12, flag: "🇺🇸" },
  { name: "Nikkei", value: 39523.55, change: -0.89, flag: "🇯🇵" },
  { name: "Hang Seng", value: 18963.68, change: 1.23, flag: "🇭🇰" },
  { name: "Gold", value: 2345.50, change: 0.45, flag: "🪙" },
  { name: "Silver", value: 28.50, change: 1.25, flag: "🥈" },
  { name: "Crude Oil", value: 85.60, change: 0.75, flag: "🛢️" },
  { name: "Bitcoin", value: 68432.18, change: 1.85, flag: "₿" },
  { name: "Ethereum", value: 3654.82, change: -1.22, flag: "Ξ" },
  { name: "USDINR", value: 83.45, change: -0.12, flag: "💵" },
  { name: "EURUSD", value: 1.08, change: 0.25, flag: "💶" },
  { name: "VIX", value: 14.20, change: -2.50, flag: "📉" },
];
