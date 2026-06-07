
-- 1) Profile column-level privacy: hide age & place from anon
REVOKE SELECT (age, place) ON public.profiles FROM anon;

-- 2) Profile CHECK constraints (defense-in-depth)
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_bio_length_check
    CHECK (bio IS NULL OR char_length(bio) <= 1000) NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_place_length_check
    CHECK (place IS NULL OR char_length(place) <= 100) NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_display_name_length_check
    CHECK (display_name IS NULL OR char_length(display_name) <= 100) NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_age_range_check
    CHECK (age IS NULL OR (age >= 0 AND age <= 150)) NOT VALID;

-- Validate constraints over existing data (skip rows that violate, will throw if so)
ALTER TABLE public.profiles VALIDATE CONSTRAINT profiles_bio_length_check;
ALTER TABLE public.profiles VALIDATE CONSTRAINT profiles_place_length_check;
ALTER TABLE public.profiles VALIDATE CONSTRAINT profiles_display_name_length_check;
ALTER TABLE public.profiles VALIDATE CONSTRAINT profiles_age_range_check;

-- 3) Foreign keys for referential integrity. Clean up any orphans first.
DELETE FROM public.follows
  WHERE follower_id NOT IN (SELECT id FROM auth.users)
     OR following_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.post_likes
  WHERE user_id NOT IN (SELECT id FROM auth.users);

ALTER TABLE public.follows
  ADD CONSTRAINT follows_follower_id_fkey
    FOREIGN KEY (follower_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT follows_following_id_fkey
    FOREIGN KEY (following_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.post_likes
  ADD CONSTRAINT post_likes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4) Lock down site_presence writes. Heartbeat will go through an edge function.
DROP POLICY IF EXISTS "Anyone can update presence" ON public.site_presence;
DROP POLICY IF EXISTS "Anyone can upsert presence" ON public.site_presence;
-- Public still can SELECT counts via the read policy already in place.

-- Add unique constraint on visitor_id so the edge function upsert works cleanly.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'site_presence_visitor_id_key'
      AND conrelid = 'public.site_presence'::regclass
  ) THEN
    -- Deduplicate first: keep most recent row per visitor
    DELETE FROM public.site_presence a
    USING public.site_presence b
    WHERE a.visitor_id = b.visitor_id
      AND a.last_seen < b.last_seen;
    ALTER TABLE public.site_presence
      ADD CONSTRAINT site_presence_visitor_id_key UNIQUE (visitor_id);
  END IF;
END $$;

-- 5) Revoke EXECUTE on internal trigger helper functions from API roles.
-- These are only called via triggers (run with definer privileges), never via the API.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
