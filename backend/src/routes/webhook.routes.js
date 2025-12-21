// webhook.routes.js
import { Router } from 'express';
import bodyParser from 'body-parser';
import { handleClerkWebhook } from '../controllers/webhook.controller.js';

const router = Router();

router.post(
  '/clerk', 
  bodyParser.raw({ 
    type: 'application/json',
    limit: '5mb', 
    encoding: 'utf8', // <-- Aseguramos la codificación
  }), 
  handleClerkWebhook
);

export default router;