import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HinglishClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = now.getHours();
  const hour12 = h % 12 || 12;
  const min = now.getMinutes();
  const sec = now.getSeconds();
  const ampm = h < 12 ? 'AM' : 'PM';

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-8 text-center"
    >
      <p className="text-2xl md:text-3xl text-primary font-mono font-bold tracking-widest">
        🕐 {pad(hour12)}:{pad(min)}:{pad(sec)} {ampm}
      </p>
    </motion.div>
  );
};

export default HinglishClock;
