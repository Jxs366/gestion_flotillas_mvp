import { Router } from 'express';
import bodyParser from 'body-parser';
import { handleClerkWebhook } from '../controllers/webhook.controller.js';

const router = Router();

router.post(
  '/clerk', 
  bodyParser.raw({ type: 'application/json' }), 
  handleClerkWebhook
);

export default router;