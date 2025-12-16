# 🚀 Démarrage Rapide - Validation Zod

## ✅ Installation Terminée !

Le service de validation Zod est maintenant intégré à votre projet.

---

## 🎯 En 3 Commandes

### 1. Tester les exemples de validation
```bash
cd server
npm run validate:examples
```
Cela va exécuter 10 exemples montrant comment Zod protège votre application.

### 2. Démarrer le serveur
```bash
npm run dev
```
Le serveur démarre avec toutes les routes protégées par Zod.

### 3. Tester avec Postman/Thunder Client
Essayez d'envoyer des requêtes invalides :

**Exemple : Titre trop court (sera bloqué)**
```http
POST http://localhost:3000/api/videos/upload
Content-Type: multipart/form-data

{
  "title": "Hi",
  "theme_id": 5,
  "video": [fichier.mp4]
}
```

**Réponse attendue :**
```json
{
  "success": false,
  "message": "Validation échouée pour body",
  "errors": [
    {
      "field": "title",
      "message": "Le titre doit contenir au moins 3 caractères"
    }
  ]
}
```

---

## 🛡️ Protections Actives

- ✅ **SQL Injection** : theme_id forcé en nombre
- ✅ **XSS** : Caractères `< > " ' ;` bloqués
- ✅ **Pollution de données** : Seuls champs définis acceptés
- ✅ **IDs invalides** : Validés comme entiers positifs
- ✅ **Métadonnées** : Durée 10-60s, Taille max 45Mo

---

## 📖 Documentation

1. **README_ZOD_INTEGRATION.md** - Vue d'ensemble complète
2. **server/INTEGRATION_ZOD.md** - Guide d'intégration détaillé
3. **server/src/services/VALIDATION_README.md** - Documentation technique

---

## 💡 Utilisation dans le Code

### Dans une route
```javascript
import { validateBody } from '../middlewares/validate.middleware.js';
import { createVideoSchema } from '../schemas/video.schema.js';

router.post('/videos', 
  validateBody(createVideoSchema),
  controller.create
);
```

### Dans un service
```javascript
import { validateCreateVideo } from '../services/validate.service.video.js';

const result = validateCreateVideo(data);
if (!result.success) {
  console.error(result.errors);
}
```

---

## 🎉 C'est Tout !

Votre application est maintenant sécurisée. Toutes les routes vidéo sont automatiquement validées.

**Questions ?** Consultez la documentation dans les fichiers mentionnés ci-dessus.

