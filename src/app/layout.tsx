import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'fiornote',
  description: 'fiornote - Notes app using React Server Components',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='flex min-h-screen flex-col bg-slate-800 text-slate-200'>
        <Navbar />
        <main className='flex w-full grow flex-col items-center p-2'>{children}</main>
      </body>
    </html>
  );
}
