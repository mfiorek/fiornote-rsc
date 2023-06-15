import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Kaushan_Script } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import GitHubLoginButton from './GitHubLoginButton';

const kaushan = Kaushan_Script({ weight: '400', subsets: ['latin'] });

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session && session.user) {
    redirect('/');
  }

  return (
    <>
      <div className='flex w-full grow flex-col items-center justify-center gap-8 bg-slate-200 dark:bg-slate-800 lg:flex-row lg:gap-16'>
        <section className='flex flex-col items-center gap-4'>
          <h1 className='font-boldd text-4xl'>Login to</h1>
          <h1 className={`select-none text-8xl ${kaushan.className}`}>fiorNote</h1>
        </section>
        <section className='flex w-96 flex-col items-center gap-4 rounded-2xl bg-slate-300 p-6 font-medium shadow-2xl dark:bg-slate-700'>
          <p className='text-2xl'>
            Passwords are <strong>bad</strong>
          </p>
          <div className='mb-6 text-center'>
            <p>You don&apos;t want another.</p>
            <p>Instead, login with one of your already existing passwords:</p>
          </div>
          <GitHubLoginButton />
        </section>
      </div>
    </>
  );
}
