import { Router } from 'express';
import upload, { validateVideoDuration } from '../middlewares/upload.video.middlewar.js';
import { uploadVideo, getAllVideos, getVideoById, updateVideo, deleteVideo } from '../controllers/video.controller.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.middleware.js';
import { 
    createVideoSchema, 
    updateVideoSchema, 
    idParamSchema,
    videoQuerySchema 
} from '../schemas/video.schema.js';

const router = Router();

// Route pour uploader une vidéo
// 1. upload.single('video') : Gère l'upload du fichier avec Multer
// 2. validateVideoDuration : Vérifie la durée de la vidéo (10-60s)
// 3. validateBody(createVideoSchema) : Valide title et theme_id avec Zod
// 4. uploadVideo : Contrôleur pour sauvegarder la vidéo
router.post(
    '/upload', 
    upload.single('video'), 
    validateVideoDuration, 
    validateBody(createVideoSchema), 
    uploadVideo
);

// Route pour récupérer toutes les vidéos
// validateQuery(videoQuerySchema) : Valide les paramètres de filtrage/pagination (optionnel)
router.get(
    '/', 
    validateQuery(videoQuerySchema), 
    getAllVideos
);

// Route pour récupérer une vidéo par son ID
// validateParams(idParamSchema) : Valide que l'ID est un nombre entier positif
router.get(
    '/:id', 
    validateParams(idParamSchema), 
    getVideoById
);

// Route pour mettre à jour une vidéo
// 1. validateParams(idParamSchema) : Valide l'ID
// 2. upload.single('video') : Optionnel, permet de remplacer la vidéo
// 3. validateVideoDuration : Vérifie la durée si un nouveau fichier est fourni
// 4. validateBody(updateVideoSchema) : Valide les champs à mettre à jour
router.put(
    '/:id', 
    validateParams(idParamSchema), 
    upload.single('video'), 
    validateVideoDuration, 
    validateBody(updateVideoSchema), 
    updateVideo
);

// Route pour supprimer une vidéo
// validateParams(idParamSchema) : Valide que l'ID est un nombre entier positif
router.delete(
    '/:id', 
    validateParams(idParamSchema), 
    deleteVideo
);

export default router;

