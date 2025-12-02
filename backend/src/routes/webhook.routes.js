import { Router } from 'express';
import bodyParser from 'body-parser';
import { handleClerkWebhook } from '../controllers/webhook.controller.js';

const router = Router();

// IMPORTANTE: Los webhooks necesitan el cuerpo en crudo (raw) para validar la firma.
// No uses express.json() aquí.
router.post(
  '/clerk', 
  bodyParser.raw({ type: 'application/json' }), 
  handleClerkWebhook
);

export default router;