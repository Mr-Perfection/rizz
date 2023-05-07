import { Session, createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { Database } from '@/db_types'

export default function supabaseClient() { return createBrowserSupabaseClient<Database>() }