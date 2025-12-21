// webhook.routes.js
import { Router } from 'express';
import bodyParser from 'body-parser';
import { handleClerkWebhook } from '../controllers/webhook.controller.js';

const router = Router();

// IMPORTANTE: Se configura bodyParser.raw para obtener el cuerpo en crudo (Buffer)
// y se fuerza la codificación a UTF-8, que es vital para la verificación de firmas.
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