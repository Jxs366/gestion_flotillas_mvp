import { Router } from 'express';
import { listAreas, createArea } from '../controllers/areas.controller.js';
import { requireAuth } from '@clerk/express';

const router = Router();

router.get('/', requireAuth(), listAreas);
router.post('/', requireAuth(), createArea);

export default router;