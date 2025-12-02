// src/models/vehicle.model.js

// ANTES (Probablemente tenías esto o similar):
// import db from '../db/index.js'; 

// AHORA (Debe apuntar a tu archivo real):
import pool from '../db/connection.js'; 

const findAll = async () => {
  const query = 'SELECT * FROM vehicles';
  // Nota: cambiamos 'db' por 'pool' porque así lo importamos arriba
  const { rows } = await pool.query(query); 
  return rows;
};

const create = async ({ plate, model }) => {
  const query = `
    INSERT INTO vehicles (plate, model, vin, make, status)
    VALUES ($1, $2, $3, $4, 'active')
    RETURNING *
  `;

  // Datos temporales para evitar errores de NOT NULL
  const tempVin = `VIN-${Date.now()}`; 
  const tempMake = 'Generico'; 

  const values = [plate, model, tempVin, tempMake];
  
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export default {
  findAll,
  create
};