import { Router } from 'express';
import { listUsers, inviteUser, getUserById, updateStatus } from '../controllers/users.controller.js';
import { getDriverVehicles, assignVehicle } from '../controllers/assignments.controller.js';
import { requireAuth } from '@clerk/express';

const router = Router();

router.get('/', requireAuth(), listUsers);
router.post('/invite', requireAuth(), inviteUser);

router.get('/:driverId/vehicles', requireAuth(), getDriverVehicles);
router.post('/:driverId/assign', requireAuth(), assignVehicle);

router.get('/:id', requireAuth(), getUserById);
router.patch('/:id/status', requireAuth(), updateStatus);

export default router;