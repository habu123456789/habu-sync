import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Power } from 'lucide-react';
import { toast } from 'sonner';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * Floating "Tap Mode" toggle. When enabled, taps anywhere on the page
 * (outside buttons/inputs/links) dispatch a `naam-jap-tap` event and
 * show a water-drop ripple animation.
 */
const TapJapOverlay = () => {
  const [enabled, setEnabled] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleTap = useCallback((e: PointerEvent) => {
    if (!enabled) return;
    const target = e.target as HTMLElement | null;
    if (!target) return;
    // Ignore interactive elements
    if (target.closest('button, a, input, textarea, select, [role="button"], [data-no-tap]')) return;

    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 900);

    window.dispatchEvent(new CustomEvent('naam-jap-tap'));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('pointerdown', handleTap);
    return () => window.removeEventListener('pointerdown', handleTap);
  }, [enabled, handleTap]);

  const toggle = () => {
    setEnabled((v) => {
      const next = !v;
      toast.success(next ? '💧 Tap Mode ON — screen pe kahin bhi tap karo' : 'Tap Mode OFF', { duration: 2000 });
      return next;
    });
  };

  return (
    <>
      {/* Ripples */}
      <div className="pointer-events-none fixed inset-0 z-[60]">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              style={{ left: r.x - 30, top: r.y - 30 }}
              className="absolute w-[60px] h-[60px] rounded-full bg-gradient-to-br from-primary/60 to-accent/40 border-2 border-primary/40 shadow-lg shadow-primary/40"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Floating toggle */}
      <button
        onClick={toggle}
        data-no-tap
        aria-label="Toggle tap-to-jap mode"
        className={`fixed bottom-6 right-6 z-[70] flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-all font-mono text-sm
          ${enabled
            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-primary/40 animate-pulse'
            : 'glass text-muted-foreground hover:text-primary'}
        `}
      >
        {enabled ? <Droplet className="w-4 h-4 fill-current" /> : <Power className="w-4 h-4" />}
        <span className="hidden sm:inline">{enabled ? 'Tap Jap ON' : 'Tap Jap'}</span>
      </button>
    </>
  );
};

export default TapJapOverlay;
