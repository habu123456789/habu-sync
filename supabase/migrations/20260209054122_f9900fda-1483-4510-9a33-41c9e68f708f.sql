
-- 1. Fix handle_new_user() with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_display_name TEXT;
BEGIN
  user_display_name := COALESCE(
    SUBSTRING(NEW.raw_user_meta_data->>'display_name', 1, 100),
    SUBSTRING(split_part(NEW.email, '@', 1), 1, 100)
  );
  user_display_name := TRIM(user_display_name);
  IF user_display_name = '' OR user_display_name IS NULL THEN
    user_display_name := 'User';
  END IF;

  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, user_display_name);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Add length constraints to blog_posts
ALTER TABLE public.blog_posts
ADD CONSTRAINT title_length_check CHECK (char_length(title) BETWEEN 1 AND 200),
ADD CONSTRAINT content_length_check CHECK (char_length(content) BETWEEN 1 AND 50000),
ADD CONSTRAINT author_name_length_check CHECK (author_name IS NULL OR char_length(author_name) BETWEEN 1 AND 100),
ADD CONSTRAINT social_link_length_check CHECK (social_link IS NULL OR char_length(social_link) <= 500);

-- 3. Add length constraint to profiles
ALTER TABLE public.profiles
ADD CONSTRAINT display_name_length_check CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 100);

-- 4. Validate social_link must be a URL (not email)
ALTER TABLE public.blog_posts
ADD CONSTRAINT social_link_url_check CHECK (social_link IS NULL OR social_link ~ '^https?://');

-- 5. Restrict anonymous inserts - require authentication
DROP POLICY IF EXISTS "Anyone can create posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can create posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
