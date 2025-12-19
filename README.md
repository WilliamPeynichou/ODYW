# ODYW
# ODYWP - L'art de la vidéo

ODYW/
├── client/          # Application React frontend
├── server/          # API Express backend

ODYWP est une plateforme moderne de partage et de découverte de vidéos avec une interface immersive et des animations interactives.

Fonctionnalités principales

Expérience utilisateur
- **Page d'accueil immersive** : Animation d'introduction avec vidéo de fond et shader gradient 3D qui zoom au scroll
- **Carrousel de vidéos interactif** : Navigation fluide avec aperçu des vidéos précédentes/suivantes, lecture automatique au survol
- **Galerie de vidéos** : Affichage en grille avec filtres et recherche
- **Page de détails vidéo** : Lecture complète, système de commentaires, notation, informations détaillées

Gestion de contenu
- **Upload de vidéos** : Téléchargement de vidéos avec traitement FFmpeg
- **Édition et suppression** : Modification des vidéos par le propriétaire ou les administrateurs
- **Système de thèmes/catégories** : Organisation des vidéos par catégories
- **Commentaires** : Système complet de commentaires avec création, modification et suppression

Authentification et autorisation
- **Inscription et connexion** : Système d'authentification sécurisé avec JWT
- **Profils utilisateurs** : Gestion du profil personnel
- **Système de rôles** : Utilisateur, Admin, Super-Admin avec permissions différenciées
- **Protection des routes** : Accès sécurisé selon les rôles

Admin
- **Tableau de bord admin** : Gestion du contenu et des utilisateurs
- **Tableau de bord super-admin** : Gestion complète des utilisateurs et des rôles
- **Modération** : Suppression de contenu et gestion des utilisateurs

Technologies utilisées

Frontend
- **React 19** avec Vite pour un développement rapide
- **React Router** pour la navigation
- **TailwindCSS** pour le design moderne et responsive
- **ShaderGradient** pour les animations 3D
- **Three.js** pour les effets visuels avancés

Backend
- **Node.js** avec Express pour l'API REST
- **MySQL** pour la base de données
- **JWT** pour l'authentification sécurisée
- **Multer** pour l'upload de fichiers
- **FFmpeg** pour le traitement vidéo
- **Zod** pour la validation des données

Architecture

Le projet suit une architecture client-serveur avec :
- **Client** : Application React moderne avec routing et gestion d'état
- **Serveur** : API REST avec middlewares d'authentification et d'autorisation
- **Base de données** : MySQL avec gestion des utilisateurs, vidéos, commentaires et thèmes

Interface utilisateur

Design épuré et moderne avec :
- Animations fluides au scroll
- Effets de transition élégants
- Design responsive pour tous les appareils
- Interface intuitive pour la navigation et la découverte de contenu

Installation

Prérequis:
- Node.js (v18 ou supérieur)
- MySQL
- FFmpeg

Client:
cd client
npm install
npm run dev### Serveur
cd server
npm install
npm run dev## 📝 Structure du projet

