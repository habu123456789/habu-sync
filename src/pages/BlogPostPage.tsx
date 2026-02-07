import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isLocal = location.pathname.includes('/post/local/');
  const { posts, loading: blogLoading } = useBlogPosts();

  const [localPost, setLocalPost] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(isLocal);

  useEffect(() => {
    if (isLocal && postId) {
      supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single()
        .then(async ({ data }) => {
          if (data) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', data.user_id)
              .single();
            setLocalPost({ ...data, author: profile?.display_name || 'User' });
          }
          setLocalLoading(false);
        });
    }
  }, [isLocal, postId]);

  const loading = isLocal ? localLoading : blogLoading;

  const post = isLocal
    ? localPost
      ? {
          title: localPost.title,
          content: localPost.content,
          published: localPost.created_at,
          url: '',
          author: localPost.author,
        }
      : null
    : posts.find((p) => encodeURIComponent(p.title) === postId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Navbar />
        <p className="text-muted-foreground">Post nahi mila</p>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">
          ← Wapas jao
        </button>
      </div>
    );
  }

  const date = new Date(post.published).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Wapas jao
          </button>

          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-glow-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-glow-accent/8 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{date}</span>
                <span className="flex items-center gap-1.5"><User className="w-3 h-3" />{post.author}</span>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />Original
                  </a>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-primary glow-text mb-8">
                {post.title}
              </h1>

              <div
                className="text-foreground/90 leading-[1.8] text-sm md:text-base whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BlogPostPage;
