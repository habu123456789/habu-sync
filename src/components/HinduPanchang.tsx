import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Calendar } from 'lucide-react';
import { MhahPanchang } from 'mhah-panchang';

// Devanagari names
const TITHI_HI = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या',
];

const MASA_HI = [
  'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद',
  'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन',
];

const NAKSHATRA_HI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा',
  'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी',
  'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा',
  'शतभिषा', 'पूर्व भाद्रपद', 'उत्तर भाद्रपद', 'रेवती',
];

const RITU_HI = ['वसंत 🌸', 'ग्रीष्म ☀️', 'वर्षा 🌧️', 'शरद 🍂', 'हेमंत ❄️', 'शिशिर 🌨️'];

const DAY_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const SPECIAL_TITHI: Record<number, string> = {
  10: 'एकादशी 🕉️ — विष्णु व्रत का दिन',
  11: 'द्वादशी — व्रत पारण',
  14: 'पूर्णिमा 🌕 — पूर्णचंद्र दर्शन',
  25: 'एकादशी 🕉️ — विष्णु व्रत का दिन',
  26: 'द्वादशी — व्रत पारण',
  29: 'अमावस्या 🌑 — पितृ तर्पण',
  3: 'चतुर्थी — गणेश व्रत',
  18: 'सङ्कष्टी चतुर्थी 🐘 — गणेश व्रत',
  7: 'अष्टमी — देवी व्रत',
  22: 'अष्टमी — देवी व्रत',
};

const HinduPanchang = () => {
  const data = useMemo(() => {
    try {
      const obj = new MhahPanchang();
      const now = new Date();
      const cal = obj.calendar(now, 28.6139, 77.2090);
      const calc = obj.calculate(now);

      const tithiIno: number = cal.Tithi?.ino ?? 0;
      const masaIno: number = cal.Masa?.ino ?? 0;
      const nakIno: number = cal.Nakshatra?.ino ?? 0;
      const rituIno: number = cal.Ritu?.ino ?? 0;
      const pakshaIno: number = cal.Paksha?.ino ?? 0;
      const dayIno: number = calc.Day?.ino ?? now.getDay();

      const y = now.getFullYear();
      const m = now.getMonth();
      const vikramSamvat = m >= 3 ? y + 57 : y + 56;
      const shakaSamvat = m >= 2 ? y - 78 : y - 79;

      const gregDate = now.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

      return {
        tithi: TITHI_HI[tithiIno] ?? 'तिथि',
        tithiNum: (tithiIno % 15) + 1,
        paksha: pakshaIno === 0 ? 'शुक्ल पक्ष 🌒' : 'कृष्ण पक्ष 🌘',
        masa: MASA_HI[masaIno] ?? 'मास',
        nakshatra: NAKSHATRA_HI[nakIno] ?? cal.Nakshatra?.name_en_IN ?? '',
        ritu: RITU_HI[rituIno] ?? '',
        day: DAY_HI[dayIno] ?? '',
        vikramSamvat,
        shakaSamvat,
        special: SPECIAL_TITHI[tithiIno],
        gregDate,
      };
    } catch (e) {
      return null;
    }
  }, []);

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-base md:text-lg font-display text-primary tracking-wider flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          आज का पञ्चाङ्ग
          <Calendar className="w-5 h-5" />
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="glass rounded-3xl p-7 md:p-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              {data.day}
            </h2>
            <span className="text-sm md:text-base text-muted-foreground">{data.gregDate}</span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mb-7">
            विक्रम संवत् {data.vikramSamvat} · शक संवत् {data.shakaSamvat}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCell icon={<Moon className="w-5 h-5" />} label="तिथि" value={`${data.tithi} (${data.tithiNum})`} />
            <InfoCell icon={<Sparkles className="w-5 h-5" />} label="पक्ष" value={data.paksha} />
            <InfoCell icon={<Calendar className="w-5 h-5" />} label="मास" value={data.masa} />
            <InfoCell icon={<Sparkles className="w-5 h-5" />} label="नक्षत्र" value={data.nakshatra} />
            <InfoCell icon={<Sun className="w-5 h-5" />} label="ऋतु" value={data.ritu} />
            <InfoCell icon={<Calendar className="w-5 h-5" />} label="संवत्" value={`विक्रम ${data.vikramSamvat}`} />
          </div>

          {data.special && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/30 text-center"
            >
              <p className="text-base md:text-lg font-display font-semibold text-primary">
                ✨ आज विशेष: {data.special}
              </p>
            </motion.div>
          )}

          <p className="text-xs text-center text-muted-foreground mt-5">
            🕉️ पञ्चाङ्ग भारत (दिल्ली) के आधार पर
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const InfoCell = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-card/60 backdrop-blur rounded-2xl p-4 border border-border/50 hover:border-primary/40 transition-colors">
    <div className="flex items-center gap-2 text-muted-foreground mb-2">
      {icon}
      <span className="text-xs md:text-sm uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-base md:text-lg font-display font-bold text-foreground">{value}</p>
  </div>
);

export default HinduPanchang;
