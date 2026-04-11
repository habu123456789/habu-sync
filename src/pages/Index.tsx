import { useNavigate } from 'react-router-dom';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Hero from '@/components/Hero';
import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HinglishClock from '@/components/HinglishClock';
import NaamJapCounter from '@/components/NaamJapCounter';
import DailyGitaShlok from '@/components/DailyGitaShlok';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

const Index = () => {
  const { posts: userPosts, loading: userPostsLoading, refetch } = useUserPosts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (postId: string) => {
    if (!confirm('Kya aap sach mein yeh post delete karna chahte hain?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (error) {
      toast.error('Delete nahi ho paya: ' + error.message);
    } else {
      toast.success('Post delete ho gaya!');
      refetch();
    }
  };

  const allPosts = userPosts
    .map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      published: p.created_at,
      url: '',
      author: p.author_name || '',
      isLocal: true as const,
      user_id: p.user_id,
    }))
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Daily Gita Shlok */}
      <section className="max-w-4xl mx-auto px-4">
        <DailyGitaShlok />
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20 mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase">
            Latest Posts
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </motion.div>

        {userPostsLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        <div className="grid gap-4 md:gap-6">
          {allPosts.map((post, i) => (
            <BlogCard
              key={post.id}
              post={post}
              index={i}
              stripHtml={stripHtml}
              isOwner={!!user && post.user_id === user.id}
              onEdit={() => navigate(`/edit/${post.id}`)}
              onDelete={() => handleDelete(post.id)}
              onClick={() => navigate(`/post/local/${post.id}`)}
            />
          ))}
        </div>

        {!userPostsLoading && <HinglishClock />}
        <NaamJapCounter />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
