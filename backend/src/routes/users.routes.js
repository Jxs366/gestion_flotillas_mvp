import { Router } from 'express';
import { listUsers } from '../controllers/users.controller.js';
import { requireAuth } from '@clerk/express';

const router = Router();
router.get('/', requireAuth(), listUsers); // GET /api/users
export default router;