
CREATE POLICY "Service role can manage stock prices"
ON public.stock_prices FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
