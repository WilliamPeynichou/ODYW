import React, { useState, useEffect } from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';
import Carrousel from './features/carroussel';
import ProductList from './features/videoCard';
import VideoIntro from './features/VideoIntro';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les vidéos depuis le backend
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
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
    <div className="relative">
      {/* 1. La vidéo d'intro fixe en arrière-plan */}
      <VideoIntro />

      {/* 2. Le contenu qui scrolle par-dessus */}
      {/* mt-[100vh] pousse le contenu en bas de l'écran initialement */}
      <div className="relative z-10 mt-[100vh]">
        
        {/* Container principal avec fond blanc et effet de carte */}
        <div className="bg-white min-h-screen rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
          
          <Header />
          
          <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <div className="flex flex-col items-center space-y-12 w-full">
              
              {/* Titre principal stylisé */}
              <div className="text-center space-y-2 mt-8">
                <div className="text-8xl font-thin tracking-tighter text-gray-900 font-sans">
                  ODYWP
                </div>
                <p className="text-gray-500 font-light tracking-widest uppercase text-sm">
                  L'art de la vidéo
                </p>
              </div>
              
              <Carrousel videos={videos} />
              
              <ProductList />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
