import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';
import { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    updateUserRole 
} from '../controllers/admin.controller.js';

const router = Router();

// Récupérer tous les utilisateurs (admin et superAdmin)
router.get('/users', authenticate, checkRole([2, 3]), getAllUsers);

// Récupérer un utilisateur par son ID (admin et superAdmin)
router.get('/users/:id', authenticate, checkRole([2, 3]), getUserById);

// Mettre à jour un utilisateur (admin et superAdmin)
router.put('/users/:id', authenticate, checkRole([2, 3]), updateUser);

// Supprimer un utilisateur (admin et superAdmin)
router.delete('/users/:id', authenticate, checkRole([2, 3]), deleteUser);

// Modifier le rôle d'un utilisateur (super_admin uniquement)
router.put('/users/:id/role', authenticate, checkRole([3]), updateUserRole);

export default router;