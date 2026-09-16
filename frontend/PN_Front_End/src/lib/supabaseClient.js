import { createClient } from '@supabase/supabase-js';

// Phase-1: Supabase client. Values come from .env (see .env.example).
// Placeholder fallbacks keep `vite build` passing without real keys.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(url, anonKey);

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);
