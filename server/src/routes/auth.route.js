// outil de gestion des routes
import { Router } from 'express';
// import des controllers
import { registerController, loginController, getProfileController} from '../controllers/auth.controller.js';
// import du middleware d'authentification
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// route pour enregistrer un utilisateur
router.post('/register', registerController);
// route pour connecter un utilisateur
router.post('/login', loginController);
// route pour afficher son profil
router.get('/profile', authenticate, getProfileController);

export default router;
