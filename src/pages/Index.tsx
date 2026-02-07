import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useAuth } from '@/hooks/useAuth';
import Hero from '@/components/Hero';
import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { posts: blogspotPosts, loading, error, stripHtml } = useBlogPosts();
  const { posts: userPosts, loading: userPostsLoading } = useUserPosts();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Combine user-created published posts with blogspot posts
  const allPosts = [
    ...userPosts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      published: p.created_at,
      url: '',
      author: p.author_name || 'User',
      isLocal: true as const,
    })),
    ...blogspotPosts,
  ].sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <section className="max-w-4xl mx-auto px-4 pb-20">
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

        {(loading || userPostsLoading) && (
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
              onClick={() => {
                if ('isLocal' in post) {
                  navigate(`/post/local/${post.id}`);
                } else {
                  navigate(`/post/${encodeURIComponent(post.title)}`);
                }
              }}
            />
          ))}
        </div>

        {!loading && allPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground font-mono">
              ✦ {allPosts.length} posts — Blogspot + User posts automatically synced ✦
            </p>
          </motion.div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Index;
