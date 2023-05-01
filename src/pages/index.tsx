import type { NextPage } from 'next';
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '@/components/Account'
import { Database } from '@/db_types';
import { useEffect } from 'react';
import Router from 'next/router';

// const inter = Inter({ subsets: ['latin'] })

const LoginPage: NextPage = () => {
  const { isLoading, session, error } = useSessionContext();
  const supabase = useSupabaseClient<Database>()

  useEffect(() => {
    if (session) {
      Router.push('home')
    }
  }, [session])
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >

      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
      </div>
    </main>
  )
}

export default LoginPage;