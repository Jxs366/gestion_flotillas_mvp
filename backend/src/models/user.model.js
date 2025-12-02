// src/models/user.model.js

// 1. CORRIGE ESTA LÍNEA (Antes decía '../db/index.js')
import pool from '../db/connection.js'; 

const createProfile = async ({ clerkId, email, fullName, role }) => {
  const query = `
    INSERT INTO public.profiles (clerk_id, email, full_name, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (clerk_id) DO NOTHING
    RETURNING *;
  `;
  
  const values = [clerkId, email, fullName, role];
  
  try {
    // 2. CORRIGE ESTA LÍNEA (Antes decía 'db.query')
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export default {
  createProfile
};