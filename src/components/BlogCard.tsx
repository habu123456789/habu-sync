import { motion } from 'framer-motion';
import type { BlogPost } from '@/hooks/useBlogPosts';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  onClick: () => void;
  stripHtml: (html: string) => string;
}

const BlogCard = ({ post, index, onClick, stripHtml }: BlogCardProps) => {
  const plainText = stripHtml(post.content);
  const date = new Date(post.published).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group cursor-pointer glass glass-hover rounded-2xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-glow-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs font-mono text-primary/60 mb-4">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
          <span className="text-primary/30">·</span>
          <span className="text-primary/50">{post.author}</span>
        </div>

        <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2 group-hover:text-gradient-primary transition-all duration-300">
          {post.title}
        </h3>

        <p className="text-primary/40 leading-relaxed line-clamp-3 text-xs md:text-sm">
          {plainText}
        </p>

        <div className="mt-5 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Pura padho</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
