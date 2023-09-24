import {
  pgTable,
  foreignKey,
  text,
  timestamp,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";

export const note = pgTable("Note", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  name: text("name").notNull(),
  text: text("text").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  parentFolderId: text("parentFolderId").references(() => folder.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});
export type Note = InferSelectModel<typeof note>;

export const folder = pgTable(
  "Folder",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
    name: text("name").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    parentFolderId: text("parentFolderId"),
  },
  (table) => {
    return {
      folderParentFolderIdFkey: foreignKey({
        columns: [table.parentFolderId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("set null"),
    };
  }
);
export type Folder = InferSelectModel<typeof folder>;

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);
