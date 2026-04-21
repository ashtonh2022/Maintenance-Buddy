import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types';

const isServer = typeof window === 'undefined';

const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

console.log('URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('KEY exists:', !!process.env.EXPO_PUBLIC_SUPABASE_KEY);

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,

  {
    auth: {
      storage: isServer ? noopStorage : AsyncStorage,
      autoRefreshToken: !isServer,
      persistSession: !isServer,
      detectSessionInUrl: false,
    },
  })
