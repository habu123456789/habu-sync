import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Sparkles, Trash2 } from 'lucide-react';

interface JapCount {
  id: string;
  deity_name: string;
  count: number;
}

const NaamJapCounter = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<JapCount[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name || !user) return;
    if (name.length > 100) {
      toast.error('Naam 100 characters se chhota hona chahiye');
      return;
    }

    // Check if already exists
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
