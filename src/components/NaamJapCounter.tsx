import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Sparkles, Flame, CalendarDays, Eye, EyeOff, Target, Save, Settings2, Trash2, Link2 } from 'lucide-react';
import { format, subDays, differenceInCalendarDays } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  readPendingJapChanges,
  registerNaamJapFlushHandler,
  writePendingJapChanges,
} from '@/lib/naam-jap-sync';

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

function hasPositiveValues(record: Record<string, number>) {
  return Object.values(record).some((value) => value > 0);
}

function subtractSavedValues(current: Record<string, number>, saved: Record<string, number>) {
  const next = { ...current };

  Object.entries(saved).forEach(([key, value]) => {
    const remaining = (next[key] || 0) - value;
    if (remaining > 0) next[key] = remaining;
    else delete next[key];
  });

  return next;
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
  const [externalInputs, setExternalInputs] = useState<Record<string, string>>({});
  const [externalToday, setExternalToday] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const pendingCountDeltasRef = useRef<Record<string, number>>({});
  const pendingDailyLogDeltasRef = useRef<Record<string, number>>({});
  const dailyTotalsRef = useRef<Record<string, number>>({});
  const autoSaveTimeoutRef = useRef<number | null>(null);
  const flushPromiseRef = useRef<Promise<void> | null>(null);

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
    const mergedMap = mergeDailyLogRows(rows).reduce<Record<string, number>>((acc, log) => {
      acc[log.log_date] = log.total_count;
      return acc;
    }, {});

    Object.entries(pendingDailyLogDeltasRef.current).forEach(([logDate, delta]) => {
      if (delta > 0) {
        mergedMap[logDate] = (mergedMap[logDate] || 0) + delta;
      }
    });

    const mergedLogs = Object.entries(mergedMap)
      .map(([log_date, total_count]) => ({ log_date, total_count }))
      .sort((a, b) => b.log_date.localeCompare(a.log_date));

    dailyTotalsRef.current = mergedLogs.reduce<Record<string, number>>((acc, log) => {
      acc[log.log_date] = log.total_count;
      return acc;
    }, {});

    setDailyLogs(mergedLogs);
  }, []);

  const clearAutoSaveTimeout = useCallback(() => {
    if (autoSaveTimeoutRef.current !== null) {
      window.clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
  }, []);

  const persistPendingChanges = useCallback(() => {
    if (!user) return;

    writePendingJapChanges(user.id, {
      countDeltas: pendingCountDeltasRef.current,
      dailyLogDeltas: pendingDailyLogDeltasRef.current,
    });

    setHasPendingChanges(
      hasPositiveValues(pendingCountDeltasRef.current) || hasPositiveValues(pendingDailyLogDeltasRef.current),
    );
  }, [user]);

  const fetchCounts = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('naam_jap_counts')
      .select('id, deity_name, count, daily_target')
      .eq('user_id', user.id)
      .order('count', { ascending: false });

    if (!error && data) {
      const nextCounts = data
        .map((item) => ({
          ...item,
          count: item.count + (pendingCountDeltasRef.current[item.id] || 0),
        }))
        .sort((a, b) => b.count - a.count);

      setCounts(nextCounts);
    }

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

  const incrementDailyLogLocally = useCallback((logDate: string, increment = 1) => {
    const nextTotal = (dailyTotalsRef.current[logDate] || 0) + increment;
    dailyTotalsRef.current = {
      ...dailyTotalsRef.current,
      [logDate]: nextTotal,
    };

    setDailyLogs((prev) => [
      { log_date: logDate, total_count: nextTotal },
      ...prev.filter((log) => log.log_date !== logDate),
    ]);
  }, []);

  const flushPendingChanges = useCallback(async ({ showSuccessToast = true }: { showSuccessToast?: boolean } = {}) => {
    if (!user) return;

    if (flushPromiseRef.current) {
      await flushPromiseRef.current;
      return;
    }

    const countSnapshot = Object.fromEntries(
      Object.entries(pendingCountDeltasRef.current).filter(([, delta]) => delta > 0),
    );
    const dailySnapshot = Object.fromEntries(
      Object.entries(pendingDailyLogDeltasRef.current).filter(([, delta]) => delta > 0),
    );

    if (!hasPositiveValues(countSnapshot) && !hasPositiveValues(dailySnapshot)) {
      if (showSuccessToast) toast.success('Sab save hai');
      return;
    }

    clearAutoSaveTimeout();

    const saveTask = (async () => {
      setIsSaving(true);

      try {
        await Promise.all([
          (async () => {
            if (!hasPositiveValues(countSnapshot)) return;

            const ids = Object.keys(countSnapshot);
            const { data, error } = await supabase
              .from('naam_jap_counts')
              .select('id, count')
              .eq('user_id', user.id)
              .in('id', ids);

            if (error) throw error;

            const serverCounts = new Map((data ?? []).map((row) => [row.id, row.count]));

            for (const [id, delta] of Object.entries(countSnapshot)) {
              const baseCount = serverCounts.get(id);
              if (baseCount === undefined) continue;

              const { error: updateError } = await supabase
                .from('naam_jap_counts')
                .update({ count: baseCount + delta })
                .eq('id', id)
                .eq('user_id', user.id);

              if (updateError) throw updateError;
            }
          })(),
          (async () => {
            if (!hasPositiveValues(dailySnapshot)) return;

            const dates = Object.keys(dailySnapshot);
            const { data, error } = await supabase
              .from('jap_daily_logs')
              .select('id, log_date, total_count')
              .eq('user_id', user.id)
              .in('log_date', dates)
              .order('created_at', { ascending: true });

            if (error) throw error;

            const grouped = (data ?? []).reduce<Record<string, DailyLogRow[]>>((acc, row) => {
              acc[row.log_date] = [...(acc[row.log_date] ?? []), row];
              return acc;
            }, {});

            for (const [logDate, delta] of Object.entries(dailySnapshot)) {
              const existingRows = grouped[logDate] ?? [];

              if (existingRows.length === 0) {
                const { error: insertError } = await supabase
                  .from('jap_daily_logs')
                  .insert({ user_id: user.id, log_date: logDate, total_count: delta });

                if (insertError) throw insertError;
                continue;
              }

              const firstRow = existingRows[0];
              const { error: updateError } = await supabase
                .from('jap_daily_logs')
                .update({ total_count: firstRow.total_count + delta })
                .eq('id', firstRow.id)
                .eq('user_id', user.id);

              if (updateError) throw updateError;
            }
          })(),
        ]);

        pendingCountDeltasRef.current = subtractSavedValues(pendingCountDeltasRef.current, countSnapshot);
        pendingDailyLogDeltasRef.current = subtractSavedValues(pendingDailyLogDeltasRef.current, dailySnapshot);
        persistPendingChanges();
        setLastSavedAt(new Date());

        if (showSuccessToast) toast.success('Jap save ho gaya');

        if (hasPositiveValues(pendingCountDeltasRef.current) || hasPositiveValues(pendingDailyLogDeltasRef.current)) {
          autoSaveTimeoutRef.current = window.setTimeout(() => {
            void flushPendingChanges({ showSuccessToast: false });
          }, 400);
        }
      } catch (_error) {
        persistPendingChanges();
        await Promise.all([fetchCounts(), fetchDailyLogs()]);

        if (showSuccessToast) toast.error('Save nahi ho paya, phir se try karo');
      } finally {
        setIsSaving(false);
        flushPromiseRef.current = null;
      }
    })();

    flushPromiseRef.current = saveTask;
    await saveTask;
  }, [clearAutoSaveTimeout, fetchCounts, fetchDailyLogs, persistPendingChanges, user]);

  const scheduleAutoSave = useCallback(() => {
    clearAutoSaveTimeout();
    autoSaveTimeoutRef.current = window.setTimeout(() => {
      void flushPendingChanges({ showSuccessToast: false });
    }, 1200);
  }, [clearAutoSaveTimeout, flushPendingChanges]);

  useEffect(() => {
    calculateStreak(dailyLogs);
  }, [calculateStreak, dailyLogs]);

  useEffect(() => {
    if (!user) {
      setCounts([]);
      setDailyLogs([]);
      setLoading(false);
      setHasPendingChanges(false);
      setLastSavedAt(null);
      pendingCountDeltasRef.current = {};
      pendingDailyLogDeltasRef.current = {};
      dailyTotalsRef.current = {};
      clearAutoSaveTimeout();
      registerNaamJapFlushHandler(null);
      return;
    }

    const pendingChanges = readPendingJapChanges(user.id);
    pendingCountDeltasRef.current = pendingChanges.countDeltas;
    pendingDailyLogDeltasRef.current = pendingChanges.dailyLogDeltas;
    setHasPendingChanges(
      hasPositiveValues(pendingChanges.countDeltas) || hasPositiveValues(pendingChanges.dailyLogDeltas),
    );
    setLoading(true);

    void Promise.all([fetchCounts(), fetchDailyLogs()]);
    registerNaamJapFlushHandler(() => flushPendingChanges({ showSuccessToast: false }));

    if (hasPositiveValues(pendingChanges.countDeltas) || hasPositiveValues(pendingChanges.dailyLogDeltas)) {
      autoSaveTimeoutRef.current = window.setTimeout(() => {
        void flushPendingChanges({ showSuccessToast: false });
      }, 800);
    }

    return () => {
      clearAutoSaveTimeout();
      registerNaamJapFlushHandler(null);
    };
  }, [clearAutoSaveTimeout, fetchCounts, fetchDailyLogs, flushPendingChanges, user]);

  const todayLog = dailyLogs.find((log) => log.log_date === todayStr);
  const todayCount = todayLog?.total_count || 0;
  const totalCount = counts.reduce((sum, count) => sum + count.count, 0);
  const saveStatusText = isSaving
    ? 'Save ho raha hai...'
    : hasPendingChanges
      ? 'Abhi changes pending hain — Save dabao.'
      : lastSavedAt
        ? `Last save ${format(lastSavedAt, 'hh:mm a')}`
        : 'Auto-save on hai';

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

    pendingCountDeltasRef.current = {
      ...pendingCountDeltasRef.current,
      [item.id]: (pendingCountDeltasRef.current[item.id] || 0) + 1,
    };
    pendingDailyLogDeltasRef.current = {
      ...pendingDailyLogDeltasRef.current,
      [todayStr]: (pendingDailyLogDeltasRef.current[todayStr] || 0) + 1,
    };

    persistPendingChanges();
    incrementDailyLogLocally(todayStr);
    scheduleAutoSave();
  };

  // Listen for global "tap-anywhere" jap events from TapJapOverlay.
  // Increments the first (top) counter so the user can jap without aiming.
  useEffect(() => {
    const onTap = () => {
      const first = counts[0];
      if (!first) {
        toast.info('Pehle ek naam add karo (e.g. Radhe Radhe)');
        return;
      }
      handleJap(first);
    };
    window.addEventListener('naam-jap-tap', onTap);
    return () => window.removeEventListener('naam-jap-tap', onTap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts, user]);

  const handleDelete = async (item: JapCount) => {
    if (!user) return;

    const { error } = await supabase
      .from('naam_jap_counts')
      .delete()
      .eq('id', item.id)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Delete nahi hua');
      return;
    }

    setCounts((prev) => prev.filter((count) => count.id !== item.id));
    const nextPendingCounts = { ...pendingCountDeltasRef.current };
    delete nextPendingCounts[item.id];
    pendingCountDeltasRef.current = nextPendingCounts;
    persistPendingChanges();
    setEditingTarget((current) => (current === item.id ? null : current));
    toast.success('Delete ho gaya');
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

      <div className="grid grid-cols-3 gap-2 mb-2">
        <button
          onClick={() => setHideCounts(!hideCounts)}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl glass text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          {hideCounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="hidden sm:inline">{hideCounts ? 'Show' : 'Hide'}</span>
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl glass text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <CalendarDays className="w-4 h-4" />
          <span className="hidden sm:inline">Calendar</span>
        </button>
        <button
          onClick={() => void flushPendingChanges()}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-mono transition-colors disabled:opacity-60 ${
            hasPendingChanges
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'glass text-muted-foreground hover:text-foreground'
          }`}
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">{isSaving ? 'Saving' : hasPendingChanges ? 'Save' : 'Saved'}</span>
        </button>
      </div>

      <p className="text-[11px] text-center text-muted-foreground font-mono mb-6">{saveStatusText}</p>

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
                    title={hideCounts ? format(day.date, 'dd MMM') : `${format(day.date, 'dd MMM')}: ${day.count} jap`}
                    className={`aspect-square rounded-md ${getIntensityClass(hideCounts ? 0 : day.count)} transition-colors cursor-default flex items-center justify-center`}
                  >
                    {!hideCounts && day.count > 0 && (
                      <span className="text-[8px] font-mono text-primary-foreground font-bold">{day.count}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[10px] text-muted-foreground font-mono">Kam</span>
                {[0, 3, 10, 30, 60].map((count) => (
                  <div key={count} className={`w-3 h-3 rounded-sm ${getIntensityClass(hideCounts ? 0 : count)}`} />
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

                    <button
                      onClick={() => {
                        setEditingTarget(editingTarget === item.id ? null : item.id);
                        setTargetInput(String(item.daily_target));
                      }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Manage counter"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
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
                      animate={{ width: hideCounts ? '0%' : `${Math.min(100, (item.count / item.daily_target) * 100)}%` }}
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
                      <div className="glass rounded-xl p-3 space-y-3">
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

                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors disabled:opacity-60"
                                disabled={isSaving}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Counter
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle>{item.deity_name} delete karna hai?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Yeh button ab side mein rakha hai taki galti se delete na ho. Delete ke baad yeh counter list se hat jayega.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => void handleDelete(item)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
