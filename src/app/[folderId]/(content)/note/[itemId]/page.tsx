import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbHandlers from '@/db/handlers';
import ReactMarkdown from 'react-markdown';
import { ChevronLeftIcon, DocumentIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default async function NotePage({ params }: { params: { folderId: string; itemId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    // TODO implement custom login page
    redirect('/api/auth/signin');
  }
  const foldersData = await dbHandlers.folder.getAll(session.user.id);
  const notesData = await dbHandlers.note.getAll(session.user.id);

  const currentNote = notesData.find((note) => note.id === params.itemId);
  if (!currentNote) {
    redirect('/404');
  }
  const leftFolder = foldersData.find((folder) => folder.id === params.folderId);

  return (
    <>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <Link href={params.folderId !== 'home' ? `/${leftFolder?.parentFolderId || 'home'}/folder/${params.folderId}` : '/'} className='block rounded bg-slate-700 p-2 sm:hidden'>
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
          <DocumentIcon className='h-6 w-6' />
          <p className='text-xl'>{currentNote.name}</p>
        </div>
        <button className='rounded bg-slate-700 p-2'>
          <PencilSquareIcon className='h-6 w-6' />
        </button>
      </div>
      <span className='h-px bg-slate-600' />
      <ReactMarkdown className='markdown h-full w-full overflow-scroll p-2'>{currentNote.text}</ReactMarkdown>
    </>
  );
}
