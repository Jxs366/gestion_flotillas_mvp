// webhook.controller.js
import { Webhook } from 'svix';
import { syncNewUser, deleteUser } from '../services/user.service.js'; 

export const handleClerkWebhook = async (req, res) => {
  // Asegúrate de que esta variable de entorno esté cargada correctamente (e.g., usando dotenv)
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET; 

  if (!WEBHOOK_SECRET) {
    // Es buena práctica usar el valor que conoces para depurar si falla la carga de .env
    // console.log("Usando clave de webhook hardcodeada para test: whsec_iHjwhKPxtO+Lzop2B8b30QVF0rhS4w1r");
    // const WEBHOOK_SECRET = 'whsec_iHjwhKPxtO+Lzop2B8b30QVF0rhS4w1r'; 
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

  // 💡 SOLUCIÓN FINAL: Convertir req.body a string en crudo (utf8).
  // Esto es crucial porque body-parser.raw devuelve un Buffer, 
  // y la verificación de Svix requiere un string/Buffer sin alteraciones.
  const payload = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : req.body;


  try {
    // Se pasa el payload (string) y los headers para la verificación
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    // Si la verificación falla, se imprime el error y se devuelve 400
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
      // Manejo de eliminación
      await deleteUser(evt.data);
    }
    
    // Si quisieras manejar actualizaciones:
    // else if (eventType === 'user.updated') { ... }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};