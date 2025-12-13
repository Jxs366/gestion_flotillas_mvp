import pool from '../db/connection.js'; 

// --- Funciones de lectura ---
const findAll = async () => {
  const { rows } = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC'); 
  return rows;
};

const create = async ({ plate, model, vin, make, year, current_odometer }) => {
  const query = `
    INSERT INTO vehicles (plate, model, vin, make, year, current_odometer, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'active')
    RETURNING *
  `;
  const values = [plate, model, vin, make, year, current_odometer];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findByDriverId = async (driverId) => {
  const { rows } = await pool.query("SELECT * FROM vehicles WHERE driver_id = $1 ORDER BY model", [driverId]);
  return rows;
};

const findAvailable = async () => {
  const { rows } = await pool.query("SELECT * FROM vehicles WHERE driver_id IS NULL ORDER BY model");
  return rows;
};

const assignToDriver = async (vehicleId, driverId) => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const check = await client.query("SELECT driver_id FROM vehicles WHERE id = $1", [vehicleId]);
    if (check.rows[0]?.driver_id) throw new Error("El vehículo ya está ocupado.");

    await client.query("UPDATE vehicles SET driver_id = $1 WHERE id = $2", [driverId, vehicleId]);
    await client.query("INSERT INTO assignment_history (vehicle_id, driver_id, assigned_at) VALUES ($1, $2, NOW())", [vehicleId, driverId]);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release();
  }
};

// --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE ---
const unassign = async (vehicleId) => {
  let client; // Declarar afuera
  console.log("🛠️ Modelo: Iniciando desvinculación para:", vehicleId);
  
  try {
    client = await pool.connect(); // Intentar conectar
    await client.query("BEGIN");

    await client.query(`
      UPDATE assignment_history 
      SET unassigned_at = NOW() 
      WHERE vehicle_id = $1 AND unassigned_at IS NULL
    `, [vehicleId]);

    await client.query("UPDATE vehicles SET driver_id = NULL WHERE id = $1", [vehicleId]);

    await client.query("COMMIT");
    console.log("✅ Modelo: Desvinculación exitosa");
    return true;

  } catch (error) {
    console.error("❌ Modelo Error:", error);
    if (client) await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release();
  }
};

export default {
  findAll,
  create,
  findByDriverId,
  findAvailable,
  assignToDriver,
  unassign 
};