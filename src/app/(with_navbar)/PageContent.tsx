'use client';

import React, { PropsWithChildren, useState } from 'react';
import type { Folder, Note } from '@/db/schema';
import ContentButton from '@/components/ContentButton';
import { HomeIcon, DocumentPlusIcon, FolderPlusIcon, ChevronLeftIcon, FolderOpenIcon, DocumentIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

function isNote(item: Folder | Note): item is Note {
  return (item as Note).text !== undefined;
}

type PageContentProps = {
  foldersData: Folder[];
  notesData: Note[];
};

const PageContent: React.FC<PropsWithChildren<PageContentProps>> = ({ foldersData, notesData, children }) => {
  const [leftFolder, setLeftFolder] = useState<Folder | null>(null);
  const [rightItem, setRightItem] = useState<Folder | Note | null>(null);

  return (
    <div className='w-full grow grid-cols-[1fr_1px_2fr] gap-2 sm:grid'>
      {/* LEFT COLUMN */}
      <div id='leftColumn' className='hidden w-full flex-col gap-2 sm:flex'>
        {/* LEFT NAV */}
        <div id='leftNav' className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            {leftFolder?.parentFolderId !== undefined && (
              <button
                className='rounded bg-slate-700 p-2'
                onClick={() => {
                  setRightItem(leftFolder);
                  setLeftFolder(foldersData.find((folder) => folder.id === leftFolder.parentFolderId) || null);
                }}
              >
                <ChevronLeftIcon className='h-6 w-6' />
              </button>
            )}
            {leftFolder?.parentFolderId !== undefined ? <FolderOpenIcon className='h-6 w-6' /> : <HomeIcon className='h-6 w-6' />}
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
              <ContentButton
                key={folder.id}
                onClick={() => (rightItem?.id === folder.id ? setRightItem(null) : setRightItem(folder))}
                text={folder.name}
                variant='folder'
                isSelected={folder.id === rightItem?.id}
              />
            ))}
        </div>
        <div id='leftNotes' className='flex w-full flex-col gap-2 empty:hidden'>
          {notesData
            .filter((note) => (leftFolder ? note.parentFolderId === leftFolder.id : note.parentFolderId === null))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((note) => (
              <ContentButton
                key={note.id}
                onClick={() => (rightItem?.id === note.id ? setRightItem(null) : setRightItem(note))}
                text={note.name}
                variant='note'
                isSelected={note.id === rightItem?.id}
              />
            ))}
        </div>
      </div>

      {/* DIVIDER */}
      <span id='divider' className='hidden bg-slate-600 sm:block' />

      {/* RIGHT COLUMN */}
      <div id='rightColumn' className='flex w-full flex-col gap-2'>
        {rightItem && !isNote(rightItem) && (
          <>
            {/* NAV */}
            <div id='rightFolderNav' className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-2'>
                {leftFolder?.parentFolderId !== undefined && (
                  <button
                    className='block rounded bg-slate-700 p-2 sm:hidden'
                    onClick={() => {
                      setRightItem(leftFolder);
                      setLeftFolder(foldersData.find((folder) => folder.id === leftFolder.parentFolderId) || null);
                    }}
                  >
                    <ChevronLeftIcon className='h-6 w-6' />
                  </button>
                )}
                <FolderOpenIcon className='h-6 w-6' />
                <p className='text-xl'>{rightItem.name}</p>
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
                .filter((folder) => folder.parentFolderId === rightItem.id)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((folder) => (
                  <ContentButton
                    key={folder.id}
                    onClick={() => {
                      setLeftFolder(rightItem);
                      setRightItem(folder);
                    }}
                    text={folder.name}
                    variant='folder'
                  />
                ))}
            </div>
            <div id='rightFolderNotes' className='flex w-full flex-col gap-2 empty:hidden'>
              {notesData
                .filter((note) => note.parentFolderId === rightItem.id)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((note) => (
                  <ContentButton
                    key={note.id}
                    onClick={() => {
                      setLeftFolder(rightItem);
                      setRightItem(note);
                    }}
                    text={note.name}
                    variant='note'
                  />
                ))}
            </div>
          </>
        )}

        {rightItem && isNote(rightItem) && (
          <>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                {leftFolder?.parentFolderId !== undefined && (
                  <button
                    className='block rounded bg-slate-700 p-2 sm:hidden'
                    onClick={() => {
                      setRightItem(leftFolder);
                      setLeftFolder(foldersData.find((folder) => folder.id === leftFolder.parentFolderId) || null);
                    }}
                  >
                    <ChevronLeftIcon className='h-6 w-6' />
                  </button>
                )}
                <DocumentIcon className='h-6 w-6' />
                <p className='text-xl'>{rightItem.name}</p>
              </div>
              <button className='rounded bg-slate-700 p-2'>
                <PencilSquareIcon className='h-6 w-6' />
              </button>
            </div>
            <span className='h-px bg-slate-600' />
            <ReactMarkdown className='markdown h-full w-full overflow-scroll p-2'>{rightItem.text}</ReactMarkdown>
          </>
        )}
      </div>
    </div>
  );
};

export default PageContent;
