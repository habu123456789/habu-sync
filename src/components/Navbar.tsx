import { motion } from 'framer-motion';
import { BookOpen, PenLine, LogIn, LogOut, User, Sun, Moon, Droplets, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Habu <span className="text-primary">Says</span>
          </span>
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => {
              const order = ['dark', 'light', 'liquid-glass', 'cyberpunk'];
              const next = order[(order.indexOf(theme || 'dark') + 1) % order.length];
              setTheme(next);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full glass text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : theme === 'liquid-glass' ? <Droplets className="w-4 h-4" /> : theme === 'cyberpunk' ? <Zap className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About</span>
          </button>
          {user && (
            <button
              onClick={() => navigate(`/profile/${user.id}`)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}
          {user && (
            <button
              onClick={() => navigate('/write')}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Likho</span>
            </button>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}

          <a
            href="https://habu-says.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono hidden md:block"
          >
            Blogspot ↗
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
