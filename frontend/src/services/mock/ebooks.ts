export interface Ebook {
  id: string;
  title: string;
  desc: string;
  category: string;
  url: string;
  cta: string;
}

export const ebooks: Ebook[] = [
  {
    id: "eb1",
    title: "Saving and Investing: A Roadmap to Your Financial Security",
    desc: "SEC-backed investor education guide covering budgeting, saving, compounding, mutual funds, stocks, and retirement planning.",
    category: "BEGINNER",
    url: "#",
    cta: "📥 Download PDF",
  },
  {
    id: "eb2",
    title: "Trading Basics: Understanding the Different Ways to Buy and Sell Stock",
    desc: "Explains market orders, limit orders, stop-loss, execution methods, and trading mechanics.",
    category: "TRADING",
    url: "#",
    cta: "📥 Download PDF",
  },
  {
    id: "eb3",
    title: "Beginner’s Guide to Investing",
    desc: "Complete starter guide for first-time investors covering risk, diversification, and long-term investing.",
    category: "INVESTING",
    url: "#",
    cta: "📥 Open Guide",
  },
  {
    id: "eb4",
    title: "Saving and Investing for Students",
    desc: "Smart money management guide tailored for students and young earners.",
    category: "STUDENTS",
    url: "#",
    cta: "📥 Download PDF",
  },
  {
    id: "eb5",
    title: "Saving and Investing for Teachers",
    desc: "Financial planning resource designed for educators, retirement planning, and wealth growth.",
    category: "TEACHERS",
    url: "#",
    cta: "📥 Download Resource",
  },
];
