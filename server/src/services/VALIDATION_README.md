# Service de Validation Vidéo avec Zod

## 📋 Vue d'ensemble

Le service de validation `validate.service.video.js` utilise **Zod** pour assurer la sécurité et l'intégrité des données dans l'application de gestion de vidéos.

## 🛡️ Sécurité apportée par Zod

### 1. **Protection contre les injections**
- ✅ Validation stricte des types (nombre vs chaîne)
- ✅ Filtrage des caractères dangereux (`<`, `>`, `"`, `'`, `` ` ``, `;`, `\`, `{`, `}`)
- ✅ Protection contre les injections SQL via `theme_id` (forcé à être un entier positif)

### 2. **Protection contre XSS**
- ✅ Limite les caractères autorisés dans les titres
- ✅ Trim automatique des espaces
- ✅ Longueur limitée (3-200 caractères)

### 3. **Protection contre les attaques par type coercion**
- ✅ Conversion stricte des types avec `.coerce`
- ✅ Validation des entiers et nombres positifs

### 4. **Protection contre la pollution de données**
- ✅ Seuls les champs définis dans le schéma sont acceptés
- ✅ Les champs supplémentaires sont automatiquement ignorés

## 📁 Structure des fichiers

```
server/src/
├── schemas/
│   └── video.schema.js          # Définition des schémas Zod
├── services/
│   └── validate.service.video.js # Service de validation
├── middlewares/
│   └── validate.middleware.js    # Middlewares de validation Express
└── routes/
    └── video.route.js            # Routes avec validation intégrée
```

## 🎯 Schémas disponibles

### 1. `createVideoSchema`
Valide les données lors de la création d'une vidéo.

```javascript
{
  title: string (3-200 caractères, sans caractères dangereux),
  theme_id: number (entier positif)
}
```

### 2. `updateVideoSchema`
Valide les données lors de la mise à jour (tous les champs sont optionnels, mais au moins un requis).

```javascript
{
  title?: string (3-200 caractères, sans caractères dangereux),
  theme_id?: number (entier positif)
}
```

### 3. `idParamSchema`
Valide les paramètres d'ID dans les routes.

```javascript
{
  id: number (entier positif)
}
```

### 4. `videoMetadataSchema`
Valide les métadonnées de la vidéo après analyse.

```javascript
{
  duration: number (10-60 secondes),
  size_mb: number (max 45 Mo),
  video_url: string (commence par /uploads/)
}
```

### 5. `videoQuerySchema`
Valide les paramètres de requête (filtrage, pagination).

```javascript
{
  theme_id?: number (entier positif),
  page?: number (défaut: 1),
  limit?: number (1-100, défaut: 10),
  sort_by?: 'created_at' | 'title' | 'duration' | 'size_mb',
  order?: 'asc' | 'desc'
}
```

## 🔧 Utilisation du service

### Méthode 1 : Via les middlewares (recommandé)

```javascript
import { validateBody, validateParams } from '../middlewares/validate.middleware.js';
import { createVideoSchema, idParamSchema } from '../schemas/video.schema.js';

// Dans vos routes
router.post('/upload', 
  upload.single('video'),
  validateVideoDuration,
  validateBody(createVideoSchema),  // ✅ Validation automatique
  uploadVideo
);
```

### Méthode 2 : Directement dans le code

```javascript
import { validateCreateVideo, validateId } from '../services/validate.service.video.js';

// Validation avec gestion d'erreur
const validation = validateCreateVideo(req.body);

if (!validation.success) {
  return sendValidationError(res, {
    message: 'Données invalides',
    errors: validation.errors
  });
}

// Utiliser les données validées
const { title, theme_id } = validation.data;
```

### Méthode 3 : Validation stricte (lance une exception)

```javascript
import { validateOrThrow } from '../services/validate.service.video.js';
import { createVideoSchema } from '../schemas/video.schema.js';

try {
  const validated = validateOrThrow(createVideoSchema, req.body);
  // Utiliser validated
} catch (error) {
  // Gérer l'erreur Zod
}
```

## 📝 Fonctions du service

| Fonction | Description | Retour |
|----------|-------------|--------|
| `validateCreateVideo(data)` | Valide les données de création | `{ success, data?, errors? }` |
| `validateUpdateVideo(data)` | Valide les données de mise à jour | `{ success, data?, errors? }` |
| `validateId(id)` | Valide un ID | `{ success, data?, errors? }` |
| `validateVideoMetadata(metadata)` | Valide les métadonnées | `{ success, data?, errors? }` |
| `validateCompleteVideo(videoData)` | Valide un objet vidéo complet | `{ success, data?, errors? }` |
| `validateVideoQuery(query)` | Valide les paramètres de requête | `{ success, data?, errors? }` |
| `validateOrThrow(schema, data)` | Valide et lance une exception si échec | `data` ou `throw` |
| `validateSafe(schema, data)` | Valide et retourne undefined si échec | `data` ou `undefined` |
| `formatZodErrors(zodError)` | Formate les erreurs Zod | `Array<{field, message, code}>` |
| `sanitizeData(schema, data)` | Nettoie les données | `data` nettoyées |
| `isValid(schema, data)` | Vérifie la validité | `boolean` |

## 🧪 Exemples de tests

### Test 1 : Validation réussie

```javascript
const result = validateCreateVideo({
  title: 'Ma super vidéo',
  theme_id: 5
});

// result.success === true
// result.data === { title: 'Ma super vidéo', theme_id: 5 }
```

### Test 2 : Validation échouée (titre trop court)

```javascript
const result = validateCreateVideo({
  title: 'Hi',
  theme_id: 5
});

// result.success === false
// result.errors === [
//   { field: 'title', message: 'Le titre doit contenir au moins 3 caractères', ... }
// ]
```

### Test 3 : Validation échouée (caractères dangereux)

```javascript
const result = validateCreateVideo({
  title: '<script>alert("XSS")</script>',
  theme_id: 5
});

// result.success === false
// result.errors === [
//   { field: 'title', message: 'Le titre contient des caractères non autorisés...', ... }
// ]
```

### Test 4 : Validation de l'ID

```javascript
const result = validateId('abc');

// result.success === false
// result.errors === [
//   { field: 'id', message: 'L\'ID doit être un nombre', ... }
// ]
```

## 🚀 Routes protégées

Toutes les routes vidéo sont maintenant protégées par Zod :

| Route | Méthode | Validations |
|-------|---------|-------------|
| `/upload` | POST | `body` (title, theme_id) |
| `/` | GET | `query` (filtres optionnels) |
| `/:id` | GET | `params` (id) |
| `/:id` | PUT | `params` (id) + `body` (title?, theme_id?) |
| `/:id` | DELETE | `params` (id) |

## 🔍 Messages d'erreur

Les erreurs Zod sont formatées pour être facilement compréhensibles :

```json
{
  "success": false,
  "message": "Validation échouée pour body",
  "errors": [
    {
      "field": "title",
      "message": "Le titre doit contenir au moins 3 caractères",
      "code": "too_small",
      "received": "Hi"
    }
  ],
  "details": "title: Le titre doit contenir au moins 3 caractères"
}
```

## 💡 Bonnes pratiques

1. **Toujours utiliser les middlewares** dans les routes pour une validation automatique
2. **Ne jamais faire confiance aux données utilisateur** - toujours valider
3. **Utiliser `validateOrThrow`** dans les services pour une validation stricte
4. **Logger les erreurs de validation** pour détecter les tentatives d'attaque
5. **Tester tous les cas limites** (valeurs nulles, types incorrects, etc.)

## 🎨 Personnalisation

Pour ajouter un nouveau schéma :

1. Définir le schéma dans `schemas/video.schema.js`
2. Ajouter une fonction de validation dans `validate.service.video.js`
3. Utiliser le middleware dans les routes

```javascript
// 1. Nouveau schéma
export const myCustomSchema = z.object({
  // ...
});

// 2. Nouvelle fonction
export const validateMyCustomData = (data) => {
  try {
    const validated = myCustomSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatZodErrors(error) };
    }
    throw error;
  }
};

// 3. Utiliser dans les routes
router.post('/custom', validateBody(myCustomSchema), controller);
```

## 📚 Ressources

- [Documentation Zod](https://zod.dev)
- [Guide de sécurité OWASP](https://owasp.org/www-project-top-ten/)
- [Express Validation Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Auteur**: Service de validation Zod  
**Version**: 1.0.0  
**Date**: Décembre 2025

