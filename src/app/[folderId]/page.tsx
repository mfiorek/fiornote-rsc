import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbHandlers from '@/db/handlers';
import FolderLink from '@/components/FolderLink';
import NoteLink from '@/components/NoteLink';
import { ChevronLeftIcon, DocumentPlusIcon, FolderOpenIcon, FolderPlusIcon } from '@heroicons/react/24/outline';

export default async function FolderPage({ params }: { params: { folderId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    // TODO implement custom login page
    redirect('/api/auth/signin');
  }
  const foldersData = await dbHandlers.folder.getAll(session.user.id);
  const notesData = await dbHandlers.note.getAll(session.user.id);

  const currentFolder = foldersData.find((folder) => folder.id === params.folderId);

  return (
    <>
      {/* NAV */}
      <div id='rightFolderNav' className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link href={!!currentFolder ? `/${currentFolder.parentFolderId}` : '/'} className='block rounded bg-slate-700 p-2 sm:hidden'>
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
          <FolderOpenIcon className='h-6 w-6' />
          <p className='text-xl'>{currentFolder?.name}</p>
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
      {/* DIVIDER */}
      <span id='rightFolderDivider' className='h-px bg-slate-600' />
      {/* CONTENTS */}
      <div id='rightFolderFolders' className='flex w-full flex-col gap-2 empty:hidden'>
        {foldersData
          .filter((folder) => folder.parentFolderId === currentFolder?.id)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((folder) => (
            <FolderLink key={folder.id} folder={folder} selectedItemId={folder.id} />
          ))}
      </div>
      <div id='rightFolderNotes' className='flex w-full flex-col gap-2 empty:hidden'>
        {notesData
          .filter((note) => note.parentFolderId === currentFolder?.id)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((note) => (
            <NoteLink key={note.id} note={note} selectedItemId={note.id} />
          ))}
      </div>
    </>
  );
}
