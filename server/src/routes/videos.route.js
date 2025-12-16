import { Router } from 'express';
import { uploadVideo } from '../middlewares/upload.middleware.js';
import { createVideoController, getAllVideosController, getVideoByIdController, updateVideoController, deleteVideoController } from '../controllers/videos.controller.js';


const router = Router();


// route pour créer une vidéo
router.post('/', uploadVideo.single('video'), createVideoController);
// route pour récupérer toutes les vidéos
router.get('/', getAllVideosController);
// route pour récupérer une vidéo par son id
router.get('/:id', getVideoByIdController);
// route pour modifier une vidéo (avec ou sans nouveau fichier)
router.put('/:id', uploadVideo.single('video'), updateVideoController);
// route pour supprimer une vidéo
router.delete('/:id', deleteVideoController);


export default router;