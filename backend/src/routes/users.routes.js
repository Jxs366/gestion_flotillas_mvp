import { Router } from 'express';
// 1. Importamos la nueva función inviteUser
import { listUsers, inviteUser } from '../controllers/users.controller.js';
import { requireAuth } from '@clerk/express';

const router = Router();

// Rutas
router.get('/', requireAuth(), listUsers); 

// 2. Agregamos la ruta POST para invitar
// requireAuth() protege para que solo usuarios logueados (Admins) puedan invitar
router.post('/invite', requireAuth(), inviteUser); 

export default router;