import pool from '../db/connection.js';

export const listUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM profiles ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};