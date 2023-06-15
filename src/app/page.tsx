import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import dbHandlers from '@/db/handlers';
import { authOptions } from '@/lib/auth';
import ContentLink from '@/components/ContentLink';
import { HomeIcon, DocumentPlusIcon, FolderPlusIcon } from '@heroicons/react/24/outline';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    // TODO implement custom login page
    redirect('/api/auth/signin');
  }
  const foldersData = await dbHandlers.folder.getAll(session.user.id);
  const notesData = await dbHandlers.note.getAll(session.user.id);

  return (
    <div className='mx-auto flex w-full flex-col gap-2 lg:max-w-5xl'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2 px-2'>
          <HomeIcon className='h-6 w-6' />
          <p className='text-xl'>Home</p>
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
      <span className='h-px bg-slate-600' />
      <div className='flex w-full flex-col gap-2'>
        <div className='flex w-full flex-col gap-2'>
          {foldersData
            .filter((folder) => !folder.parentFolderId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((folder) => (
              <ContentLink key={folder.id} href={`/home/folder/${folder.id}`} text={folder.name} variant='folder' />
            ))}
        </div>
        <div className='flex w-full flex-col gap-2'>
          {notesData
            .filter((note) => !note.parentFolderId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((note) => (
              <ContentLink key={note.id} href={`/home/note/${note.id}`} text={note.name} variant='note' />
            ))}
        </div>
      </div>
    </div>
  );
}
