import pool from '../db/connection.js';
// 1. Importamos el creador del cliente de Clerk
import { createClerkClient } from '@clerk/backend';

// 2. Inicializamos el cliente (asegúrate de tener CLERK_SECRET_KEY en tu .env)
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const listUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM profiles ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. NUEVA FUNCIÓN: Invitar usuario
export const inviteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email es obligatorio' });
    }

    // Crear la invitación en Clerk
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      // A dónde redirige el correo cuando le dan click (puede ser tu web o un link profundo)
      // Por ahora pon tu URL de desarrollo o producción
      redirectUrl: 'https://adjusted-sawfly-23.accounts.dev/sign-up', 
      ignoreExisting: true, // Si ya fue invitado, no lanza error
      publicMetadata: {
        role: 'driver' // Podemos guardar esto para usarlo luego si quisieras
      }
    });

    res.status(200).json({ 
      message: 'Invitación enviada con éxito', 
      invitation 
    });

  } catch (error) {
    console.error("Error al invitar:", error);
    // Clerk devuelve errores detallados, los pasamos al frontend
    res.status(500).json({ 
      message: error.errors?.[0]?.message || 'Error al crear la invitación' 
    });
  }
};