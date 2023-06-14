import { db } from '@/db/db';
import { folder as dbFolder } from '@/db/schema';

const getAll = (userId: string) => {
  //   return db.select().from(folder).where(eq(folder.userId, userId));
  return db.select().from(dbFolder);
};

const folder = {
  getAll: getAll,
};

export default folder;
