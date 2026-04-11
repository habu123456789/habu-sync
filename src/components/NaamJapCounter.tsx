import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Sparkles, Trash2, Flame, CalendarDays } from 'lucide-react';
import { format, subDays, differenceInCalendarDays, startOfDay } from 'date-fns';

interface JapCount {
  id: string;
  deity_name: string;
  count: number;
}

interface DailyLog {
  log_date: string;
  total_count: number;
}

const NaamJapCounter = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<JapCount[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchCounts = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('naam_jap_counts')
      .select('id, deity_name, count')
      .eq('user_id', user.id)
      .order('count', { ascending: false });
    if (!error && data) setCounts(data);
    setLoading(false);
  }, [user]);

  const fetchDailyLogs = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('jap_daily_logs')
      .select('log_date, total_count')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .limit(90);
    if (data) {
      setDailyLogs(data);
      calculateStreak(data);
    }
  }, [user]);

  const calculateStreak = (logs: DailyLog[]) => {
    if (logs.length === 0) { setStreak(0); return; }
    const today = format(new Date(), 'yyyy-MM-dd');
    const sortedDates = logs.map(l => l.log_date).sort().reverse();

    // Streak must include today or yesterday
    if (sortedDates[0] !== today && sortedDates[0] !== format(subDays(new Date(), 1), 'yyyy-MM-dd')) {
      setStreak(0);
      return;
    }

    let count = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInCalendarDays(
        new Date(sortedDates[i - 1]),
        new Date(sortedDates[i])
      );
      if (diff === 1) count++;
      else break;
    }
    setStreak(count);
  };

  useEffect(() => {
    fetchCounts();
    fetchDailyLogs();
  }, [fetchCounts, fetchDailyLogs]);

  const logDailyJap = async () => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = dailyLogs.find(l => l.log_date === today);

    if (existing) {
      await supabase
        .from('jap_daily_logs')
        .update({ total_count: existing.total_count + 1 })
        .eq('user_id', user.id)
        .eq('log_date', today);
    } else {
      await supabase
        .from('jap_daily_logs')
        .insert({ user_id: user.id, log_date: today, total_count: 1 });
    }
    fetchDailyLogs();
  };

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name || !user) return;
    if (name.length > 100) {
      toast.error('Naam 100 characters se chhota hona chahiye');
      return;
    }

    const existing = counts.find(
      (c) => c.deity_name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      toast.info(`"${existing.deity_name}" pehle se hai! Uska button dabao jap karne ke liye.`);
      setNewName('');
      return;
    }

    const { data, error } = await supabase
      .from('naam_jap_counts')
      .insert({ user_id: user.id, deity_name: name, count: 0 })
      .select('id, deity_name, count')
      .single();

    if (error) {
      toast.error('Add nahi ho paya: ' + error.message);
    } else if (data) {
      setCounts((prev) => [data, ...prev]);
      setNewName('');
      toast.success(`"${name}" add ho gaya! 🙏`);
    }
  };

  const handleJap = async (item: JapCount) => {
    const newCount = item.count + 1;
    setCounts((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, count: newCount } : c))
    );

    const { error } = await supabase
      .from('naam_jap_counts')
      .update({ count: newCount })
      .eq('id', item.id);

    if (error) {
      setCounts((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, count: item.count } : c))
      );
      toast.error('Count save nahi hua');
    } else {
      logDailyJap();
    }
  };

  const handleDelete = async (item: JapCount) => {
    if (!confirm(`"${item.deity_name}" ka counter delete karein?`)) return;
    const { error } = await supabase
      .from('naam_jap_counts')
      .delete()
      .eq('id', item.id);

    if (error) {
      toast.error('Delete nahi hua');
    } else {
      setCounts((prev) => prev.filter((c) => c.id !== item.id));
      toast.success('Delete ho gaya');
    }
  };

  // Build calendar grid (last 35 days)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const date = subDays(new Date(), 34 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dailyLogs.find(l => l.log_date === dateStr);
    return { date, dateStr, count: log?.total_count || 0 };
  });

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-secondary';
    if (count < 5) return 'bg-primary/30';
    if (count < 20) return 'bg-primary/50';
    if (count < 50) return 'bg-primary/70';
    return 'bg-primary';
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-muted-foreground font-mono">
          🙏 Naam Jap Counter use karne ke liye pehle login karo
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-16 max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-display font-bold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Naam Jap Counter
          <Sparkles className="w-5 h-5 text-primary" />
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Bhagwan ka naam type karo aur jap ka count rakho 🙏
        </p>
      </div>

      {/* Streak & Calendar Toggle */}
      <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Flame className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-primary">{streak} din</p>
            <p className="text-xs text-muted-foreground font-mono">
              {streak > 0 ? 'Lagatar streak 🔥' : 'Aaj jap karo streak shuru karo!'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <CalendarDays className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Heatmap */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-mono mb-3 text-center">
                Pichle 35 din ka jap record 📅
              </p>
              <div className="grid grid-cols-7 gap-1.5">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground font-mono text-center">
                    {d}
                  </span>
                ))}
                {calendarDays.map((day) => (
                  <div
                    key={day.dateStr}
                    title={`${format(day.date, 'dd MMM')}: ${day.count} jap`}
                    className={`aspect-square rounded-md ${getIntensityClass(day.count)} transition-colors cursor-default flex items-center justify-center`}
                  >
                    {day.count > 0 && (
                      <span className="text-[8px] font-mono text-primary-foreground font-bold">
                        {day.count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[10px] text-muted-foreground font-mono">Kam</span>
                {[0, 3, 10, 30, 60].map((c) => (
                  <div key={c} className={`w-3 h-3 rounded-sm ${getIntensityClass(c)}`} />
                ))}
                <span className="text-[10px] text-muted-foreground font-mono">Zyada</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add new deity name */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Bhagwan ka naam likho..."
          maxLength={100}
          className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Counter list */}
      {loading ? (
        <p className="text-center text-muted-foreground text-sm">Loading...</p>
      ) : counts.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm font-mono">
          Abhi koi naam nahi hai. Upar se add karo! ✨
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {counts.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <button
                  onClick={() => handleJap(item)}
                  className="flex-1 text-left group"
                >
                  <span className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.deity_name}
                  </span>
                  <span className="block text-xs text-muted-foreground font-mono mt-0.5">
                    Tap karke jap karo 🙏
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <motion.span
                    key={item.count}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-display font-bold text-primary min-w-[3rem] text-center"
                  >
                    {item.count}
                  </motion.span>

                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground font-mono mt-6">
        Total Jap: {counts.reduce((sum, c) => sum + c.count, 0)} 🔢
      </p>
    </motion.div>
  );
};

export default NaamJapCounter;
