# 🛡️ Intégration de Zod - Service de Validation Vidéo

## ✅ Installation terminée

Le service de validation avec Zod a été intégré avec succès dans votre projet ODYW !

## 📦 Fichiers créés

### 1. **Schémas de validation**
- `server/src/schemas/video.schema.js`
  - Définit tous les schémas Zod pour la validation des vidéos
  - 6 schémas disponibles : création, mise à jour, ID, métadonnées, requêtes

### 2. **Service de validation**
- `server/src/services/validate.service.video.js`
  - Service complet avec 11 fonctions de validation
  - Gestion des erreurs formatées
  - Fonctions utilitaires (sanitize, isValid, etc.)

### 3. **Middleware de validation**
- `server/src/middlewares/validate.middleware.js`
  - 7 middlewares Express pour validation automatique
  - `validate()`, `validateBody()`, `validateParams()`, `validateQuery()`
  - Middlewares avancés : `validateMultiple()`, `validateOptional()`, `sanitize()`

### 4. **Documentation**
- `server/src/services/VALIDATION_README.md`
  - Documentation complète du service
  - Exemples d'utilisation
  - Guide de sécurité

### 5. **Tests**
- `server/src/services/__tests__/validate.service.video.test.js`
  - 28 tests de validation
  - Exemples concrets d'utilisation

## 📁 Fichiers modifiés

### 1. **Routes** - `server/src/routes/video.route.js`
✅ Toutes les routes sont maintenant protégées par Zod :
- `POST /upload` → Valide title et theme_id
- `GET /` → Valide les paramètres de query (filtres)
- `GET /:id` → Valide que l'ID est un nombre positif
- `PUT /:id` → Valide l'ID et les données de mise à jour
- `DELETE /:id` → Valide l'ID

### 2. **Contrôleurs** - `server/src/controllers/video.controller.js`
✅ Les contrôleurs utilisent maintenant les données validées :
- Suppression des validations manuelles redondantes
- Commentaires ajoutés pour clarifier le flux de validation
- Les données dans `req.body` et `req.params` sont maintenant **garanties sûres**

## 🔒 Protections de sécurité ajoutées

### 1. **Protection contre les injections SQL**
```javascript
// Avant : theme_id = "5 OR 1=1" → Injection possible
// Après : theme_id forcé à être un entier positif ✅
```

### 2. **Protection contre XSS**
```javascript
// Avant : title = "<script>alert('XSS')</script>" → Risque XSS
// Après : Caractères <, >, ", ', `, ;, \, {, } interdits ✅
```

### 3. **Protection contre la pollution de données**
```javascript
// Avant : { title: "OK", admin: true } → admin pourrait passer
// Après : Seuls title et theme_id sont acceptés ✅
```

### 4. **Validation stricte des types**
```javascript
// Avant : theme_id = "abc" → Pourrait causer des bugs
// Après : Converti automatiquement ou rejeté ✅
```

### 5. **Limites de longueur**
```javascript
// Avant : title = "A".repeat(10000) → Risque de buffer overflow
// Après : Limité à 3-200 caractères ✅
```

## 🚀 Comment tester

### Option 1 : Lancer le fichier de test

```bash
cd server
node src/services/__tests__/validate.service.video.test.js
```

Vous verrez 28 tests s'exécuter et démontrer les capacités de validation.

### Option 2 : Tester via Postman/Thunder Client

#### Test 1 : Upload valide
```http
POST http://localhost:3000/api/videos/upload
Content-Type: multipart/form-data

{
  "title": "Ma super vidéo",
  "theme_id": 5,
  "video": [fichier.mp4]
}
```
✅ Devrait fonctionner

#### Test 2 : Titre trop court
```http
POST http://localhost:3000/api/videos/upload
Content-Type: multipart/form-data

{
  "title": "Hi",
  "theme_id": 5,
  "video": [fichier.mp4]
}
```
❌ Erreur : "Le titre doit contenir au moins 3 caractères"

#### Test 3 : Caractères dangereux
```http
POST http://localhost:3000/api/videos/upload
Content-Type: multipart/form-data

{
  "title": "<script>alert('XSS')</script>",
  "theme_id": 5,
  "video": [fichier.mp4]
}
```
❌ Erreur : "Le titre contient des caractères non autorisés"

#### Test 4 : ID invalide
```http
GET http://localhost:3000/api/videos/abc
```
❌ Erreur : "L'ID doit être un nombre"

#### Test 5 : Pollution de données
```http
POST http://localhost:3000/api/videos/upload
Content-Type: multipart/form-data

{
  "title": "Vidéo normale",
  "theme_id": 5,
  "admin": true,
  "isVerified": true,
  "video": [fichier.mp4]
}
```
✅ Fonctionne mais `admin` et `isVerified` sont ignorés (protection)

### Option 3 : Tester depuis votre serveur

1. **Démarrer le serveur**
```bash
cd server
npm run dev
```

2. **Le serveur démarre avec la validation Zod active**

Toutes les requêtes sont maintenant automatiquement validées !

## 📊 Comparaison Avant/Après

### Avant Zod
```javascript
// Validation manuelle, incomplète
if (!title || !theme_id) {
  return sendValidationError(res, VALIDATION_ERRORS.MISSING_FIELDS);
}
// Pas de vérification de type, format, longueur
```

### Après Zod
```javascript
// Validation automatique dans le middleware
validateBody(createVideoSchema)

