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
  const [contentList, setContentList] = useState<(Folder | Note)[]>([
    { id: null as unknown as string, createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString(), name: 'Home', parentFolderId: null, userId: userId },
  ]);
  const [numberOfColumns, setNumberOfColumns] = useState(2);
  const [lastIndexShown, setLastIndexShown] = useState(0);
  const indicesShown = [...Array(numberOfColumns).keys()].map((i) => i + lastIndexShown - numberOfColumns + 1);

  const stubContent = { id: 'stub', createdAt: new Date().toUTCString(), updatedAt: new Date().toUTCString(), name: '', parentFolderId: null, userId: userId };

  useEffect(() => {
    const firstStubIndex = contentList.findIndex((content) => content.id === 'stub');
    setLastIndexShown(firstStubIndex !== -1 ? firstStubIndex - 1 : contentList.length - 1);
  }, [numberOfColumns, contentList]);

  function isNote(item: Folder | Note): item is Note {
    return (item as Note).text !== undefined;
  }

  function addToContentList(content: Folder | Note) {
    const newContentList = [...contentList];

    const firstStubIndex = newContentList.findIndex((content) => content.id === 'stub');
    if (firstStubIndex > -1) {
      newContentList.splice(firstStubIndex);
    }

    const existingElementIndex = newContentList.findIndex((el) => el.id === content.id);
    if (existingElementIndex > -1) {
      newContentList.fill(stubContent, existingElementIndex);
      setContentList(newContentList);
      return;
    }

    const existingParentElementIndex = newContentList.findIndex((el) => el.id !== null && el.parentFolderId === content.parentFolderId);
    if (existingParentElementIndex > -1) {
      newContentList[existingParentElementIndex] = content;
      newContentList.fill(stubContent, existingParentElementIndex + 1);
      setContentList(newContentList);
      return;
    }

    newContentList.push(content);
    setContentList(newContentList);
    return;
  }

  function removeFromContentList() {
    const newContentList = [...contentList];

    const firstStubIndex = newContentList.findIndex((content) => content.id === 'stub');
    if (firstStubIndex > -1) {
      newContentList.splice(firstStubIndex);
    }

    newContentList.fill(stubContent, lastIndexShown);
    setContentList(newContentList);
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
                <button className='rounded bg-slate-700 p-2' onClick={() => removeFromContentList()}>
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
                isSelected={contentList.some((el) => el.id === folder.id)}
              />
            ))}
        </div>
        <div id='rightFolderNotes' className='flex w-full flex-col gap-2 empty:hidden'>
          {notesData
            .filter((el) => el.parentFolderId === folder.id)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((note) => (
              <ContentButton key={note.id} onClick={() => addToContentList(note)} text={note.name} variant='note' isSelected={contentList.some((el) => el.id === note.id)} />
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
            <button className='block rounded bg-slate-700 p-2' onClick={() => removeFromContentList()}>
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
              style={{ flexGrow: lastIndexShown === index ? 2 : indicesShown.includes(index) ? 1 : 0 }}
            >
              <div key={content.id} className='flex w-full flex-col gap-2 px-2'>
                {isNote(content) ? <NoteColumn note={content} /> : <FolderColumn folder={content} />}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default PageContent;
