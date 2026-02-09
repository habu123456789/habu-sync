import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';

const EditPostPage = () => {
  const { postId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setSocialLink((data as any).social_link || '');
        } else {
          toast.error('Post nahi mila!');
          navigate('/');
        }
        setLoading(false);
      });
  }, [postId]);

  if (authLoading || loading) {
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

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title aur content dono zaroori hain!');
      return;
    }

    if (title.trim().length > 200) {
      toast.error('Title 200 characters se zyada nahi ho sakta!');
      return;
    }

    if (content.trim().length > 50000) {
      toast.error('Content bohot lamba hai!');
      return;
    }

    const trimmedLink = socialLink.trim();
    if (trimmedLink && !/^https?:\/\//.test(trimmedLink)) {
      toast.error('Social link ek valid URL hona chahiye (https:// se shuru hona chahiye)!');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('blog_posts')
      .update({
        title: title.trim(),
        content: content.trim(),
        social_link: socialLink.trim() || null,
      } as any)
      .eq('id', postId!);

    if (error) {
      toast.error('Update nahi ho paya: ' + error.message);
    } else {
      toast.success('Post update ho gaya!');
      navigate(`/post/local/${postId}`);
    }
    setSaving(false);
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
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Wapas jao
          </button>

          <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-glow-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
                Post Edit Karo ✏️
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-lg font-display"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none leading-relaxed"
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

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Karo'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default EditPostPage;
