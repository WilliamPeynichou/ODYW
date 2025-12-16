import React from 'react';
import AddVideoButton from './button/addVideoButton';

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between bg-white px-4 py-3">
      <div className="flex items-center">
        <a href="/" className="text-xl font-normal text-gray-900">
          ODYWP
        </a>
      </div>
      <div className="flex items-center">
        <AddVideoButton />
      </div>
    </header>
  );
};

export default Header;
