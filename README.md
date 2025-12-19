# ODYW - Plateforme de Partage de Vidéos

ODYW est une application full-stack de partage de vidéos courtes (10 à 60 secondes) avec un système d'authentification, de commentaires, de notation et de gestion par thèmes.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Rôles et permissions](#rôles-et-permissions)

## ✨ Fonctionnalités

### Authentification & Utilisateurs
- Inscription et connexion utilisateur
- Authentification JWT
- Système de rôles (Utilisateur, Admin, Super Admin)
- Profils utilisateurs

### Gestion des vidéos
- Upload de vidéos (10-60 secondes, validation automatique de la durée)
- Lecture de vidéos
- CRUD complet des vidéos
- Filtrage par thèmes
- Barre de recherche
- Carrousel de vidéos

### Interactions
- Système de commentaires
- Système de notation/rating
- Gestion des thèmes/catégories

### Administration
- Dashboard administrateur
- Gestion des utilisateurs
- Gestion du contenu
- Dashboard super administrateur
- Routes protégées

### Interface
- Mode sombre/clair
- Design moderne avec TailwindCSS
- Effets visuels 3D avec Three.js et React Three Fiber
- Interface responsive

## 🛠 Technologies utilisées

### Backend
- **Node.js** avec **Express.js**
- **MySQL** (via mysql2)
- **JWT** pour l'authentification
- **Bcrypt** pour le hachage des mots de passe
- **Multer** pour l'upload de fichiers
- **FFmpeg** pour le traitement vidéo
- **Zod** v4 pour la validation des données
- **Morgan** pour le logging
- **CORS** pour la gestion des requêtes cross-origin

### Frontend
- **React 19**
- **Vite** comme bundler
- **React Router DOM** pour le routing
- **TailwindCSS** pour le styling
- **Three.js** & **React Three Fiber** pour les effets 3D
- **Shader Gradient** pour les effets visuels
- **DOMPurify** pour la sécurité XSS

## 📦 Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn
- FFmpeg installé sur le système

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd ODYW
```

### 2. Installation des dépendances

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## ⚙️ Configuration

### Backend

Créez un fichier `.env` dans le dossier `server/` avec les variables suivantes :

```env
# Port du serveur
PORT=3000

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_utilisateur
DB_PASS=votre_mot_de_passe
DB_NAME=odyw

# JWT Secret
JWT_SECRET=votre_secret_jwt_securise
```

### Base de données

Créez la base de données et les tables nécessaires. Voici la structure minimale requise :

```sql
CREATE DATABASE odyw;
USE odyw;

-- Tables : users, videos, themes, comments, ratings
-- (Ajoutez votre schéma SQL complet ici)
```

## 🎬 Démarrage

### Développement

#### 1. Démarrer le backend
```bash
cd server
npm run dev
```
Le serveur démarre sur `http://localhost:3000` (ou le port configuré)

#### 2. Démarrer le frontend
```bash
cd client
npm run dev
```
L'application démarre sur `http://localhost:5173` par défaut

### Production

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run build
npm run preview
```

## 📁 Structure du projet

```
ODYW/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/          # Composants React
│   │   │   ├── auth/           # Composants d'authentification
│   │   │   └── features/       # Composants des fonctionnalités
│   │   ├── pages/              # Pages de l'application
│   │   │   └── admin/          # Pages admin
│   │   ├── layout/             # Composants de mise en page
│   │   ├── service/            # Services API
│   │   └── utils/              # Utilitaires
│   └── package.json
│
└── server/                      # Backend Node.js
    ├── src/
    │   ├── controllers/        # Contrôleurs
    │   ├── services/           # Logique métier
    │   ├── routes/             # Routes API
    │   ├── middlewares/        # Middlewares
    │   │   ├── validator/      # Validateurs Zod
    │   │   └── ...
    │   ├── config/             # Configuration
    │   ├── db/                 # Connexion base de données
    │   └── utils/              # Utilitaires
    ├── uploads/                # Fichiers uploadés
    │   └── videos/
    └── package.json
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Vidéos
- `GET /api/videos` - Liste des vidéos
- `GET /api/videos/:id` - Détails d'une vidéo
- `POST /api/videos` - Upload de vidéo (authentifié)
- `PUT /api/videos/:id` - Modification (propriétaire/admin)
- `DELETE /api/videos/:id` - Suppression (propriétaire/admin)

### Commentaires
- `GET /api/comments` - Liste des commentaires
- `POST /api/comments` - Ajouter un commentaire (authentifié)
- `PUT /api/comments/:id` - Modifier un commentaire (propriétaire/admin)
- `DELETE /api/comments/:id` - Supprimer un commentaire (propriétaire/admin)

### Thèmes
- `GET /api/themes` - Liste des thèmes
- `POST /api/themes` - Créer un thème (admin)
- `PUT /api/themes/:id` - Modifier un thème (admin)
- `DELETE /api/themes/:id` - Supprimer un thème (admin)

### Administration
- `GET /api/admin/users` - Gestion des utilisateurs (admin)
- `PUT /api/admin/users/:id` - Modifier un utilisateur (admin)
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur (super admin)

## 🔐 Rôles et permissions

### Utilisateur
- Upload de vidéos
- Commentaires et notations
- Modification/suppression de son propre contenu

### Admin
- Toutes les permissions utilisateur
- Modération du contenu
- Gestion des thèmes
- Gestion des utilisateurs

### Super Admin
- Toutes les permissions admin
- Suppression des utilisateurs
- Accès complet à l'administration

## 📝 Contraintes

### Vidéos
- Durée : entre 10 et 60 secondes
- Formats supportés : MP4, MOV, etc. (selon FFmpeg)
- Validation automatique de la durée à l'upload

### Sécurité
- Authentification JWT obligatoire pour les actions sensibles
- Validation des données avec Zod
- Protection XSS avec DOMPurify
- Hachage des mots de passe avec Bcrypt
- CORS configuré

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

ISC

## 👤 Auteur

William Peynichou, Yussuf Buyukaydin, David Ballestro, Peters Muel

**Note** : Ce projet a été développé dans un cadre pédagogique.
