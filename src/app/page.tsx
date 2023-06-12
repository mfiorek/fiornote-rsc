import { db } from '@/db/db'
import { folder, note } from '@/db/schema'
import FolderLink from '@/components/FolderLink';
import NoteLink from '@/components/NoteLink';
import { HomeIcon, DocumentPlusIcon, FolderPlusIcon } from '@heroicons/react/24/outline';

const getFolderData = () => {
  return db.select().from(folder);
};

const getNotesData = () => {
  return db.select().from(note);
};

export default async function Home() {
  const folderData = await getFolderData();
  const notesData = await getNotesData();

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
          {folderData
            .filter((folder) => !folder.parentFolderId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((folder) => (
              <FolderLink key={folder.id} folder={folder} selectedItemId={folder.id} />
            ))}
        </div>
        <div className='flex w-full flex-col gap-2'>
          {notesData
            .filter((note) => !note.parentFolderId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((note) => (
              <NoteLink key={note.id} note={note} selectedItemId={note.id} />
            ))}
        </div>
      </div>
    </div>
  );
}
