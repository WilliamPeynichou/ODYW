import React from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="text-8xl font-normal text-gray-900">
            ODYWP
          </div>
          
          <div className="w-full max-w-2xl">
            <div className="relative flex items-center rounded-full border border-gray-300 px-5 py-3 shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                className="flex-1 border-none bg-transparent outline-none text-base"
                placeholder=""
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>

          <div className="flex space-x-4 pt-2">
            <button className="px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded hover:border hover:border-gray-300 hover:shadow-sm">
              Recherche ODYWP
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded hover:border hover:border-gray-300 hover:shadow-sm">
              J'ai de la chance
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
