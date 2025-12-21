import { Webhook } from 'svix';
import { syncNewUser, deleteUser } from '../services/user.service.js'; 

export const handleClerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Falta CLERK_WEBHOOK_SECRET en .env');
  }

  // 1. Obtener headers de seguridad
  const headers = req.headers;
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send('Error: Headers Svix faltantes');
  }

  // 2. Verificar Firma
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(req.body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Firma inválida:', err);
    return res.status(400).send('Error de verificación');
  }

  // 3. Delegar al Servicio según el evento
  const eventType = evt.type;
  console.log(`🔔 Evento recibido: ${eventType}`);

  try {
    if (eventType === 'user.created') {
      await syncNewUser(evt.data);
      
    } else if (eventType === 'user.deleted') {
      await deleteUser(evt.data);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};