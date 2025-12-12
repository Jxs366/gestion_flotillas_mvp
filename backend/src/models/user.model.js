import pool from '../db/connection.js';

// 1. Crear o Actualizar Perfil Base
const createProfile = async ({ clerkId, email, fullName, role }) => {
  // Usamos ON CONFLICT DO UPDATE para asegurar que Postgres devuelva el registro (RETURNING *)
  // incluso si el usuario ya existía. Esto evita que devuelva 'undefined'.
  const query = `
    INSERT INTO public.profiles (clerk_id, email, full_name, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (clerk_id) 
    DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name
    RETURNING *;
  `;
  
  try {
    const result = await pool.query(query, [clerkId, email, fullName, role]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error en createProfile:", error.message);
    throw error;
  }
};

// 2. Crear Registro de Conductor (Driver)
const createDriverRecord = async ({ profileId }) => {
  // Insertamos solo el user_id (UUID) y el status.
  // Los campos 'license_number' y 'phone' se quedan en NULL hasta que el usuario los llene en la App.
  const query = `
    INSERT INTO public.drivers (user_id, status)
    VALUES ($1, 'active')
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [profileId]);
    return result.rows[0];
  } catch (error) {
    // Si falla (ej. llave foránea incorrecta), lo atrapamos para no tumbar el servidor
    console.error("❌ Error FATAL creando Driver:", error.message); 
    return null;
  }
};

// 3. Eliminar Perfil
const deleteProfile = async (clerkId) => {
  const query = `
    DELETE FROM public.profiles 
    WHERE clerk_id = $1
    RETURNING *;
  `;
  
  try {
    const result = await pool.query(query, [clerkId]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error eliminando perfil:", error.message);
    throw error;
  }
};

const updateDriverStatus = async (userId, newStatus) => {
  const query = `
    UPDATE public.drivers
    SET status = $1
    WHERE user_id = $2
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [newStatus, userId]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error actualizando estado del conductor:", error.message);
    throw error;
  }
};

export default {
  createProfile,
  createDriverRecord,
  deleteProfile,
  updateDriverStatus
};