import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ExternalLink, Pencil, Trash2, Link as LinkIcon } from 'lucide-react';
import DOMPurify from 'dompurify';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { showDbError } from '@/lib/db-errors';

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isLocal = location.pathname.includes('/post/local/');
  const { posts, loading: blogLoading } = useBlogPosts();
  const { user } = useAuth();

  const [localPost, setLocalPost] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(isLocal);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isLocal && postId) {
      supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle()
        .then(async ({ data }) => {
          if (data) {
            let authorName = (data as any).author_name || 'Guest';
            if (data.user_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('user_id', data.user_id)
                .maybeSingle();
              authorName = profile?.display_name || 'User';
            }
            setLocalPost({ ...data, author: authorName });
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
          social_link: localPost.social_link,
        }
      : null
    : posts.find((p) => encodeURIComponent(p.title) === postId);

  const isOwner = isLocal && localPost && user && localPost.user_id === user.id;

  const handleDelete = async () => {
    if (!user || !postId) return;
    if (!confirm('Kya aap sach mein yeh post delete karna chahte hain?')) return;
    setDeleting(true);

    // Defense-in-depth: verify ownership server-side before issuing delete.
    const { data: ownerRow, error: ownerErr } = await supabase
      .from('blog_posts')
      .select('user_id')
      .eq('id', postId)
      .maybeSingle();
    if (ownerErr || !ownerRow || ownerRow.user_id !== user.id) {
      toast.error('Aap is post ko delete nahi kar sakte');
      setDeleting(false);
      return;
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (error) {
      showDbError('Delete', error);
      setDeleting(false);
    } else {
      toast.success('Post delete ho gaya!');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    navigate('/');
    return null;
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
                {(post as any).social_link && (
                  <a
                    href={(post as any).social_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors"
                  >
                    <LinkIcon className="w-3 h-3" />Social
                  </a>
                )}
              </div>

              {isOwner && (
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => navigate(`/edit/${postId}`)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-mono disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}

              <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-primary glow-text mb-8">
                {post.title}
              </h1>

              <div
                className="text-foreground/90 leading-[1.8] text-sm md:text-base whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'blockquote', 'img', 'span', 'div'],
                  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class']
                }) }}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BlogPostPage;
