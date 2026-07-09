CREATE TABLE IF NOT EXISTS public.company_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  ceo text,
  founded text,
  headquarters text,
  employees text,
  executives jsonb DEFAULT '[]'::jsonb,
  segments jsonb DEFAULT '[]'::jsonb,
  revenue_drivers jsonb DEFAULT '[]'::jsonb,
  industry_position text,
  global_presence jsonb DEFAULT '[]'::jsonb,
  summary text,
  source text DEFAULT 'curated',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company profiles"
  ON public.company_profiles FOR SELECT
  USING (true);

CREATE POLICY "Service role manages company profiles"
  ON public.company_profiles FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_company_profiles_symbol ON public.company_profiles(symbol);