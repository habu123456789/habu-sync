import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { blogPostSchema } from '@/lib/validation';
import { showDbError } from '@/lib/db-errors';

const WritePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [socialLink, setSocialLink] = useState('');
  const [publishing, setPublishing] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handlePublish = async (asDraft: boolean) => {
    const parsed = blogPostSchema.safeParse({
      title,
      content,
      social_link: socialLink,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    const data = parsed.data;

    setPublishing(true);

    // Fetch author display name from profile
    let authorName: string | null = null;
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .maybeSingle();
    if (profile?.display_name) {
      authorName = profile.display_name;
    }

    const { error } = await supabase.from('blog_posts').insert({
      title: data.title,
      content: data.content,
      user_id: user.id,
      social_link: data.social_link || null,
      published: !asDraft,
      author_name: authorName,
    } as any);

    if (error) {
      showDbError('Post save', error);
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

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3" />
                    Social Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Instagram, Twitter, ya koi bhi social link..."
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
