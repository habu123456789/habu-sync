import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PenLine, LogIn, LogOut, User, Palette, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { flushNaamJapBeforeLogout } from '@/lib/naam-jap-sync';


const themeOptions = [
  { value: 'liquid', label: 'Liquid 💧' },
  { value: 'liquid-dark', label: 'Liquid Dark' },
  { value: 'light', label: 'Rose' },
  { value: 'sunrise', label: 'Yellow' },
  { value: 'ocean', label: 'Blue' },
  { value: 'bhagwa', label: 'Bhagwa' },
  { value: 'krishna', label: 'Krishna' },
  { value: 'forest', label: 'Forest' },
  { value: 'lotus', label: 'Lotus' },
  { value: 'brutal', label: 'Brutal 🖤' },
  { value: 'brutal-paper', label: 'Brutal Paper 📜' },
  { value: 'nb-light', label: 'NB Light ☀️' },
  { value: 'nb-dark', label: 'NB Dark 🌙' },
  { value: 'dark', label: 'Dark' },

] as const;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [blackMode, setBlackMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('black-mode') === '1';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (blackMode) root.classList.add('black-mode');
    else root.classList.remove('black-mode');
    localStorage.setItem('black-mode', blackMode ? '1' : '0');
  }, [blackMode]);


  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await flushNaamJapBeforeLogout();
      await signOut();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const currentThemeIndex = Math.max(themeOptions.findIndex((option) => option.value === theme), 0);
  const currentThemeLabel = themeOptions[currentThemeIndex]?.label ?? 'Theme';

  const cycleTheme = () => {
    const nextTheme = themeOptions[(currentThemeIndex + 1) % themeOptions.length];
    setTheme(nextTheme.value);
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
          <span className="font-display font-bold text-lg text-foreground leading-tight block">
            Habu.in&nbsp;by
            <span className="block text-[10px] font-normal text-muted-foreground">Narendrasainiii</span>
          </span>
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden lg:flex items-center gap-1 rounded-full glass p-1 max-w-md overflow-x-auto scrollbar-hide">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`px-2 py-1.5 rounded-full text-[11px] font-mono transition-colors whitespace-nowrap ${
                  theme === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={cycleTheme}
            className="flex lg:hidden items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors"
            aria-label="Change theme"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">{currentThemeLabel}</span>
          </button>
          <button
            onClick={() => setBlackMode((v) => !v)}
            aria-label={blackMode ? 'Disable black mode' : 'Enable black mode'}
            title={blackMode ? 'Black mode on' : 'Black mode off'}
            className={`flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-full glass transition-colors ${
              blackMode ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {blackMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{blackMode ? 'Light' : 'Black'}</span>
          </button>
          <button
            onClick={() => navigate('/about')}
            aria-label="About"
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono"
          >

            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About</span>
          </button>
          {user && (
            <button
              onClick={() => navigate(`/profile/${user.id}`)}
              aria-label="Profile"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}
          {user && (
            <button
              onClick={() => navigate('/write')}
              aria-label="Likho (Write a post)"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Likho</span>
            </button>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              aria-label="Logout"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono disabled:opacity-60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isLoggingOut ? 'Saving...' : 'Logout'}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              aria-label="Login"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
