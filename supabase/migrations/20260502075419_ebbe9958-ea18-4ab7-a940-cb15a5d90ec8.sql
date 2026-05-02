-- Table to log every page view
CREATE TABLE public.site_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views"
ON public.site_views
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read views"
ON public.site_views
FOR SELECT
TO public
USING (true);

CREATE INDEX idx_site_views_created_at ON public.site_views(created_at DESC);

-- Table to track live presence
CREATE TABLE public.site_presence (
  visitor_id text NOT NULL PRIMARY KEY,
  last_seen timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upsert presence"
ON public.site_presence
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update presence"
ON public.site_presence
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Anyone can read presence"
ON public.site_presence
FOR SELECT
TO public
USING (true);

CREATE INDEX idx_site_presence_last_seen ON public.site_presence(last_seen DESC);