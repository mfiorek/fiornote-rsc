import './globals.css';

export const metadata = {
  title: 'fiornote',
  description: 'fiornote - Notes app using React Server Components',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='bg-slate-800 text-slate-200'>{children}</body>
    </html>
  );
}
