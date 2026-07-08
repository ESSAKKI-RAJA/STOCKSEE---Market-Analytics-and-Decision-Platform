export interface Channel {
  id: string;
  name: string;
  focus: string;
  desc: string;
  url: string;
  avatar: string;
  cta: string;
}

export const channels: Channel[] = [
  {
    id: "ch1",
    name: "Investopedia",
    focus: "BEST OVERALL",
    desc: "Complete stock market education from beginner to advanced.",
    url: "https://www.youtube.com/@investopedia",
    avatar: "IV",
    cta: "▶ Watch Channel",
  },
  {
    id: "ch2",
    name: "Aswath Damodaran",
    focus: "VALUATION MASTERCLASS",
    desc: "Best source for valuation, intrinsic value, and MBA-level finance.",
    url: "https://www.youtube.com/@AswathDamodaranonValuation",
    avatar: "AD",
    cta: "▶ Watch Channel",
  },
  {
    id: "ch3",
    name: "The Plain Bagel",
    focus: "BEST FOR BEGINNERS",
    desc: "Clear explanations of investing and personal finance concepts.",
    url: "https://www.youtube.com/@ThePlainBagel",
    avatar: "PB",
    cta: "▶ Watch Channel",
  },
  {
    id: "ch4",
    name: "Zerodha Varsity",
    focus: "STRUCTURED LEARNING",
    desc: "Indian markets education from basics to advanced.",
    url: "https://www.youtube.com/@ZerodhaVarsity",
    avatar: "ZV",
    cta: "▶ Watch Channel",
  },
  {
    id: "ch5",
    name: "Patrick Boyle",
    focus: "PRO MARKET THINKING",
    desc: "Deep finance, hedge funds, macroeconomics, and market mechanics.",
    url: "https://www.youtube.com/@PatrickBoyleOnFinance",
    avatar: "PB",
    cta: "▶ Watch Channel",
  },
];
