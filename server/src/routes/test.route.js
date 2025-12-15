import { Router } from 'express';
import { testController } from '../controllers/test.controller.js';

const router = Router();

// route pour tester la connexion à la db
router.get('/test', testController);


export default router;