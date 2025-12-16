import React, { useState, useEffect } from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';
import Carrousel from './features/carroussel';
import ProductList from './features/videoCard';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les vidéos depuis le backend
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        
        // TODO: Remplacer par votre endpoint API
        // const response = await fetch('http://localhost:3000/api/videos');
        // const data = await response.json();
        // setVideos(data);
        
        // Pour l'instant, tableau vide - les vidéos de test sont dans le carrousel
        setVideos([]);
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

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
