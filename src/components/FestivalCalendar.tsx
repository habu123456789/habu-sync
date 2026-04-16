import { motion } from 'framer-motion';
import { Calendar, Star } from 'lucide-react';

interface Festival {
  name: string;
  date: string;
  month: number;
  day: number;
  emoji: string;
  description: string;
}

const festivals2025: Festival[] = [
  { name: 'Makar Sankranti', date: '14 Jan', month: 0, day: 14, emoji: '🪁', description: 'Surya Dev ka Makar Rashi mein pravesh' },
  { name: 'Basant Panchami', date: '2 Feb', month: 1, day: 2, emoji: '🌸', description: 'Saraswati Puja — Vidya ki Devi' },
  { name: 'Maha Shivratri', date: '26 Feb', month: 1, day: 26, emoji: '🔱', description: 'Bhagwan Shiv ki maha raat' },
  { name: 'Holi', date: '14 Mar', month: 2, day: 14, emoji: '🎨', description: 'Rangon ka tyohar — Burai par Achai ki jeet' },
  { name: 'Chaitra Navratri', date: '30 Mar', month: 2, day: 30, emoji: '🪷', description: 'Maa Durga ke nav roop ki puja' },
  { name: 'Ram Navami', date: '6 Apr', month: 3, day: 6, emoji: '🏹', description: 'Bhagwan Ram ka janmotsav' },
  { name: 'Hanuman Jayanti', date: '6 Apr', month: 3, day: 6, emoji: '🐒', description: 'Pawanputra Hanuman ka janm din' },
  { name: 'Akshaya Tritiya', date: '30 Apr', month: 3, day: 30, emoji: '✨', description: 'Akshay punya ka din — daan aur puja' },
  { name: 'Guru Purnima', date: '10 Jul', month: 6, day: 10, emoji: '🙏', description: 'Guru ko samarpan ka din' },
  { name: 'Raksha Bandhan', date: '9 Aug', month: 7, day: 9, emoji: '🧵', description: 'Bhai-behen ka pavitra bandhan' },
  { name: 'Janmashtami', date: '16 Aug', month: 7, day: 16, emoji: '🦚', description: 'Bhagwan Krishna ka janmotsav' },
  { name: 'Ganesh Chaturthi', date: '27 Aug', month: 7, day: 27, emoji: '🐘', description: 'Ganpati Bappa Morya!' },
  { name: 'Shardiya Navratri', date: '22 Sep', month: 8, day: 22, emoji: '🔥', description: 'Maa Durga ke nav din' },
  { name: 'Dussehra', date: '2 Oct', month: 9, day: 2, emoji: '🏹', description: 'Ravan dahan — Burai par Achai ki jeet' },
  { name: 'Karwa Chauth', date: '10 Oct', month: 9, day: 10, emoji: '🌙', description: 'Pati ki lambi umr ke liye vrat' },
  { name: 'Diwali', date: '20 Oct', month: 9, day: 20, emoji: '🪔', description: 'Roshni ka tyohar — Ram ji ka Ayodhya aagman' },
  { name: 'Govardhan Puja', date: '22 Oct', month: 9, day: 22, emoji: '⛰️', description: 'Krishna ne Govardhan parvat uthaya' },
  { name: 'Bhai Dooj', date: '23 Oct', month: 9, day: 23, emoji: '👫', description: 'Bhai ka tilak — prem ka tyohar' },
  { name: 'Chhath Puja', date: '26 Oct', month: 9, day: 26, emoji: '☀️', description: 'Surya Dev ki aradhna' },
  { name: 'Dev Diwali', date: '5 Nov', month: 10, day: 5, emoji: '🪔', description: 'Devon ki Diwali — Kashi ka utsav' },
];

const FestivalCalendar = () => {
  const now = new Date();
  const upcoming = festivals2025
    .filter((f) => {
      const fDate = new Date(2025, f.month, f.day);
      return fDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    })
    .slice(0, 6);

  const display = upcoming.length > 0 ? upcoming : festivals2025.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Aane Wale Tyohar
          <Calendar className="w-4 h-4 text-primary" />
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="glass rounded-2xl p-5 space-y-3">
        {display.map((festival, i) => (
          <motion.div
            key={festival.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.08 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors"
          >
            <span className="text-2xl">{festival.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-display font-bold text-foreground truncate">{festival.name}</h4>
                <span className="text-[11px] font-mono text-primary whitespace-nowrap">{festival.date}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{festival.description}</p>
            </div>
          </motion.div>
        ))}
        <p className="text-[10px] text-center text-muted-foreground font-mono pt-2">
          🗓️ 2025 ke pramukh Hindu tyohar
        </p>
      </div>
    </motion.div>
  );
};

export default FestivalCalendar;