// Dans le contrôleur, les données sont garanties valides :
const { title, theme_id } = req.body; // ✅ Sûr à utiliser
```

## 🎯 Fonctionnalités principales

### 1. Validation automatique
- Les middlewares valident automatiquement avant d'atteindre les contrôleurs
- Les données invalides sont rejetées avec des messages clairs

### 2. Transformation des données
- `trim()` : Supprime les espaces
- `.coerce.number()` : Convertit "5" en 5
- Protection contre les caractères dangereux

### 3. Messages d'erreur détaillés
```json
{
  "success": false,
  "message": "Validation échouée pour body",
  "errors": [
    {
      "field": "title",
      "message": "Le titre doit contenir au moins 3 caractères",
      "code": "too_small"
    }
  ]
}
```

### 4. Multiples méthodes de validation
- Middlewares Express (recommandé)
- Service de validation (pour logique métier)
- Validation stricte avec exceptions
- Validation douce sans exceptions

## 📝 Exemples d'utilisation

### Dans une nouvelle route

```javascript
import { validateBody, validateParams } from '../middlewares/validate.middleware.js';
import { createVideoSchema, idParamSchema } from '../schemas/video.schema.js';

// Validation automatique
router.post('/videos', 
  validateBody(createVideoSchema),
  controller.create
);

// Validation multiple
router.put('/videos/:id',
  validateParams(idParamSchema),
  validateBody(updateVideoSchema),
  controller.update
);
```

### Dans un service

```javascript
import { validateCreateVideo } from '../services/validate.service.video.js';

export const myService = (data) => {
  const validation = validateCreateVideo(data);
  
  if (!validation.success) {
    throw new Error('Données invalides: ' + JSON.stringify(validation.errors));
  }
  
  // Utiliser validation.data (données nettoyées et validées)
  const { title, theme_id } = validation.data;
};
```

## 🔧 Configuration

Aucune configuration supplémentaire n'est nécessaire ! Zod est déjà installé dans votre `package.json` :

```json
{
  "dependencies": {
    "zod": "^4.2.1"
  }
}
```

## 📚 Documentation complète

Pour plus de détails, consultez :
- `server/src/services/VALIDATION_README.md` - Documentation complète
- `server/src/services/__tests__/validate.service.video.test.js` - Exemples de tests
- [Documentation officielle Zod](https://zod.dev)

## 🎨 Personnalisation

### Ajouter un nouveau schéma

1. **Définir le schéma** dans `schemas/video.schema.js` :
```javascript
export const myNewSchema = z.object({
  field1: z.string().min(1),
  field2: z.number().positive()
});
```

2. **Ajouter une fonction de validation** dans `services/validate.service.video.js` :
```javascript
export const validateMyNew = (data) => {
  try {
    const validated = myNewSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatZodErrors(error) };
    }
    throw error;
  }
};
```

3. **Utiliser dans les routes** :
```javascript
router.post('/new', validateBody(myNewSchema), controller);
```

## 🐛 Dépannage

### Erreur : "Cannot find module 'zod'"
```bash
cd server
npm install
```

### Les validations ne fonctionnent pas
Vérifiez que les middlewares sont dans le bon ordre :
```javascript
router.post('/upload',
  upload.single('video'),        // 1. Upload du fichier
  validateVideoDuration,         // 2. Validation durée
  validateBody(createVideoSchema), // 3. Validation Zod
  uploadVideo                    // 4. Contrôleur
);
```

### Erreur de typage avec Zod 4.x
Zod 4.x a une nouvelle API. Ce projet utilise les dernières conventions.

## 💡 Bonnes pratiques

1. **Toujours valider les entrées utilisateur**
2. **Utiliser les middlewares** pour une validation automatique
3. **Logger les erreurs de validation** (peuvent indiquer des tentatives d'attaque)
4. **Ne jamais faire confiance aux données client**
5. **Tester les cas limites** (valeurs nulles, types incorrects, longueurs extrêmes)

## 🎉 Résultat

Votre application est maintenant beaucoup plus sécurisée grâce à Zod !

### Avant
- ❌ Validations manuelles incomplètes
- ❌ Risques d'injection SQL
- ❌ Risques XSS
- ❌ Pollution de données possible
- ❌ Bugs de type coercion

### Après
- ✅ Validation automatique complète
- ✅ Protection contre injections SQL
- ✅ Protection contre XSS
- ✅ Données nettoyées automatiquement
- ✅ Types garantis et sûrs
- ✅ Messages d'erreur clairs
- ✅ Code plus maintenable

## 📞 Support

Pour toute question ou problème :
1. Consultez `VALIDATION_README.md`
2. Regardez les exemples dans le fichier de test
3. Consultez la [documentation Zod](https://zod.dev)

---

**Intégration réalisée avec succès ! 🚀**

Votre projet ODYW est maintenant protégé par une validation robuste avec Zod.

