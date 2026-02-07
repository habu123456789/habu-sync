import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink } from 'lucide-react';

const socials = [
  { name: 'Twitter / X', url: 'https://twitter.com/habu_in', icon: '𝕏' },
  { name: 'Medium', url: 'https://medium.com/@habu', icon: 'M' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/habu-in', icon: 'in' },
  { name: 'Instagram', url: 'https://instagram.com/habu.in', icon: '📷' },
  { name: 'GitHub', url: 'https://github.com/habu-in', icon: '⌨' },
];

const links = [
  { name: 'habu61.wordpress.com', url: 'https://habu61.wordpress.com' },
  { name: 'habustory.blogspot.com', url: 'https://habustory.blogspot.com' },
  { name: 'heylink.me/habu.in', url: 'https://heylink.me/habu.in' },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 pt-28 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full glass border-2 border-primary/30 overflow-hidden flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-gradient-primary">H</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-primary glow-text mb-3">
            Habu
          </h1>
          <p className="text-sm text-primary/50 font-mono">@habu.in</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h2 className="text-sm font-mono text-primary/60 uppercase tracking-widest mb-4">About</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Writer, storyteller, aur ek insaan jo alfaazon mein zindagi dhundhta hai. Kahaniyaan likhta hoon, poetry karta hoon, aur feelings ko shabdon mein dhaalta hoon. Habu Says is where my thoughts find a home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h2 className="text-sm font-mono text-primary/60 uppercase tracking-widest mb-4">Socials</h2>
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-xs font-mono text-foreground/80 hover:text-primary transition-colors"
              >
                <span className="text-primary/70">{s.icon}</span>
                {s.name}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-sm font-mono text-primary/60 uppercase tracking-widest mb-4">Links</h2>
          <div className="space-y-3">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl glass glass-hover text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                <span>{l.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary/50" />
              </a>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
