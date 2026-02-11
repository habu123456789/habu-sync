import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface LikeButtonProps {
  postId: string;
}

const LikeButton = ({ postId }: LikeButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLikes();
  }, [postId, user]);

  const loadLikes = async () => {
    const { count: total } = await supabase
      .from('post_likes')
      .select('id', { count: 'exact' })
      .eq('post_id', postId);
    setCount(total || 0);

    if (user) {
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      setLiked(!!data);
    }
  };

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate('/auth'); return; }
    if (loading) return;
    setLoading(true);

    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      setLiked(false);
      setCount(c => c - 1);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      setLiked(true);
      setCount(c => c + 1);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors font-mono ${
        liked
          ? 'bg-destructive/15 text-destructive'
          : 'bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10'
      }`}
    >
      <Heart className={`w-3 h-3 ${liked ? 'fill-current' : ''}`} />
      {count > 0 && <span>{count}</span>}
    </button>
  );
};

export default LikeButton;
