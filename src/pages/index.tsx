import type { NextPage } from 'next';
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/db_types';
import { useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';

// const inter = Inter({ subsets: ['latin'] })

const LoginPage: NextPage = () => {
  const { isLoading, session, error } = useSessionContext();
  const supabase = useSupabaseClient<Database>()

  useEffect(() => {
    if (!isLoading && session) {
      Router.push('home')
    }
  }, [isLoading, session])

  return (
    <>
      <Head>
        <title>Sidekiq AI</title>
        <meta name="description" content="Your AI Sidekiq companion." />
        <meta
          name="viewport"
          content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`flex min-h-screen items-center justify-center p-10 lg:p-24`}
      >
        <div className="container flex justify-center" style={{ padding: '50px 0 100px 0' }}>
          <div className='w-full lg:w-1/2' aria-disabled={isLoading}>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark"/>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage;