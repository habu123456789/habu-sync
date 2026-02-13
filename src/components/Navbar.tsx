import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, PenLine, LogIn, LogOut, User, Sun, Moon, Droplets, Zap, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';

const themeOptions = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'liquid-glass', label: 'Liquid Glass', icon: Droplets },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: Zap },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentTheme = themeOptions.find(t => t.id === theme) || themeOptions[0];
  const CurrentIcon = currentTheme.icon;

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
          {/* Theme Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors"
              aria-label="Select theme"
            >
              <CurrentIcon className="w-4 h-4" />
              <span className="hidden sm:inline font-mono text-xs">{currentTheme.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${themeOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {themeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-44 rounded-xl bg-card border border-border shadow-lg z-[60] overflow-hidden"
                >
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => { setTheme(opt.id); setThemeOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-mono transition-colors ${
                          isActive
                            ? 'bg-primary/15 text-primary'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
