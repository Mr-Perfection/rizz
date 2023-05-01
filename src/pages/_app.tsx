import '@/styles/globals.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query';

import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google';

import { Session, createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Database } from '../db_types'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {
  const queryClient = new QueryClient();
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>())
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <div className={inter.className}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </div>
    </SessionContextProvider>
  )
}
