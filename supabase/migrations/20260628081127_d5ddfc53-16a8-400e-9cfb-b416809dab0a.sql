-- 1. Profiles: lock down age & place
-- Drop the permissive "anyone can view" policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Only the profile owner can read their full row (incl. age, place)
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Revoke anonymous direct access to the table
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Public-safe view exposing only non-sensitive columns
-- Uses default (security definer-style) view semantics so anonymous
-- visitors can still see display_name/avatar/bio for blog authors etc.
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT id, user_id, display_name, avatar_url, bio, created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;
GRANT ALL  ON public.public_profiles TO service_role;

COMMENT ON VIEW public.public_profiles IS
  'Public-safe projection of profiles. Excludes age and place. Read by clients for any user; full profiles table is owner-only.';

-- 2. site_views: remove anon INSERT policy
-- Inserts must now go through the presence-heartbeat edge function (service role).
DROP POLICY IF EXISTS "Anyone can insert views" ON public.site_views;
REVOKE INSERT ON public.site_views FROM anon, authenticated;
GRANT ALL ON public.site_views TO service_role;
