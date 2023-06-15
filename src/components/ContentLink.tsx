import React from 'react';
import Link from 'next/link';
import { DocumentIcon, FolderIcon } from '@heroicons/react/24/outline';

interface ContentLinkProps {
  href: string;
  text: string;
  variant: 'folder' | 'note';
}

const ContentLink: React.FC<ContentLinkProps> = ({ href, text, variant }) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'folder':
        return 'border-sky-600';
      case 'note':
        return 'border-emerald-600';
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'folder':
        return <FolderIcon className='h-6 w-6 text-sky-600' />;
      case 'note':
        return <DocumentIcon className='h-6 w-6 text-emerald-600' />;
      default:
        return null;
    }
  };

  return (
    <Link href={href} className={`flex w-full gap-2 rounded border ${getBorderColor()} bg-slate-700 p-3`}>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-1 gap-2'>
          {getIcon()}
          <p>{text}</p>
        </div>
      </div>
    </Link>
  );
};

export default ContentLink;
