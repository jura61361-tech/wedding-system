import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    url !== 'https://your-project-id.supabase.co' &&
    key !== 'your-anon-key-here' &&
    url.startsWith('https://')
  );
}

export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (client) return client;

  let url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Sanitize if user pasted the /rest/v1/ endpoint URL
  url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

  client = createBrowserClient(url, key);
  return client;
}
