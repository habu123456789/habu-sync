import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const hinglishQuotes = [
  "Zindagi mein kuch bada karna hai toh chhoti cheezein chhodni padti hain ⚡",
  "Sapne wo nahi jo neend mein aayein, sapne wo hain jo neend na aane dein 🌙",
  "Mehnat itni khamoshi se karo ki success shor machaye 🔥",
  "Haar ke baad hi asli jung shuru hoti hai 💪",
  "Waqt badalta hai, log badaltein hain, par asli insaan wahi hai jo khud ko nahi badalta 🎯",
  "Kal kya hoga koi nahi jaanta, aaj ko best bana do 🌟",
  "Mushkilein tujhe todne aayi hain, tu inhe tod de 🪨",
  "Jo darr gaya, samjho wo marr gaya — himmat rakho! 🦁",
  "Duniya mein koi kaam mushkil nahi, agar dil se karo toh ✨",
  "Apne aap pe bharosa rakh, baaki sab adjust ho jayega 🙌",
  "Success ka koi shortcut nahi hota, sirf hard work hota hai 🏆",
  "Chalo aaj kuch naya seekhte hain, kal se better bante hain 📚",
];

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
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mins = now.getMinutes();
    const idx = Math.floor(mins / 5) % hinglishQuotes.length;
    setQuoteIndex(idx);
  }, [Math.floor(now.getMinutes() / 5)]);

  const { hText, mText, sText, ampm } = timeToHinglish(
    now.getHours(), now.getMinutes(), now.getSeconds()
  );

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-16 text-center space-y-4"
    >
      {/* Digital clock */}
      <div className="font-mono text-3xl md:text-4xl font-bold text-primary tracking-widest">
        {pad(now.getHours())}
        <span className="animate-pulse">:</span>
        {pad(now.getMinutes())}
        <span className="animate-pulse">:</span>
        {pad(now.getSeconds())}
      </div>

      {/* Hinglish time */}
      <p className="text-sm text-muted-foreground font-mono">
        {ampm} ke {hText} baje, {mText} minute, {sText} second
      </p>

      {/* Rotating quote */}
      <AnimatePresence mode="wait">
        <motion.p
          key={quoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-muted-foreground font-mono max-w-md mx-auto"
        >
          {hinglishQuotes[quoteIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

export default HinglishClock;
