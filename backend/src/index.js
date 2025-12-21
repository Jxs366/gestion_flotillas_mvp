import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import vehiclesRoutes from './routes/vehicles.routes.js'; 
import webhookRoutes from './routes/webhook.routes.js';
import usersRoutes from './routes/users.routes.js';
import areasRoutes from './routes/areas.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use('/api/webhooks', webhookRoutes);

// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(clerkMiddleware());

// --- RUTAS DE LA APP ---
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/areas', areasRoutes);

app.listen(PORT, () => 
  console.log(`🚗 Servidor corriendo en http://localhost:${PORT}`)
);