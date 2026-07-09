-- Alert types enum
CREATE TYPE public.alert_type AS ENUM ('price_above', 'price_below', 'sma_crossover_bullish', 'sma_crossover_bearish');

-- User alerts table
CREATE TABLE public.user_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL,
  alert_type public.alert_type NOT NULL,
  threshold NUMERIC,
  sma_fast INTEGER DEFAULT 20,
  sma_slow INTEGER DEFAULT 50,
  active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_alerts_user ON public.user_alerts(user_id);
CREATE INDEX idx_user_alerts_active ON public.user_alerts(active, symbol);

ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own alerts" ON public.user_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own alerts" ON public.user_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own alerts" ON public.user_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own alerts" ON public.user_alerts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role manages alerts" ON public.user_alerts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER trg_user_alerts_updated_at
  BEFORE UPDATE ON public.user_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_id UUID REFERENCES public.user_alerts(id) ON DELETE SET NULL,
  symbol TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'alert',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role manages notifications" ON public.notifications FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enable cron + http extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;