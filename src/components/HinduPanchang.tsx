import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Calendar } from 'lucide-react';
import { MhahPanchang } from 'mhah-panchang';

// Hindi (Devanagari) names
const TITHI_HI = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

const MASA_HI = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
  'Ashwin', 'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna',
];

const NAKSHATRA_HI = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const RITU_HI = ['Vasant (Spring)', 'Grishma (Summer)', 'Varsha (Monsoon)', 'Sharad (Autumn)', 'Hemant (Pre-Winter)', 'Shishir (Winter)'];

const DAY_HI = ['Ravivaar', 'Somvaar', 'Mangalvaar', 'Budhvaar', 'Guruvaar', 'Shukravaar', 'Shanivaar'];

// Special tithis with significance
const SPECIAL_TITHI: Record<number, string> = {
  10: 'Ekadashi 🕉️ — Vishnu vrat ka din',
  11: 'Dwadashi — Vrat parana',
  14: 'Purnima 🌕 — Poornchandra darshan',
  25: 'Ekadashi 🕉️ — Vishnu vrat ka din',
  26: 'Dwadashi — Vrat parana',
  29: 'Amavasya 🌑 — Pitru tarpan',
  3: 'Chaturthi — Ganesh vrat',
  18: 'Chaturthi 🐘 — Sankashti Ganesh vrat',
  7: 'Ashtami — Devi vrat',
  22: 'Ashtami — Devi vrat',
};

const HinduPanchang = () => {
  const data = useMemo(() => {
    try {
      const obj = new MhahPanchang();
      const now = new Date();
      // Delhi default; close enough for India-wide
      const cal = obj.calendar(now, 28.6139, 77.2090);
      const calc = obj.calculate(now);

      const tithiIno: number = cal.Tithi?.ino ?? 0;
      const masaIno: number = cal.Masa?.ino ?? 0;
      const nakIno: number = cal.Nakshatra?.ino ?? 0;
      const rituIno: number = cal.Ritu?.ino ?? 0;
      const pakshaIno: number = cal.Paksha?.ino ?? 0;
      const dayIno: number = calc.Day?.ino ?? now.getDay();

      // Vikram Samvat: April onwards = year + 57, before April = year + 56
      const y = now.getFullYear();
      const m = now.getMonth();
      const vikramSamvat = m >= 3 ? y + 57 : y + 56;
      // Shaka Samvat
      const shakaSamvat = m >= 2 ? y - 78 : y - 79;

      return {
        tithi: TITHI_HI[tithiIno] ?? 'Tithi',
        tithiNum: (tithiIno % 15) + 1,
        paksha: pakshaIno === 0 ? 'Shukla Paksha 🌒' : 'Krishna Paksha 🌘',
        masa: MASA_HI[masaIno] ?? 'Masa',
        nakshatra: NAKSHATRA_HI[nakIno] ?? cal.Nakshatra?.name_en_IN ?? '',
        ritu: RITU_HI[rituIno] ?? '',
        day: DAY_HI[dayIno] ?? '',
        vikramSamvat,
        shakaSamvat,
        special: SPECIAL_TITHI[tithiIno],
        gregDate: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
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
      transition={{ delay: 0.3 }}
      className="mt-12 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Aaj Ka Panchang
          <Calendar className="w-4 h-4 text-primary" />
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="glass rounded-3xl p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <h3 className="text-2xl font-display font-bold text-primary">
              {data.day}
            </h3>
            <span className="text-xs font-mono text-muted-foreground">{data.gregDate}</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground mb-5">
            Vikram Samvat {data.vikramSamvat} · Shaka {data.shakaSamvat}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <InfoCell icon={<Moon className="w-4 h-4" />} label="Tithi" value={`${data.tithi} (${data.tithiNum})`} />
            <InfoCell icon={<Sparkles className="w-4 h-4" />} label="Paksha" value={data.paksha} />
            <InfoCell icon={<Calendar className="w-4 h-4" />} label="Maas" value={data.masa} />
            <InfoCell icon={<Sparkles className="w-4 h-4" />} label="Nakshatra" value={data.nakshatra} />
            <InfoCell icon={<Sun className="w-4 h-4" />} label="Ritu" value={data.ritu} />
            <InfoCell icon={<Calendar className="w-4 h-4" />} label="Samvat" value={`Vikram ${data.vikramSamvat}`} />
          </div>

          {data.special && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-center"
            >
              <p className="text-sm font-display font-semibold text-primary">
                ✨ Aaj Vishesh: {data.special}
              </p>
            </motion.div>
          )}

          <p className="text-[10px] text-center text-muted-foreground font-mono mt-4">
            🕉️ Panchang Bharat (Delhi) ke aadhar par
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const InfoCell = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-card/40 rounded-xl p-3 border border-border/40">
    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-display font-bold text-foreground truncate">{value}</p>
  </div>
);

export default HinduPanchang;
