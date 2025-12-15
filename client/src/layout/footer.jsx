import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white text-sm text-gray-600">
      <div className="border-b border-gray-200 px-6 py-3">
        <span className="text-gray-600">France</span>
      </div>
      <div className="flex flex-col items-center justify-between px-6 py-4 md:flex-row">
        <div className="mb-4 flex flex-wrap justify-center gap-6 md:mb-0">
          <a href="#" className="hover:underline">À propos</a>
          <a href="#" className="hover:underline">Publicité</a>
          <a href="#" className="hover:underline">Entreprise</a>
          <a href="#" className="hover:underline">Comment fonctionne la recherche</a>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:underline">Confidentialité</a>
          <a href="#" className="hover:underline">Conditions</a>
          <a href="#" className="hover:underline">Paramètres</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
