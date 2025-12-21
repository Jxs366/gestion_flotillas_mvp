import { Router } from 'express';
import { listVehicles, addVehicle } from '../controllers/vehicles.controller.js';
import { getAvailableVehicles, unassignVehicle } from '../controllers/assignments.controller.js';

const router = Router();

router.get('/', listVehicles);
router.post('/', addVehicle);

router.get('/available', getAvailableVehicles);
router.post('/unassign', unassignVehicle);

export default router;