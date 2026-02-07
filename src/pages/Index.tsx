import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import Hero from '@/components/Hero';
import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { posts, loading, error, stripHtml } = useBlogPosts();
  const navigate = useNavigate();

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

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        <div className="grid gap-4 md:gap-6">
          {posts.map((post, i) => (
            <BlogCard
              key={post.id}
              post={post}
              index={i}
              stripHtml={stripHtml}
              onClick={() => navigate(`/post/${encodeURIComponent(post.title)}`)}
            />
          ))}
        </div>

        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground font-mono">
              ✦ {posts.length} posts loaded automatically from Blogspot ✦
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Index;
