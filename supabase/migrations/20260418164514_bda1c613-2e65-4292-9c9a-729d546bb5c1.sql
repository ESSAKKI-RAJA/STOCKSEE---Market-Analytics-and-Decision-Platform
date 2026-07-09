
DROP POLICY IF EXISTS "Service role can manage stock history" ON public.stock_history;
DROP POLICY IF EXISTS "Service role can manage analysis" ON public.stock_analysis_cache;

CREATE POLICY "Service role manages history"
  ON public.stock_history FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role manages analysis"
  ON public.stock_analysis_cache FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
