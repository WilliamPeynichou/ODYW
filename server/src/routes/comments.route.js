// Endspoints pour les commentaires
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkOwnershipOrRole } from '../middlewares/authorization.middleware.js';
import { getComments, addComment, editComment, removeComment } from '../controllers/commentController.js';
import { validateComment } from '../middlewares/validator/comment.validate.js';

const router = Router();

// Récupérer tous les commentaires pour une vidéo
router.get('/:videoId', getComments);

// Ajouter un commentaire (validation middleware, User connecté)
router.post('/:videoId', authenticate, validateComment, addComment);

// Modifier un commentaire existant (validation middleware, Propriétaire ou admin/super_admin)
router.put('/:id', authenticate, checkOwnershipOrRole('comments'), validateComment, editComment);

// Supprimer un commentaire (Propriétaire ou admin ou admin/super_admin)
router.delete('/:id', authenticate, checkOwnershipOrRole('comments'), removeComment);

export default router;