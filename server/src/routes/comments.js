// Endspoints pour les commentaires

import express from 'express';
import { getComments, addComment, editComment, removeComment } from '../controllers/commentController.js';
import { validateComment } from '../middlewares/validate.js';

const router = express.Router();

// Récupérer tous les commentaires pour une vidéo
router.get('/:videoId', getComments);

// Ajouter un commentaire (validation middleware)
router.post('/:videoId', validateComment, addComment);

// Modifier un commentaire existant (validation middleware)
router.put('/:id', validateComment, editComment);

// Supprimer un commentaire
router.delete('/:id', removeComment);

export default router;