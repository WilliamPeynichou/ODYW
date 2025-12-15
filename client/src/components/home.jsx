import React from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';
import Carrousel from './features/carroussel';
import ProductList from './features/videoCard';

const Home = () => {
  // Exemple de données vidéos - à remplacer par un fetch depuis le backend
  const videos = [];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="text-8xl font-normal text-gray-900">
            ODYWP
          </div>
          
          <Carrousel videos={videos} />
          
          <ProductList />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
