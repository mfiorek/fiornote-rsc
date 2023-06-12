import { pgTable, foreignKey, text, timestamp, uniqueIndex, integer } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const note = pgTable('Note', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
  name: text('name').notNull(),
  text: text('text').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  parentFolderId: text('parentFolderId').references(() => folder.id, { onDelete: 'set null', onUpdate: 'cascade' }),
});
export type Note = InferModel<typeof note, "select">;

export const folder = pgTable(
  'Folder',
  {
    id: text('id').primaryKey().notNull(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
    name: text('name').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    parentFolderId: text('parentFolderId'),
  },
  (table) => {
    return {
      folderParentFolderIdFkey: foreignKey({
        columns: [table.parentFolderId],
        foreignColumns: [table.id],
      })
        .onUpdate('cascade')
        .onDelete('set null'),
    };
  },
);
export type Folder = InferModel<typeof folder, "select">;

export const user = pgTable(
  'User',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name'),
    email: text('email'),
    emailVerified: timestamp('emailVerified', { precision: 3, mode: 'string' }),
    image: text('image'),
  },
  (table) => {
    return {
      emailKey: uniqueIndex('User_email_key').on(table.email),
    };
  },
);

export const session = pgTable(
  'Session',
  {
    id: text('id').primaryKey().notNull(),
    sessionToken: text('sessionToken').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    expires: timestamp('expires', { precision: 3, mode: 'string' }).notNull(),
  },
  (table) => {
    return {
      sessionTokenKey: uniqueIndex('Session_sessionToken_key').on(table.sessionToken),
    };
  },
);

export const account = pgTable(
  'Account',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: uniqueIndex('Account_provider_providerAccountId_key').on(table.provider, table.providerAccountId),
    };
  },
);

export const verificationToken = pgTable(
  'VerificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { precision: 3, mode: 'string' }).notNull(),
  },
  (table) => {
    return {
      identifierTokenKey: uniqueIndex('VerificationToken_identifier_token_key').on(table.identifier, table.token),
      tokenKey: uniqueIndex('VerificationToken_token_key').on(table.token),
    };
  },
);
