import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key'

// Create a mock client for development if no real credentials
export const supabase = supabaseUrl.includes('placeholder') 
  ? {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Google OAuth not configured' } }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: null })
      },
      rpc: () => Promise.resolve({ data: false, error: null })
    }
  : createClient(supabaseUrl, supabaseAnonKey)

// Environment configuration helper
export const config = {
  supabaseUrl,
  supabaseAnonKey,
  isDevelopment: import.meta.env.MODE === 'development'
}
