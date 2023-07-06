'use client';

import React, { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import type { Folder, Note } from '@/db/schema';
import ContentButton from '@/components/ContentButton';
import { ChevronLeftIcon, DocumentIcon, DocumentPlusIcon, FolderOpenIcon, FolderPlusIcon, HomeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

type PageContentProps = {
  foldersData: Folder[];
  notesData: Note[];
  userId: string;
};

const PageContent: React.FC<PageContentProps> = ({ foldersData, notesData, userId }) => {
  const [contentList, setContentList] = useState<(Folder | Note | null)[]>([
    { id: null as unknown as string, createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString(), name: 'Home', parentFolderId: null, userId: userId },
  ]);
  const [numberOfColumns, setNumberOfColumns] = useState(2);
  const [lastIndexShown, setLastIndexShown] = useState(0);
  const [lastIndexShownCopy, setLastIndexShownCopy] = useState(0);
  const indicesShown = [...Array(numberOfColumns).keys()].map((i) => i + lastIndexShownCopy - numberOfColumns + 1);
  const contentShown = contentList.filter((el, index) => indicesShown.includes(index));

  useEffect(() => {
    setLastIndexShownCopy(lastIndexShown);
  }, [lastIndexShown]);

  function isNote(item: Folder | Note): item is Note {
    return (item as Note).text !== undefined;
  }

  function addToContentList(content: Folder | Note) {
    const newContentList = [...contentList];

    const existingElementIndex = newContentList.findIndex((el) => el !== null && el.id === content.id);
    if (existingElementIndex > -1) {
      if (indicesShown.includes(existingElementIndex)) {
        newContentList.fill(null, existingElementIndex);
        setContentList(newContentList);
      }
      setLastIndexShown(existingElementIndex);
      return;
    }

    const existingParentElementIndex = newContentList.findIndex((el) => el !== null && el.id !== null && el.parentFolderId === content.parentFolderId);
    if (existingParentElementIndex > -1) {
      newContentList[existingParentElementIndex] = content;
      newContentList.fill(null, existingParentElementIndex + 1);
      setContentList(newContentList);
      setLastIndexShown(existingParentElementIndex);
      return;
    }

    const firstNullIndex = newContentList.findIndex((el) => el === null);
    if (firstNullIndex > -1) {
      newContentList.splice(firstNullIndex);
    }

    newContentList.push(content);
    setContentList(newContentList);
    setLastIndexShown(newContentList.length - 1);
    return;
  }

  function removeFromContentList(content: Folder | Note) {
    const clickedIndex = contentList.findIndex((el) => el === content);
    setLastIndexShown(clickedIndex - 1);
  }

  const FolderColumn = ({ folder }: { folder: Folder }) => {
    return (
      <div className='flex grow flex-col gap-2'>
        {/* NAV */}
        <div id='rightFolderNav' className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            {folder.id === null ? (
              <HomeIcon className='h-6 w-6' />
            ) : (
              <>
                <button className='rounded bg-slate-700 p-2' onClick={() => removeFromContentList(folder)}>
                  <ChevronLeftIcon className='h-6 w-6' />
                </button>
                <FolderOpenIcon className='h-6 w-6' />
              </>
            )}
            <p className='text-xl'>{folder.name}</p>
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
            .filter((el) => el.parentFolderId === folder.id)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((folder) => (
              <ContentButton
                key={folder.id}
                onClick={() => addToContentList(folder)}
                text={folder.name}
                variant='folder'
                isSelected={contentShown.some((el) => el !== null && el.id === folder.id)}
              />
            ))}
        </div>
        <div id='rightFolderNotes' className='flex w-full flex-col gap-2 empty:hidden'>
          {notesData
            .filter((el) => el.parentFolderId === folder.id)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((note) => (
              <ContentButton
                key={note.id}
                onClick={() => addToContentList(note)}
                text={note.name}
                variant='note'
                isSelected={contentShown.some((el) => el !== null && el.id === note.id)}
              />
            ))}
        </div>
      </div>
    );
  };
  const NoteColumn = ({ note }: { note: Note }) => {
    return (
      <>
        {/* NAV */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <button className='block rounded bg-slate-700 p-2' onClick={() => removeFromContentList(note)}>
              <ChevronLeftIcon className='h-6 w-6' />
            </button>
            <DocumentIcon className='h-6 w-6' />
            <p className='text-xl'>{note.name}</p>
          </div>
          <button className='rounded bg-slate-700 p-2'>
            <PencilSquareIcon className='h-6 w-6' />
          </button>
        </div>
        {/* DIVIDER */}
        <span className='h-px bg-slate-600' />
        {/* CONTENTS */}
        <ReactMarkdown className='markdown h-full w-full overflow-scroll p-2'>{note.text}</ReactMarkdown>
      </>
    );
  };

  return (
    <>
      <div className='flex w-full grow'>
        {contentList.map((content, index) => {
          const dividerClass = index !== 0 && index !== indicesShown[0] && indicesShown.includes(index) ? 'border-l border-slate-600' : 'border-transparent';
          return (
            <section
              className={`flex basis-0 overflow-hidden transition-all duration-300 ${dividerClass}`}
              style={{ flexGrow: lastIndexShownCopy === index ? 2 : indicesShown.includes(index) ? 1 : 0 }}
            >
              <div key={content?.id} className='flex w-full flex-col gap-2 px-2'>
                {content && (isNote(content) ? <NoteColumn note={content} /> : <FolderColumn folder={content} />)}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default PageContent;
