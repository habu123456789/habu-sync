
CREATE TABLE public.jap_daily_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

ALTER TABLE public.jap_daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily logs"
ON public.jap_daily_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
ON public.jap_daily_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
ON public.jap_daily_logs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_jap_daily_logs_updated_at
BEFORE UPDATE ON public.jap_daily_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
