import { createClient } from '@supabase/supabase-js'

// Серверный клиент (обходит RLS, используется в Server Actions и API routes)
// НИКОГДА не свети этот SUPABASE_SERVICE_ROLE_KEY на фронте, сука!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Публичный клиент (для фронтенда, работает через RLS)
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
