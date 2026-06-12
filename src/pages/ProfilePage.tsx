import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import SEO from '@/components/SEO';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Users, UserPlus, UserMinus, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { profileSchema } from '@/lib/validation';
import { showDbError } from '@/lib/db-errors';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  age: number | null;
  place: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  user_id: string;
  author_name: string | null;
}

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stripHtml } = useBlogPosts();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ display_name: '', bio: '', age: '', place: '' });

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);

    const [profileRes, postsRes, followersRes, followingRes, likesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId!).maybeSingle(),
      supabase.from('blog_posts').select('*').eq('user_id', userId!).eq('published', true).order('created_at', { ascending: false }),
      supabase.from('follows').select('id', { count: 'exact' }).eq('following_id', userId!),
      supabase.from('follows').select('id', { count: 'exact' }).eq('follower_id', userId!),
      supabase.from('post_likes').select('id', { count: 'exact' }).in('post_id',
        (await supabase.from('blog_posts').select('id').eq('user_id', userId!)).data?.map(p => p.id) || []
      ),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data as Profile);
      setEditForm({
        display_name: profileRes.data.display_name || '',
        bio: (profileRes.data as any).bio || '',
        age: (profileRes.data as any).age?.toString() || '',
        place: (profileRes.data as any).place || '',
      });
    }
    if (postsRes.data) setPosts(postsRes.data as UserPost[]);
    setFollowerCount(followersRes.count || 0);
    setFollowingCount(followingRes.count || 0);
    setLikeCount(likesRes.count || 0);

    // Check if current user follows this profile
    if (user && userId && user.id !== userId) {
      const { data } = await supabase.from('follows')
        .select('id').eq('follower_id', user.id).eq('following_id', userId).maybeSingle();
      setIsFollowing(!!data);
    }

    setLoading(false);
  };

  const handleFollow = async () => {
    if (!user) { navigate('/auth'); return; }
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', userId!);
      setIsFollowing(false);
      setFollowerCount(c => c - 1);
      toast.success('Unfollow ho gaya!');
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: userId! });
      setIsFollowing(true);
      setFollowerCount(c => c + 1);
      toast.success('Follow ho gaya!');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const parsed = profileSchema.safeParse(editForm);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    const p = parsed.data;

    const { error } = await supabase.from('profiles').update({
      display_name: p.display_name?.trim() || null,
      bio: p.bio?.trim() || null,
      age: p.age,
      place: p.place?.trim() || null,
    } as any).eq('user_id', user.id);

    if (error) {
      showDbError('Profile save', error);
    } else {
      toast.success('Profile update ho gaya!');
      setEditing(false);
      loadProfile();
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;
    if (!confirm('Kya aap sach mein yeh post delete karna chahte hain?')) return;

    // Defense-in-depth: verify ownership server-side before delete.
    const { data: ownerRow } = await supabase
      .from('blog_posts')
      .select('user_id')
      .eq('id', postId)
      .maybeSingle();
    if (!ownerRow || ownerRow.user_id !== user.id) {
      toast.error('Aap is post ko delete nahi kar sakte');
      return;
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (error) showDbError('Delete', error);
    else { toast.success('Post delete ho gaya!'); loadProfile(); }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-muted-foreground">Profile nahi mila</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={`${profile.display_name || 'Bhakt'} ka profile | Radhe Radhe`}
        description={profile.bio ? profile.bio.slice(0, 155) : `${profile.display_name || 'Bhakt'} ke posts aur bhakti journey Radhe Radhe par.`}
        path={`/profile/${profile.user_id}`}
      />
      <Navbar />
      <main className="pt-24 pb-20 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden mb-8"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-glow-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-3xl font-display font-bold text-primary shrink-0">
                {(profile.display_name || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                {editing ? (
                  <input
                    value={editForm.display_name}
                    onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))}
                    className="text-2xl font-display font-bold bg-secondary border border-border rounded-xl px-3 py-1 text-foreground w-full mb-2"
                    placeholder="Tumhara naam"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {profile.display_name || 'Unknown'}
                  </h1>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground font-mono">
                  {(profile as any).place && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {(profile as any).place}
                    </span>
                  )}
                  {(profile as any).age && (
                    <span>{(profile as any).age} saal</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(profile.created_at).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long' })} se
                  </span>
                </div>
              </div>

              {isOwnProfile ? (
                <button
                  onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {editing ? 'Save' : 'Edit Profile'}
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-colors font-mono shrink-0 ${
                    isFollowing
                      ? 'bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {isFollowing ? <UserMinus className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>

            {/* Bio */}
            {editing ? (
              <textarea
                value={editForm.bio}
                onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 mb-4 min-h-[80px]"
                placeholder="Apne baare mein kuch likho..."
              />
            ) : (
              (profile as any).bio && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{(profile as any).bio}</p>
              )
            )}

            {editing && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input
                  value={editForm.age}
                  onChange={e => setEditForm(f => ({ ...f, age: e.target.value }))}
                  type="number"
                  className="px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  placeholder="Age"
                />
                <input
                  value={editForm.place}
                  onChange={e => setEditForm(f => ({ ...f, place: e.target.value }))}
                  className="px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  placeholder="Place / City"
                />
              </div>
            )}

            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="text-sm text-muted-foreground hover:text-foreground font-mono mr-3"
              >
                Cancel
              </button>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{posts.length}</div>
                <div className="text-xs text-muted-foreground font-mono">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{followerCount}</div>
                <div className="text-xs text-muted-foreground font-mono">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{followingCount}</div>
                <div className="text-xs text-muted-foreground font-mono">Following</div>
              </div>
              <div className="text-center flex items-center gap-1">
                <Heart className="w-4 h-4 text-destructive" />
                <div className="text-lg font-bold text-foreground">{likeCount}</div>
                <div className="text-xs text-muted-foreground font-mono ml-1">Likes</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Posts */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase">
            {isOwnProfile ? 'Meri Posts' : `${profile.display_name || 'User'} ki Posts`}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-10 font-mono text-sm">Abhi koi post nahi hai</p>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {posts.map((post, i) => (
              <BlogCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  published: post.created_at,
                  url: '',
                  author: post.author_name || '',
                  isLocal: true,
                  user_id: post.user_id,
                }}
                index={i}
                stripHtml={stripHtml}
                isOwner={isOwnProfile}
                onEdit={() => navigate(`/edit/${post.id}`)}
                onDelete={() => handleDelete(post.id)}
                onClick={() => navigate(`/post/local/${post.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
