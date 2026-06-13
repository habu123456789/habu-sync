import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CalendarDays, Sparkles, Sun } from 'lucide-react';

const DAY_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const DAY_DEITY: Record<number, string> = {
  0: 'सूर्य देव', 1: 'शिव जी', 2: 'हनुमान जी', 3: 'गणेश जी',
  4: 'विष्णु जी / गुरु', 5: 'माँ लक्ष्मी', 6: 'शनि देव',
};

// A small festival list — keep it lightweight, sorted by date
const FESTIVALS_2026: { date: string; name: string }[] = [
  { date: '2026-01-14', name: 'मकर संक्रांति' },
  { date: '2026-02-15', name: 'महा शिवरात्रि' },
  { date: '2026-03-03', name: 'होली' },
  { date: '2026-03-28', name: 'राम नवमी' },
  { date: '2026-04-02', name: 'हनुमान जयंती' },
  { date: '2026-08-15', name: 'कृष्ण जन्माष्टमी' },
  { date: '2026-09-14', name: 'गणेश चतुर्थी' },
  { date: '2026-10-10', name: 'नवरात्रि शुरू' },
  { date: '2026-10-20', name: 'दशहरा' },
  { date: '2026-11-08', name: 'दिवाली' },
];

const VICHAR = [
  '“कर्म कर, फल की चिंता मत कर।” — श्रीमद्भगवद्गीता',
  '“मन की शांति ही सच्चा धन है।”',
  '“सेवा परम धर्म है, और प्रेम परम पूजा।”',
  '“नाम जप से बढ़कर कोई साधना नहीं।”',
  '“जो हुआ, अच्छा हुआ। जो हो रहा है, अच्छा हो रहा है।”',
  '“श्रद्धा और धैर्य — भक्ति के दो पंख हैं।”',
  '“राधे राधे जपते रहो, मन प्रसन्न रहेगा।”',
];

const DateTimeStrip = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours();
  const hour12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  const pad = (n: number) => String(n).padStart(2, '0');

  const dayName = DAY_HI[now.getDay()];
  const deity = DAY_DEITY[now.getDay()];
  const dateStr = now.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const nextFest = useMemo(() => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const upcoming = FESTIVALS_2026
      .map((f) => ({ ...f, ts: new Date(f.date).getTime() }))
      .filter((f) => f.ts >= today)
      .sort((a, b) => a.ts - b.ts)[0];
    if (!upcoming) return null;
    const days = Math.round((upcoming.ts - today) / 86400000);
    return { name: upcoming.name, days };
  }, [now.getDate(), now.getMonth(), now.getFullYear()]);

  const vichar = useMemo(() => {
    const start = new Date(now.getFullYear(), 0, 0);
    const doy = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return VICHAR[doy % VICHAR.length];
  }, [now.getDate()]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-4 -mt-4 md:-mt-8 mb-10"
    >
      <div className="glass rounded-3xl p-5 md:p-7 relative overflow-hidden border border-white/20">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-tl from-accent/25 to-transparent blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center">
          {/* Day + Deity */}
          <Cell
            icon={<Sun className="w-4 h-4" />}
            label="आज का वार"
            value={dayName}
            sub={`भगवान: ${deity}`}
          />

          {/* Date */}
          <Cell
            icon={<CalendarDays className="w-4 h-4" />}
            label="तारीख़"
            value={dateStr}
            sub="विक्रम संवत् 2082"
          />

          {/* Live time */}
          <Cell
            icon={<Clock className="w-4 h-4" />}
            label="समय"
            value={`${pad(hour12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`}
            sub={ampm}
            mono
          />

          {/* Next festival countdown */}
          <Cell
            icon={<Sparkles className="w-4 h-4" />}
            label="अगला पर्व"
            value={nextFest?.name ?? '—'}
            sub={nextFest ? `${nextFest.days} दिन शेष` : ''}
            accent
          />
        </div>

        {/* Vichar strip */}
        <div className="relative mt-5 pt-5 border-t border-border/40 text-center">
          <p className="text-sm md:text-base font-display text-primary/90 italic">
            ✨ {vichar}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Cell = ({
  icon, label, value, sub, mono, accent,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; mono?: boolean; accent?: boolean }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="text-[10px] md:text-xs uppercase tracking-widest">{label}</span>
    </div>
    <p className={`font-display font-bold leading-tight ${mono ? 'font-mono tracking-wider' : ''} ${accent ? 'text-accent-foreground bg-accent/20 px-2 py-0.5 rounded-lg inline-block w-fit' : 'text-foreground'} text-lg md:text-xl`}>
      {value}
    </p>
    {sub && <span className="text-[11px] md:text-xs text-muted-foreground">{sub}</span>}
  </div>
);

export default DateTimeStrip;
