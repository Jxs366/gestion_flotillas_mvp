import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Forma moderna de require('dotenv').config()
import { clerkMiddleware } from '@clerk/express';

// Importa tus rutas (asegúrate de que vehicles.routes.js también use 'export default')
// Si vehicles.routes usa 'module.exports', tendrás que cambiarlo a 'export default'
import vehiclesRoutes from './routes/vehicles.routes.js'; 
import webhookRoutes from './routes/webhook.routes.js';
import usersRoutes from './routes/users.routes.js';
import areasRoutes from './routes/areas.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// --- ZONA CRÍTICA: WEBHOOKS ---
// ⚠️ ESTO DEBE IR ANTES DE express.json() ⚠️
// El webhook necesita recibir los datos en crudo (raw). Si pones express.json() antes,
// transformará los datos y la validación de seguridad de Clerk fallará.
app.use('/api/webhooks', webhookRoutes);

// --- MIDDLEWARES GLOBALES ---
app.use(express.json()); // Ahora sí, para el resto de rutas normales
app.use(clerkMiddleware());

// --- RUTAS DE LA APP ---
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/areas', areasRoutes);

app.listen(PORT, () => 
  console.log(`🚗 Servidor corriendo en http://localhost:${PORT}`)
);