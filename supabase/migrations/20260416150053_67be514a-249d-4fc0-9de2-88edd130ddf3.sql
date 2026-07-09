
CREATE TABLE public.stock_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  price NUMERIC NOT NULL,
  change NUMERIC NOT NULL DEFAULT 0,
  change_percent NUMERIC NOT NULL DEFAULT 0,
  volume TEXT,
  market_cap TEXT,
  high_52w NUMERIC,
  low_52w NUMERIC,
  pe NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol)
);

ALTER TABLE public.stock_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stock prices"
ON public.stock_prices FOR SELECT
TO anon, authenticated
USING (true);
