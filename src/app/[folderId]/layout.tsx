import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbHandlers from '@/db/handlers';
import FolderLink from '@/components/FolderLink';
import NoteLink from '@/components/NoteLink';
import { ChevronLeftIcon, DocumentPlusIcon, FolderOpenIcon, FolderPlusIcon, HomeIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'fiornote',
  description: 'fiornote - Notes app using React Server Components',
};

export default async function Layout({ children, params }: { children: React.ReactNode; params: { folderId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    // TODO implement custom login page
    redirect('/api/auth/signin');
  }
  const foldersData = await dbHandlers.folder.getAll(session.user.id);
  const notesData = await dbHandlers.note.getAll(session.user.id);

  const currentFolder = foldersData.find((folder) => folder.id === params.folderId);
  const parentFolder = foldersData.find((folder) => folder.id === currentFolder?.parentFolderId);

  return (
    <div className='w-full grow grid-cols-[1fr_1px_2fr] gap-2 sm:grid'>
      {/* LEFT COLUMN */}
      <div id='leftColumn' className='hidden w-full flex-col gap-2 sm:flex'>
        {/* LEFT NAV */}
        <div id='leftNav' className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link href={!!parentFolder ? `/${parentFolder.id}` : '/'} className='rounded bg-slate-700 p-2'>
              <ChevronLeftIcon className='h-6 w-6' />
            </Link>
            {parentFolder ? <FolderOpenIcon className='h-6 w-6' /> : <HomeIcon className='h-6 w-6' />}
            <p className='text-xl'>{parentFolder?.name || 'Home'}</p>
          </div>
          <div className='flex gap-2'>
            <button className='rounded bg-slate-700 p-2'>
              <FolderPlusIcon className='h-6 w-6' />
            </button>
            <button className='rounded bg-slate-700 p-2'>
              <DocumentPlusIcon className='h-6 w-6' />
            </button>
          </div>
        </div>
        {/* LEFT DIVIDER */}
        <span id='leftDivider' className='h-px bg-slate-600' />
        {/* LEFT CONTENTS */}
        <div id='leftFolders' className='flex w-full flex-col gap-2 empty:hidden'>
          {foldersData
            .filter((folder) => (parentFolder ? folder.parentFolderId === parentFolder.id : folder.parentFolderId === null))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((folder) => (
              <FolderLink key={folder.id} folder={folder} selectedItemId={folder.id} />
            ))}
        </div>
        <div id='leftNotes' className='flex w-full flex-col gap-2 empty:hidden'>
          {notesData
            .filter((note) => (parentFolder ? note.parentFolderId === parentFolder.id : note.parentFolderId === null))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((note) => (
              <NoteLink key={note.id} note={note} selectedItemId={note.id} />
            ))}
        </div>
      </div>

      {/* DIVIDER */}
      <span id='divider' className='hidden bg-slate-600 sm:block' />

      {/* RIGHT COLUMN */}
      <div id='rightColumn' className='flex w-full flex-col gap-2'>
        {children}
      </div>
    </div>
  );
}
