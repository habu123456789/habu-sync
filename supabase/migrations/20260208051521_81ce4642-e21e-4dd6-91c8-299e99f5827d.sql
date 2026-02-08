
-- Add social link column for optional social account reference
ALTER TABLE public.blog_posts ADD COLUMN social_link text;

-- Allow post authors (authenticated) to update and delete their own posts (already exists)
-- Allow guest authors to delete/update by matching author_name (we'll handle this via app logic)
