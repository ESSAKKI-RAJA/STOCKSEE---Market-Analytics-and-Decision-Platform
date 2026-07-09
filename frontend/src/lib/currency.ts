// Multi-currency formatter — maps exchange code to its native currency.
// Used across UI, watchlist, portfolio, and notifications so prices are always
// displayed in the symbol's native currency.

const EXCHANGE_CURRENCY: Record<string, { symbol: string; code: string; locale: string }> = {
  NSE: { symbol: "₹", code: "INR", locale: "en-IN" },
  BSE: { symbol: "₹", code: "INR", locale: "en-IN" },
  NASDAQ: { symbol: "$", code: "USD", locale: "en-US" },
  NYSE: { symbol: "$", code: "USD", locale: "en-US" },
  AMEX: { symbol: "$", code: "USD", locale: "en-US" },
  LSE: { symbol: "£", code: "GBP", locale: "en-GB" },
  XETRA: { symbol: "€", code: "EUR", locale: "de-DE" },
  EURONEXT: { symbol: "€", code: "EUR", locale: "fr-FR" },
  TSE: { symbol: "¥", code: "JPY", locale: "ja-JP" },
  HKEX: { symbol: "HK$", code: "HKD", locale: "zh-HK" },
  SSE: { symbol: "¥", code: "CNY", locale: "zh-CN" },
  ASX: { symbol: "A$", code: "AUD", locale: "en-AU" },
  TSX: { symbol: "C$", code: "CAD", locale: "en-CA" },
};

const DEFAULT = { symbol: "$", code: "USD", locale: "en-US" };

export function getCurrency(exchange?: string) {
  if (!exchange) return DEFAULT;
  return EXCHANGE_CURRENCY[exchange.toUpperCase()] || DEFAULT;
}

export function formatCurrency(price: number, exchange?: string, opts?: { compact?: boolean }): string {
  const c = getCurrency(exchange);
  const isJPY = c.code === "JPY";
  const fractionDigits = isJPY ? 0 : 2;
  if (opts?.compact && price >= 1000) {
    const formatted = new Intl.NumberFormat(c.locale, {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(price);
    return `${c.symbol}${formatted}`;
  }
  return `${c.symbol}${price.toLocaleString(c.locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function getCurrencySymbol(exchange?: string): string {
  return getCurrency(exchange).symbol;
}
