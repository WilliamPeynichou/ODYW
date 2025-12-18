import { Router } from 'express';
import { uploadVideo } from '../middlewares/upload.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateCreateVideo, validateUpdateVideo } from '../middlewares/validator/validate.video.js';
import { createVideoController, getAllVideosController, getVideoByIdController, updateVideoController, deleteVideoController } from '../controllers/videos.controller.js';

const router = Router();

// route pour créer une vidéo
// L'ordre est important: d'abord upload, puis validation, puis controller
router.post('/', authenticate, uploadVideo.single('video'), validateCreateVideo, createVideoController);

// route pour récupérer toutes les vidéos
router.get('/', getAllVideosController);

// route pour récupérer une vidéo par son id
router.get('/:id', getVideoByIdController);

// route pour modifier une vidéo (avec ou sans nouveau fichier)
router.put('/:id', authenticate, validateUpdateVideo, updateVideoController);

// route pour supprimer une vidéo
router.delete('/:id', authenticate, deleteVideoController);

export default router;