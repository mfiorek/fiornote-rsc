import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { note as dbNote } from '@/db/schema';

const getAll = (userId: string) => {
    return db.select().from(dbNote).where(eq(dbNote.userId, userId));
};

const note = {
  getAll: getAll,
};

export default note;
