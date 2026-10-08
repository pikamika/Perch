/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Public; safe to commit. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon (public) key. Put it in .env.local, never the service_role key. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
