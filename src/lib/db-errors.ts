import { toast } from 'sonner';

/**
 * Map raw Supabase / Postgres errors to safe, user-friendly messages.
 * Detailed errors are kept in the console for debugging only.
 */
export function showDbError(operation: string, error: unknown) {
  // eslint-disable-next-line no-console
  console.error(`DB error during ${operation}:`, error);

  const code = (error as { code?: string } | null)?.code ?? '';
  const friendly: Record<string, string> = {
    '23505': 'Yeh entry pehle se hai!',
    '23503': 'Related data nahi mila!',
    '23514': 'Data format theek nahi hai!',
    '23502': 'Zaroori field missing hai!',
    '42501': 'Permission nahi hai!',
    'PGRST301': 'Permission nahi hai!',
    'PGRST116': 'Data nahi mila!',
  };

  toast.error(friendly[code] ?? `${operation} nahi ho paya, phir try karo`);
}
