import { Router } from 'express';
import { listUsers, inviteUser, getUserById, updateStatus } from '../controllers/users.controller.js';
import { requireAuth } from '@clerk/express';

const router = Router();

router.get('/', requireAuth(), listUsers);
router.post('/invite', requireAuth(), inviteUser);

router.get('/:id', requireAuth(), getUserById);
router.patch('/:id/status', requireAuth(), updateStatus);

export default router;