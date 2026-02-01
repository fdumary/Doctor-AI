import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseInstance: SupabaseClient | null = null;

// Create a single shared Supabase client instance (lazy initialization)
export const supabase = (function() {
  if (!supabaseInstance) {
    if (!projectId || !publicAnonKey) {
      console.error('Supabase credentials not available');
      throw new Error('Supabase credentials not available');
    }
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return supabaseInstance;
})();