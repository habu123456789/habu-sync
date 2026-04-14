import { useNavigate } from 'react-router-dom';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HinglishClock from '@/components/HinglishClock';
import NaamJapCounter from '@/components/NaamJapCounter';
import DailyGitaShlok from '@/components/DailyGitaShlok';
import DailyAarti from '@/components/DailyAarti';
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

      {/* Naam Jap Counter - after shlok */}
      <section className="max-w-4xl mx-auto px-4">
        <NaamJapCounter />
      </section>

      {/* Daily Aarti */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <DailyAarti />
        <HinglishClock />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
