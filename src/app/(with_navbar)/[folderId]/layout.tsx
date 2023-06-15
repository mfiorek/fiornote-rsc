import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbHandlers from '@/db/handlers';
import ContentLink from '@/components/ContentLink';
import { ChevronLeftIcon, DocumentPlusIcon, FolderOpenIcon, FolderPlusIcon, HomeIcon } from '@heroicons/react/24/outline';

export default async function Layout({ children, params }: { children: React.ReactNode; params: { folderId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login');
  }
  const foldersData = await dbHandlers.folder.getAll(session.user.id);
  const notesData = await dbHandlers.note.getAll(session.user.id);

  const leftFolder = foldersData.find((folder) => folder.id === params.folderId);

  return (
    <div className='w-full grow grid-cols-[1fr_1px_2fr] gap-2 sm:grid'>
      {/* LEFT COLUMN */}
      <div id='leftColumn' className='hidden w-full flex-col gap-2 sm:flex'>
        {/* LEFT NAV */}
        <div id='leftNav' className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link href={params.folderId !== 'home' ? `/${leftFolder?.parentFolderId || 'home'}/folder/${params.folderId}` : '/'} className='rounded bg-slate-700 p-2'>
              <ChevronLeftIcon className='h-6 w-6' />
            </Link>
            {params.folderId !== 'home' ? <FolderOpenIcon className='h-6 w-6' /> : <HomeIcon className='h-6 w-6' />}
            <p className='text-xl'>{leftFolder?.name || 'Home'}</p>
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
            .filter((folder) => (leftFolder ? folder.parentFolderId === leftFolder.id : folder.parentFolderId === null))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((folder) => (
              <ContentLink key={folder.id} href={`/${params.folderId}/folder/${folder.id}`} text={folder.name} variant='folder' />
            ))}
        </div>
        <div id='leftNotes' className='flex w-full flex-col gap-2 empty:hidden'>
          {notesData
            .filter((note) => (leftFolder ? note.parentFolderId === leftFolder.id : note.parentFolderId === null))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((note) => (
              <ContentLink key={note.id} href={`/${params.folderId}/note/${note.id}`} text={note.name} variant='note' />
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
