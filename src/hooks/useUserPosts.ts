import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  author_name?: string;
}

export function useUserPosts() {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const userIds = [...new Set(data.map((p: any) => p.user_id).filter(Boolean))];
      let profileMap = new Map<string, string>();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', userIds);
        profileMap = new Map(
          (profiles || []).map((p: any) => [p.user_id, p.display_name])
        );
      }

      setPosts(
        data.map((p: any) => ({
          ...p,
          author_name: profileMap.get(p.user_id) || undefined,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, refetch: fetchPosts };
}
