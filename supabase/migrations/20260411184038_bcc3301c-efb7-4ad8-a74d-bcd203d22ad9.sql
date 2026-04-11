
CREATE TABLE public.naam_jap_counts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  deity_name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, deity_name)
);

ALTER TABLE public.naam_jap_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jap counts"
ON public.naam_jap_counts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jap counts"
ON public.naam_jap_counts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jap counts"
ON public.naam_jap_counts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jap counts"
ON public.naam_jap_counts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_naam_jap_counts_updated_at
BEFORE UPDATE ON public.naam_jap_counts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
