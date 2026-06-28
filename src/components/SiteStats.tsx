import { useEffect, useState } from 'react';
import { Eye, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VISITOR_KEY = 'rr_visitor_id';

const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

const SiteStats = () => {
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [liveCount, setLiveCount] = useState<number | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    let mounted = true;

    // Log this page view (once per session) via the secure edge function.
    // Anonymous direct inserts on site_views are no longer allowed.
    const sessionKey = 'rr_view_logged';
    const shouldLogView = !sessionStorage.getItem(sessionKey);
    if (shouldLogView) sessionStorage.setItem(sessionKey, '1');

    const heartbeat = async (logView = false) => {
      try {
        await supabase.functions.invoke('presence-heartbeat', {
          body: { visitor_id: visitorId, log_view: logView },
        });
      } catch {
        // Silent: presence/view logging is best-effort.
      }
    };

    const fetchStats = async () => {
      const { count: views } = await supabase
        .from('site_views')
        .select('*', { count: 'exact', head: true });

      const cutoff = new Date(Date.now() - 60_000).toISOString();
      const { count: live } = await supabase
        .from('site_presence')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', cutoff);

      if (mounted) {
        setTotalViews(views ?? 0);
        setLiveCount(live ?? 0);
      }
    };

    heartbeat().then(fetchStats);
    const hbInterval = setInterval(heartbeat, 30_000);
    const statsInterval = setInterval(fetchStats, 15_000);

    return () => {
      mounted = false;
      clearInterval(hbInterval);
      clearInterval(statsInterval);
    };
  }, []);

  return (
    <div className="flex justify-center gap-3 sm:gap-6 py-4 px-4 flex-wrap">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur border border-border/50">
        <Eye className="w-4 h-4 text-primary" />
        <span className="text-sm font-mono text-muted-foreground">Total Views:</span>
        <span className="text-sm font-bold text-primary">
          {totalViews === null ? '—' : totalViews.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur border border-border/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <Users className="w-4 h-4 text-accent" />
        <span className="text-sm font-mono text-muted-foreground">Live:</span>
        <span className="text-sm font-bold text-accent">
          {liveCount === null ? '—' : liveCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default SiteStats;
