import { motion } from 'framer-motion';
import type { BlogPost } from '@/hooks/useBlogPosts';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import LikeButton from '@/components/LikeButton';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  onClick: () => void;
  stripHtml: (html: string) => string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BlogCard = ({ post, index, onClick, stripHtml, isOwner, onEdit, onDelete }: BlogCardProps) => {
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
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-glow-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs font-mono text-primary/60 mb-4">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
          {post.author && (
            <>
              <span className="text-primary/30">·</span>
              {post.isLocal && post.user_id ? (
                <button
                  onClick={(e) => { e.stopPropagation(); window.location.href = `/profile/${post.user_id}`; }}
                  className="text-primary/50 hover:text-primary hover:underline transition-colors"
                >
                  {post.author}
                </button>
              ) : (
                <span className="text-primary/50">{post.author}</span>
              )}
            </>
          )}
        </div>

        <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-2 group-hover:text-gradient-primary transition-all duration-300">
          {post.title}
        </h3>

        <p className="text-primary/40 leading-relaxed line-clamp-3 text-xs md:text-sm">
          {plainText}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Pura padho</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.isLocal && <LikeButton postId={post.id} />}

            {isOwner && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-mono"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
