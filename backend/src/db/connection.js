// src/db/connection.js
import pg from 'pg';
import 'dotenv/config'; // Esto reemplaza a require('dotenv').config()

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Agregamos un pequeño log para saber si se conectó (opcional pero útil)
pool.on('connect', () => {
  console.log('🔌 Base de datos conectada');
});

export default pool;