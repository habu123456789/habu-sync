import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

        <div className="flex items-center gap-4">
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              Home
            </button>
          )}
          <a
            href="https://habu-says.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-primary transition-colors font-mono"
          >
            Blogspot ↗
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
