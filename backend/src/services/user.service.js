import UserModel from '../models/user.model.js';

export const syncNewUser = async (clerkData) => {
  console.log("--------------- INICIO SYNC USER ---------------");
  
  const { id, email_addresses, first_name, last_name, public_metadata } = clerkData;
  const email = email_addresses[0]?.email_address;
  const fullName = `${first_name || ''} ${last_name || ''}`.trim();

  // 1. Verificamos qué metadata llegó realmente
  console.log("📦 Metadata recibida:", JSON.stringify(public_metadata, null, 2));

  // Si no llega metadata, asumimos driver? Ojo con esto.
  const role = public_metadata?.role || 'driver'; 
  console.log(`👤 Rol detectado: ${role}`);

  // 2. Intentamos crear el perfil
  let newProfile;
  try {
    newProfile = await UserModel.createProfile({
      clerkId: id,
      email,
      fullName,
      role
    });
  } catch (err) {
    console.error("❌ Falló la creación del perfil base:", err.message);
    return;
  }

  if (!newProfile) {
    console.error("❌ ERROR CRÍTICO: createProfile no devolvió ningún usuario.");
    return;
  }

  console.log(`✅ Perfil base listo. ID (UUID): ${newProfile.id}`);

  // 3. Lógica del Driver
  if (role === 'driver') {
    console.log("🚚 El usuario es CONDUCTOR. Intentando crear registro en drivers...");
    
    const driver = await UserModel.createDriverRecord({
      profileId: newProfile.id 
    });

    if (driver) {
      console.log("🎉 ¡ÉXITO! Registro de driver creado:", driver);
    } else {
      console.error("⚠️ ALERTA: La función createDriverRecord devolvió null (Revisa los logs de error arriba).");
    }
  } else {
    console.log("ℹ️ El usuario NO es driver (es admin u otro), no se crea registro extra.");
  }
  
  console.log("--------------- FIN SYNC USER ---------------");
  return newProfile;
};

export const deleteUser = async (clerkData) => {
  const { id } = clerkData; // Clerk envía el ID del usuario eliminado aquí

  if (!id) {
    console.error("❌ Error: No se recibió ID en el evento user.deleted");
    return;
  }

  console.log(`🗑️ Eliminando usuario con Clerk ID: ${id}`);

  const deletedUser = await UserModel.deleteProfile(id);

  if (deletedUser) {
    console.log("✅ Usuario eliminado correctamente de la base de datos.");
  } else {
    console.log("⚠️ Usuario no encontrado en la base de datos (quizás ya fue borrado).");
  }

  return deletedUser;
};