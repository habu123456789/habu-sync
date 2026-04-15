export interface PendingJapChanges {
  countDeltas: Record<string, number>;
  dailyLogDeltas: Record<string, number>;
}

const STORAGE_PREFIX = 'naam-jap-pending:';

const getEmptyPendingJapChanges = (): PendingJapChanges => ({
  countDeltas: {},
  dailyLogDeltas: {},
});

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readPendingJapChanges = (userId: string): PendingJapChanges => {
  if (!canUseStorage()) return getEmptyPendingJapChanges();

  try {
    const rawValue = window.localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!rawValue) return getEmptyPendingJapChanges();

    const parsedValue = JSON.parse(rawValue) as Partial<PendingJapChanges>;
    return {
      countDeltas: parsedValue.countDeltas && typeof parsedValue.countDeltas === 'object' ? parsedValue.countDeltas : {},
      dailyLogDeltas: parsedValue.dailyLogDeltas && typeof parsedValue.dailyLogDeltas === 'object' ? parsedValue.dailyLogDeltas : {},
    };
  } catch {
    return getEmptyPendingJapChanges();
  }
};

export const writePendingJapChanges = (userId: string, pendingChanges: PendingJapChanges) => {
  if (!canUseStorage()) return;

  const hasPendingCounts = Object.values(pendingChanges.countDeltas).some((value) => value > 0);
  const hasPendingDailyLogs = Object.values(pendingChanges.dailyLogDeltas).some((value) => value > 0);

  if (!hasPendingCounts && !hasPendingDailyLogs) {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${userId}`);
    return;
  }

  window.localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(pendingChanges));
};

type FlushHandler = () => Promise<void>;

let flushHandler: FlushHandler | null = null;

export const registerNaamJapFlushHandler = (handler: FlushHandler | null) => {
  flushHandler = handler;
};

export const flushNaamJapBeforeLogout = async () => {
  if (flushHandler) {
    await flushHandler();
  }
};