import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { folder as dbFolder } from '@/db/schema';

const getAll = (userId: string) => {
    return db.select().from(dbFolder).where(eq(dbFolder.userId, userId));
};

const folder = {
  getAll: getAll,
};

export default folder;
