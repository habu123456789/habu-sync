import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Sparkles, Trash2, Flame, CalendarDays, Eye, EyeOff, Target } from 'lucide-react';
import { format, subDays, differenceInCalendarDays } from 'date-fns';

interface JapCount {
  id: string;
  deity_name: string;
  count: number;
  daily_target: number;
}

interface DailyLogRow {
  id: string;
  log_date: string;
  total_count: number;
}

interface DailyLog {
  log_date: string;
  total_count: number;
}

function mergeDailyLogRows(rows: DailyLogRow[]): DailyLog[] {
  const grouped = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.log_date] = (acc[row.log_date] || 0) + row.total_count;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([log_date, total_count]) => ({ log_date, total_count }))
    .sort((a, b) => b.log_date.localeCompare(a.log_date));
}

const NaamJapCounter = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<JapCount[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [hideCounts, setHideCounts] = useState(false);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const dailyLogQueueRef = useRef(Promise.resolve());
  const countQueueRef = useRef<Record<string, Promise<void>>>({});
  const dailyTotalsRef = useRef<Record<string, number>>({});

  const calculateStreak = useCallback((logs: DailyLog[]) => {
    if (logs.length === 0) {
      setStreak(0);
      return;
    }

    const sortedDates = logs.map((log) => log.log_date).sort().reverse();
    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
      setStreak(0);
      return;
    }

    let count = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInCalendarDays(new Date(sortedDates[i - 1]), new Date(sortedDates[i]));
      if (diff === 1) count++;
      else break;
    }

    setStreak(count);
  }, [todayStr]);

  const syncDailyLogs = useCallback((rows: DailyLogRow[]) => {
    const mergedLogs = mergeDailyLogRows(rows);
    dailyTotalsRef.current = mergedLogs.reduce<Record<string, number>>((acc, log) => {
      acc[log.log_date] = log.total_count;
      return acc;
    }, {});
    setDailyLogs(mergedLogs);
  }, []);

  const fetchCounts = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('naam_jap_counts')
      .select('id, deity_name, count, daily_target')
      .eq('user_id', user.id)
      .order('count', { ascending: false });

    if (!error && data) setCounts(data);
    setLoading(false);
  }, [user]);

  const fetchDailyLogs = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('jap_daily_logs')
      .select('id, log_date, total_count')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .limit(180);

    if (data) syncDailyLogs(data);
  }, [syncDailyLogs, user]);

  useEffect(() => {
    fetchCounts();
    fetchDailyLogs();
  }, [fetchCounts, fetchDailyLogs]);

  useEffect(() => {
    calculateStreak(dailyLogs);
  }, [calculateStreak, dailyLogs]);

  const todayLog = dailyLogs.find((log) => log.log_date === todayStr);
  const todayCount = todayLog?.total_count || 0;
  const totalCount = counts.reduce((sum, count) => sum + count.count, 0);

  const incrementTodayCountLocally = useCallback(() => {
    const nextTotal = (dailyTotalsRef.current[todayStr] || 0) + 1;
    dailyTotalsRef.current = {
      ...dailyTotalsRef.current,
      [todayStr]: nextTotal,
    };

    setDailyLogs((prev) => [
      { log_date: todayStr, total_count: nextTotal },
      ...prev.filter((log) => log.log_date !== todayStr),
    ]);
  }, [todayStr]);

  const logDailyJap = useCallback(() => {
    if (!user) return;

    incrementTodayCountLocally();

    dailyLogQueueRef.current = dailyLogQueueRef.current
      .then(async () => {
        const { data: existingRows, error: readError } = await supabase
          .from('jap_daily_logs')
          .select('id, total_count')
          .eq('user_id', user.id)
          .eq('log_date', todayStr)
          .order('created_at', { ascending: true });

        if (readError) throw readError;

        if (!existingRows || existingRows.length === 0) {
          const { error: insertError } = await supabase
            .from('jap_daily_logs')
            .insert({ user_id: user.id, log_date: todayStr, total_count: 1 });

          if (insertError) throw insertError;
          return;
        }

        const firstRow = existingRows[0];
        const { error: updateError } = await supabase
          .from('jap_daily_logs')
          .update({ total_count: firstRow.total_count + 1 })
          .eq('id', firstRow.id);

        if (updateError) throw updateError;
      })
      .catch(() => {
        fetchDailyLogs();
        toast.error('Aaj ke jap count save nahi hua');
      });
  }, [fetchDailyLogs, incrementTodayCountLocally, todayStr, user]);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name || !user) return;

    if (name.length > 100) {
      toast.error('Naam 100 characters se chhota hona chahiye');
      return;
    }

    const existing = counts.find((count) => count.deity_name.toLowerCase() === name.toLowerCase());
    if (existing) {
      toast.info(`"${existing.deity_name}" pehle se hai!`);
      setNewName('');
      return;
    }

    const { data, error } = await supabase
      .from('naam_jap_counts')
      .insert({ user_id: user.id, deity_name: name, count: 0 })
      .select('id, deity_name, count, daily_target')
      .single();

    if (error) {
      toast.error('Add nahi ho paya: ' + error.message);
    } else if (data) {
      setCounts((prev) => [data, ...prev]);
      setNewName('');
      toast.success(`"${name}" add ho gaya! 🙏`);
    }
  };

  const handleJap = (item: JapCount) => {
    if (!user) return;

    setCounts((prev) => prev.map((count) => (
      count.id === item.id ? { ...count, count: count.count + 1 } : count
    )));

    const existingQueue = countQueueRef.current[item.id] || Promise.resolve();
    countQueueRef.current[item.id] = existingQueue
      .then(async () => {
        const { data, error: readError } = await supabase
          .from('naam_jap_counts')
          .select('count')
          .eq('id', item.id)
          .single();

        if (readError) throw readError;

        const { error: updateError } = await supabase
          .from('naam_jap_counts')
          .update({ count: data.count + 1 })
          .eq('id', item.id);

        if (updateError) throw updateError;
      })
      .catch(() => {
        fetchCounts();
        toast.error('Count save nahi hua');
      });

    logDailyJap();
  };

  const handleDelete = async (item: JapCount) => {
    if (!confirm(`"${item.deity_name}" ka counter delete karein?`)) return;

    const { error } = await supabase.from('naam_jap_counts').delete().eq('id', item.id);
    if (error) {
      toast.error('Delete nahi hua');
    } else {
      setCounts((prev) => prev.filter((count) => count.id !== item.id));
      toast.success('Delete ho gaya');
    }
  };

  const handleSetTarget = async (item: JapCount) => {
    const target = parseInt(targetInput, 10);
    if (isNaN(target) || target < 1) {
      toast.error('Sahi target daalo (1 ya usse zyada)');
      return;
    }

    const { error } = await supabase
      .from('naam_jap_counts')
      .update({ daily_target: target })
      .eq('id', item.id);

    if (!error) {
      setCounts((prev) => prev.map((count) => (
        count.id === item.id ? { ...count, daily_target: target } : count
      )));
      toast.success(`Target ${target} set ho gaya! 🎯`);
    }

    setEditingTarget(null);
    setTargetInput('');
  };

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const date = subDays(new Date(), 34 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dailyLogs.find((dailyLogItem) => dailyLogItem.log_date === dateStr);
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 text-center">
        <p className="text-sm text-muted-foreground font-mono">🙏 Naam Jap Counter use karne ke liye pehle login karo</p>
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

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-display font-bold text-primary">{hideCounts ? '•••' : totalCount}</p>
          <p className="text-[10px] text-muted-foreground font-mono">Total Jap 🔢</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-display font-bold text-primary">{hideCounts ? '•••' : todayCount}</p>
          <p className="text-[10px] text-muted-foreground font-mono">Aaj ke Jap ✨</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-primary" />
            <p className="text-2xl font-display font-bold text-primary">{hideCounts ? '•••' : streak}</p>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">Din Streak 🔥</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setHideCounts(!hideCounts)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          {hideCounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {hideCounts ? 'Show Counts' : 'Hide Counts'}
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <CalendarDays className="w-4 h-4" />
          Calendar
        </button>
      </div>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-mono mb-3 text-center">Pichle 35 din ka jap record 📅</p>
              <div className="grid grid-cols-7 gap-1.5">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground font-mono text-center">{day}</span>
                ))}
                {calendarDays.map((day) => (
                  <div
                    key={day.dateStr}
                    title={`${format(day.date, 'dd MMM')}: ${day.count} jap`}
                    className={`aspect-square rounded-md ${getIntensityClass(day.count)} transition-colors cursor-default flex items-center justify-center`}
                  >
                    {day.count > 0 && (
                      <span className="text-[8px] font-mono text-primary-foreground font-bold">{day.count}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[10px] text-muted-foreground font-mono">Kam</span>
                {[0, 3, 10, 30, 60].map((count) => (
                  <div key={count} className={`w-3 h-3 rounded-sm ${getIntensityClass(count)}`} />
                ))}
                <span className="text-[10px] text-muted-foreground font-mono">Zyada</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => handleJap(item)}
                    className="flex-1 text-left group px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all"
                  >
                    <span className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.deity_name}
                    </span>
                    <span className="block text-sm text-muted-foreground font-mono mt-1">
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
                      {hideCounts ? '•••' : item.count}
                    </motion.span>

                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setEditingTarget(editingTarget === item.id ? null : item.id);
                          setTargetInput(String(item.daily_target));
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Set target"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                    <span>Target: {hideCounts ? '•••' : item.daily_target} 🎯</span>
                    <span>{hideCounts ? '•••' : `${Math.min(100, Math.round((item.count / item.daily_target) * 100))}%`}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.count / item.daily_target) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {editingTarget === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={targetInput}
                          onChange={(e) => setTargetInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSetTarget(item)}
                          placeholder="Target set karo..."
                          min={1}
                          className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary/50"
                        />
                        <button
                          onClick={() => handleSetTarget(item)}
                          className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                        >
                          Set 🎯
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default NaamJapCounter;
