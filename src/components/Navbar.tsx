import React, { useState } from 'react';
import { Kaushan_Script } from 'next/font/google';

const kaushan = Kaushan_Script({ weight: '400', subsets: ['latin'] });

const Navbar: React.FC = () => {
  return (
    <div className='flex w-full items-center justify-center bg-slate-700 p-2'>
      <h1 className={`select-none text-2xl ${kaushan.className}`}>fiorNote</h1>
    </div>
  );
};

export default Navbar;
