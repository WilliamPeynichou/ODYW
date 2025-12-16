import { Router } from 'express';
import { getAllThemesController, getThemeByIdController } from '../controllers/themes.controller.js';

const router = Router();

// Route pour récupérer tous les thèmes
router.get('/', getAllThemesController);

// Route pour récupérer un thème par son id
router.get('/:id', getThemeByIdController);

export default router;

