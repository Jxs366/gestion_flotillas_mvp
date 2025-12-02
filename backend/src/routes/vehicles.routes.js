// src/routes/vehicles.routes.js
import { Router } from 'express';
// Importamos las funciones con llaves {} porque usamos export const
import { listVehicles, addVehicle } from '../controllers/vehicles.controller.js';

const router = Router();

// Definimos las rutas
router.get('/', listVehicles);  // GET /api/vehicles
router.post('/', addVehicle);   // POST /api/vehicles

export default router;