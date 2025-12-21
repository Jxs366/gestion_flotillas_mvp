import pool from '../db/connection.js';

export const listAreas = async (req, res) => {
  try {
    const query = 'SELECT id, name, description, created_at FROM areas ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createArea = async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });
  
      const query = `
        INSERT INTO areas (name, description)
        VALUES ($1, $2)
        RETURNING *
      `;
      const { rows } = await pool.query(query, [name, description]);
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };