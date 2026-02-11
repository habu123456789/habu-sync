import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset link tumhare email pe bhej diya hai!');
        setMode('login');
      }
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Login successful!');
        navigate('/');
      }
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Check your email to verify your account!');
      }
    }
    setLoading(false);
  };

  const titles = {
    login: 'Wapas aao',
    signup: 'Naya account',
    forgot: 'Password bhul gaye?',
  };

  const subtitles = {
    login: 'Apne account mein login karo',
    signup: 'Signup karke blog likhna shuru karo',
    forgot: 'Email daalo, hum reset link bhej denge',
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-glow-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                {titles[mode]}
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                {subtitles[mode]}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="Tumhara naam"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {mode === 'login' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-primary hover:underline font-mono"
                    >
                      Password bhul gaye?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading
                    ? '...'
                    : mode === 'login'
                    ? 'Login'
                    : mode === 'signup'
                    ? 'Sign Up'
                    : 'Reset Link Bhejo'}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {mode === 'login' && (
                  <>
                    Account nahi hai?{' '}
                    <button onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">
                      Sign Up
                    </button>
                  </>
                )}
                {mode === 'signup' && (
                  <>
                    Pehle se account hai?{' '}
                    <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                      Login
                    </button>
                  </>
                )}
                {mode === 'forgot' && (
                  <>
                    Yaad aa gaya?{' '}
                    <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                      Login
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
