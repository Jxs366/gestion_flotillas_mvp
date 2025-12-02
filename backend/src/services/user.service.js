import UserModel from '../models/user.model.js';

export const syncNewUser = async (clerkData) => {
  const { id, email_addresses, first_name, last_name } = clerkData;

  // Lógica de negocio: Extraer el email principal
  const email = email_addresses[0]?.email_address;
  const fullName = `${first_name || ''} ${last_name || ''}`.trim();

  if (!email) throw new Error("El usuario no tiene email");

  // Llamar a la capa de datos
  return await UserModel.createProfile({
    clerkId: id,
    email,
    fullName,
    role: 'driver' // Regla de negocio: todos entran como conductores por defecto
  });
};