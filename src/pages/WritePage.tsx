import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const WritePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [publishing, setPublishing] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handlePublish = async (asDraft: boolean) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title aur content dono zaroori hain!');
      return;
    }

    if (!user && !authorName.trim()) {
      toast.error('Apna naam likhna zaroori hai!');
      return;
    }

    setPublishing(true);
    const { error } = await supabase.from('blog_posts').insert({
      title: title.trim(),
      content: content.trim(),
      user_id: user?.id ?? null,
      author_name: user ? null : authorName.trim(),
      published: !asDraft,
    } as any);

    if (error) {
      toast.error('Post save nahi ho paya: ' + error.message);
    } else {
      toast.success(asDraft ? 'Draft save ho gaya!' : 'Post publish ho gaya!');
      navigate('/');
    }
    setPublishing(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-28 pb-20">
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

          <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-glow-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
                Naya Blog Likho ✍️
              </h2>

              <div className="space-y-6">
                {!user && (
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Apna Naam</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="Apna naam likho..."
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-lg font-display"
                    placeholder="Apni post ka title likho..."
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none leading-relaxed"
                    placeholder="Apni kahani yahan likho..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handlePublish(true)}
                    disabled={publishing}
                    className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    Draft Save Karo
                  </button>
                  <button
                    onClick={() => handlePublish(false)}
                    disabled={publishing}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Publish Karo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default WritePage;
