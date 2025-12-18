import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';
import { updateUserRole } from '../controllers/admin.controller.js';

const router = Router();

// Modifier le rôle d'un utilisateur (super_admin uniquement)
router.put('/users/:id/role', authenticate, checkRole([3]), updateUserRole);

export default router;