import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const numberToHinglish: Record<number, string> = {
  0: 'Zero', 1: 'Ek', 2: 'Do', 3: 'Teen', 4: 'Chaar', 5: 'Paanch',
  6: 'Chhay', 7: 'Saat', 8: 'Aath', 9: 'Nau', 10: 'Das',
  11: 'Gyarah', 12: 'Baarah',
};

function timeToHinglish(h: number, m: number, s: number) {
  const hour12 = h % 12 || 12;
  const ampm = h < 12 ? 'Subah' : h < 17 ? 'Dopahar' : h < 20 ? 'Shaam' : 'Raat';
  const hText = numberToHinglish[hour12] || String(hour12);
  const mText = m < 10 ? `Zero ${numberToHinglish[m] || m}` : String(m);
  const sText = s < 10 ? `Zero ${numberToHinglish[s] || s}` : String(s);
  return { hText, mText, sText, ampm };
}

const HinglishClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { hText, mText, sText, ampm } = timeToHinglish(
    now.getHours(), now.getMinutes(), now.getSeconds()
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-8 text-center"
    >
      <p className="text-base md:text-lg text-primary font-mono font-semibold">
        🕐 {ampm} ke {hText} baje, {mText} minute, {sText} second
      </p>
    </motion.div>
  );
};

export default HinglishClock;
