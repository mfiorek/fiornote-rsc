import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import dbHandlers from '@/db/handlers';
import { authOptions } from '@/lib/auth';
import PageContent from './PageContent';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    // This is already done in middleware, but we need this for typesafety
    redirect('/login');
  }
  const foldersData = await dbHandlers.folder.getAll(session.user.id);
  const notesData = await dbHandlers.note.getAll(session.user.id);

  return <PageContent foldersData={foldersData} notesData={notesData} userId={session.user.id} />;
}
