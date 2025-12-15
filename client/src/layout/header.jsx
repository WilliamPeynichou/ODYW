import React from 'react';

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between bg-white px-4 py-3">
      <div className="flex items-center">
        <a href="/" className="text-xl font-normal text-gray-900">
          ODYWP
        </a>
      </div>
      <nav className="flex items-center space-x-4">
        <a href="#" className="text-sm text-gray-700 hover:underline">
          Gmail
        </a>
        <a href="#" className="text-sm text-gray-700 hover:underline">
          Images
        </a>
        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          </svg>
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
          Connexion
        </button>
      </nav>
    </header>
  );
};

export default Header;
