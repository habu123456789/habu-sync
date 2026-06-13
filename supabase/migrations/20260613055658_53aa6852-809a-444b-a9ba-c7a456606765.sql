-- Revoke column-level SELECT on sensitive profile fields from anonymous users
REVOKE SELECT (age, place) ON public.profiles FROM anon;

-- Also ensure base SELECT is still granted on non-sensitive columns to anon
GRANT SELECT (id, user_id, display_name, bio, avatar_url, created_at) ON public.profiles TO anon;