export interface Platform {
  id: string;
  name: string;
  tag: string;
  desc: string;
  url: string;
  featured: boolean;
  cta: string;
}

export const platforms: Platform[] = [
  {
    id: "pl1",
    name: "Varsity by Zerodha",
    tag: "BEST FOR INDIAN MARKETS",
    desc: "India’s best structured free stock market education platform from basics to advanced derivatives.",
    url: "https://zerodha.com/varsity/",
    featured: true,
    cta: "Visit Platform ↗",
  },
  {
    id: "pl2",
    name: "Investopedia",
    tag: "BEST FOR US + GLOBAL BASICS",
    desc: "World-famous investing dictionary and learning platform from beginner to expert.",
    url: "https://www.investopedia.com/",
    featured: false,
    cta: "Visit Platform ↗",
  },
  {
    id: "pl3",
    name: "TradingView Education",
    tag: "BEST FOR TECHNICAL ANALYSIS",
    desc: "Learn charts, indicators, price action, and global market behavior.",
    url: "https://www.tradingview.com/",
    featured: false,
    cta: "Visit Platform ↗",
  },
  {
    id: "pl4",
    name: "Khan Academy – Finance & Capital Markets",
    tag: "BEST FOR FUNDAMENTALS",
    desc: "Excellent lessons on banking, bonds, finance, and market structure.",
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance",
    featured: false,
    cta: "Visit Platform ↗",
  },
  {
    id: "pl5",
    name: "Coursera",
    tag: "BEST FOR ADVANCED LEARNING",
    desc: "Courses from Yale, Wharton, and top universities covering valuation, investing, and portfolio theory.",
    url: "https://www.coursera.org/",
    featured: false,
    cta: "Visit Platform ↗",
  },
];
