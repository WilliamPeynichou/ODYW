import { Router } from 'express';
import upload, { validateVideoDuration } from '../middlewares/upload.video.middlewar.js';
import { uploadVideo, getAllVideos, getVideoById, deleteVideo } from '../controllers/video.controller.js';

const router = Router();

// Route pour uploader une vidéo
// upload.single('video') : 'video' est le nom du champ dans le formulaire
router.post('/upload', upload.single('video'), validateVideoDuration, uploadVideo);

// Route pour récupérer toutes les vidéos
router.get('/', getAllVideos);

// Route pour récupérer une vidéo par son ID
router.get('/:id', getVideoById);

// Route pour supprimer une vidéo
router.delete('/:id', deleteVideo);

export default router;

