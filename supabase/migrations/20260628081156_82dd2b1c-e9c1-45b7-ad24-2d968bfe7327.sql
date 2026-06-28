-- Remove the SECURITY DEFINER view; switch to column-level grants on profiles
DROP VIEW IF EXISTS public.public_profiles;

-- Reset the SELECT policy: anyone may see profiles rows, but column grants
-- decide which columns each role actually receives.
DROP POLICY IF EXISTS "Users can view own full profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profile public fields" ON public.profiles;

CREATE POLICY "Anyone can view profile public fields"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);

-- Anon: only safe columns (NO age, NO place)
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, user_id, display_name, avatar_url, bio, created_at)
  ON public.profiles TO anon;

-- Authenticated users keep full row access (needed for own-profile edit UI)
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
