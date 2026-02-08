
-- Make user_id nullable for guest posts
ALTER TABLE public.blog_posts ALTER COLUMN user_id DROP NOT NULL;

-- Add author_name column for guest posts
ALTER TABLE public.blog_posts ADD COLUMN author_name text;

-- Allow anyone to insert posts (guest or authenticated)
DROP POLICY "Users can create posts" ON public.blog_posts;
CREATE POLICY "Anyone can create posts"
  ON public.blog_posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
