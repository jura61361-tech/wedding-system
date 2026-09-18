import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from './client';

export function createServerSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  let url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Sanitize if user pasted the /rest/v1/ endpoint URL
  url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // Can happen in Server Components
        }
      },
    },
  });
}
