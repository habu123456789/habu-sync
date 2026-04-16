import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Mantra {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  deity: string;
}

const mantras: Mantra[] = [
  { sanskrit: 'ॐ नमः शिवाय', transliteration: 'Om Namah Shivaya', meaning: 'Shiv ji ko pranaam — mann ki shuddhi aur moksha ka mantra.', deity: '🔱 Shiv' },
  { sanskrit: 'हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे। हरे राम हरे राम, राम राम हरे हरे॥', transliteration: 'Hare Krishna Hare Krishna, Krishna Krishna Hare Hare. Hare Rama Hare Rama, Rama Rama Hare Hare.', meaning: 'Maha Mantra — Bhagwan ke naam ka jap karne se mann ko shaanti milti hai.', deity: '🙏 Krishna-Ram' },
  { sanskrit: 'ॐ गं गणपतये नमः', transliteration: 'Om Gam Ganapataye Namah', meaning: 'Ganesh ji ka mantra — sabhi vighnon ko door karta hai.', deity: '🐘 Ganesh' },
  { sanskrit: 'ॐ श्री महालक्ष्म्यै नमः', transliteration: 'Om Shri Mahalakshmyai Namah', meaning: 'Lakshmi ji ka mantra — dhan, samriddhi aur sukh ka aashirvaad.', deity: '🪷 Lakshmi' },
  { sanskrit: 'ॐ ऐं सरस्वत्यै नमः', transliteration: 'Om Aim Saraswatyai Namah', meaning: 'Saraswati ji ka mantra — vidya aur buddhi ke liye.', deity: '📚 Saraswati' },
  { sanskrit: 'ॐ हनुमते नमः', transliteration: 'Om Hanumate Namah', meaning: 'Hanuman ji ka mantra — shakti, bhakti aur himmat deta hai.', deity: '🐒 Hanuman' },
  { sanskrit: 'ॐ नमो भगवते वासुदेवाय', transliteration: 'Om Namo Bhagavate Vasudevaya', meaning: 'Vishnu ji ka 12 akshar ka mantra — moksha aur shaanti ka maarg.', deity: '🔵 Vishnu' },
  { sanskrit: 'ॐ सूर्याय नमः', transliteration: 'Om Suryaya Namah', meaning: 'Surya Dev ka mantra — urja, swasthya aur tej ke liye.', deity: '☀️ Surya' },
  { sanskrit: 'ॐ दुर्गायै नमः', transliteration: 'Om Durgayai Namah', meaning: 'Durga Maa ka mantra — raksha aur shakti ke liye.', deity: '🦁 Durga' },
  { sanskrit: 'ॐ शं शनैश्चराय नमः', transliteration: 'Om Sham Shanaischaraya Namah', meaning: 'Shani Dev ka mantra — nyay aur karm phal ke liye.', deity: '⚫ Shani' },
  { sanskrit: 'राधे राधे गोविंद गोविंद राधे', transliteration: 'Radhe Radhe Govind Govind Radhe', meaning: 'Radha-Krishna ka prem mantra — prem aur bhakti ka saar.', deity: '💛 Radha-Krishna' },
  { sanskrit: 'ॐ क्लीं कृष्णाय नमः', transliteration: 'Om Kleem Krishnaya Namah', meaning: 'Krishna ji ka beej mantra — akarshan aur prem shakti.', deity: '🦚 Krishna' },
  { sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्', transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushti Vardhanam', meaning: 'Mahamrityunjay Mantra — mrityu bhay se mukti aur aarogya.', deity: '🔱 Shiv' },
  { sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः', transliteration: 'Sarve Bhavantu Sukhinah Sarve Santu Niramayah', meaning: 'Sab sukhi hon, sab nirogi hon — vishv kalyaan ka mantra.', deity: '🙏 Universal' },
];

function getDailyMantra(): Mantra {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return mantras[dayOfYear % mantras.length];
}

const MantraOfTheDay = () => {
  const [mantra] = useState<Mantra>(getDailyMantra);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Aaj Ka Mantra
          <Sparkles className="w-4 h-4 text-primary" />
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <span className="text-xs font-mono text-muted-foreground">{mantra.deity}</span>
        <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed">
          {mantra.sanskrit}
        </p>
        <p className="text-sm font-display font-semibold text-primary">
          {mantra.transliteration}
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {mantra.meaning}
        </p>
        <p className="text-[10px] text-muted-foreground font-mono">|| Roz naya mantra aayega ||</p>
      </div>
    </motion.div>
  );
};

export default MantraOfTheDay;
