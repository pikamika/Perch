import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True once a real URL and anon key are provided (placeholders from .env.example don't count). */
export const isSupabaseConfigured: boolean =
  Boolean(url) &&
  Boolean(anonKey) &&
  !url?.includes('your-project-ref') &&
  anonKey !== 'your-anon-key'

let client: SupabaseClient | undefined

/**
 * Only the public anon key is ever used here. Row level security in the database decides what
 * each signed-in user can see. The session is kept in localStorage and refreshed automatically;
 * detectSessionInUrl completes the sign-in when someone opens the email confirmation link.
 */
export function getSupabase(): SupabaseClient {
  if (!url || !anonKey || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.')
  }
  client ??= createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  return client
}
