
-- Add source/delay tracking to stock_prices
ALTER TABLE public.stock_prices
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS delay_label TEXT,
  ADD COLUMN IF NOT EXISTS exchange TEXT,
  ADD COLUMN IF NOT EXISTS discrepancy BOOLEAN DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS stock_prices_symbol_key ON public.stock_prices(symbol);

-- Historical OHLCV (200 days per stock)
CREATE TABLE IF NOT EXISTS public.stock_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  date DATE NOT NULL,
  open NUMERIC NOT NULL,
  high NUMERIC NOT NULL,
  low NUMERIC NOT NULL,
  close NUMERIC NOT NULL,
  volume BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(symbol, date)
);
CREATE INDEX IF NOT EXISTS stock_history_symbol_date_idx ON public.stock_history(symbol, date DESC);

ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stock history"
  ON public.stock_history FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage stock history"
  ON public.stock_history FOR ALL
  USING (true) WITH CHECK (true);

-- Cached AI analysis (10 min TTL)
CREATE TABLE IF NOT EXISTS public.stock_analysis_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  trend TEXT,
  momentum TEXT,
  risk TEXT,
  insight TEXT,
  confidence INTEGER,
  sma_20 NUMERIC,
  sma_50 NUMERIC,
  sma_200 NUMERIC,
  rsi_14 NUMERIC,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_analysis_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analysis"
  ON public.stock_analysis_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage analysis"
  ON public.stock_analysis_cache FOR ALL
  USING (true) WITH CHECK (true);
