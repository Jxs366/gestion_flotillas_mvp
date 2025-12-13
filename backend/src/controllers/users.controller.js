import pool from "../db/connection.js";
// Importamos el creador del cliente de Clerk
import { createClerkClient } from "@clerk/backend";
import { changeStatus } from "../services/user.service.js";

// Inicializamos el cliente
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const listUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        profiles.*, 
        drivers.status AS driver_status 
      FROM profiles
      LEFT JOIN public.drivers AS drivers ON profiles.id = drivers.id
      ORDER BY profiles.created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Invitar usuario
export const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio" });
    }

    // 2. Validamos el rol por seguridad
    // Si envían "admin", usamos "admin". Si envían cualquier otra cosa (o nada), forzamos "driver".
    const roleToAssign = role === "admin" ? "admin" : "driver";

    // Crear la invitación en Clerk
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: "https://adjusted-sawfly-23.accounts.dev/sign-up",
      ignoreExisting: true,
      publicMetadata: {
        // 3. USAMOS LA VARIABLE DINÁMICA AQUÍ
        role: roleToAssign,
      },
    });

    res.status(200).json({
      message: `Invitación enviada exitosamente como ${roleToAssign}`,
      invitation,
    });
  } catch (error) {
    console.error("Error al invitar:", error);
    res.status(500).json({
      message: error.errors?.[0]?.message || "Error al crear la invitación",
    });
  }
};

// Obtener usuario por ID (con detalles de driver)
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const isUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id
      );

    let whereClause;

    if (isUuid) {
      whereClause = "WHERE p.id = $1";
    } else {
      whereClause = "WHERE p.clerk_id = $1";
    }

    const query = `
      SELECT 
        p.*, 
        d.license_number, 
        d.phone, 
        d.status as driver_status
      FROM profiles p
      LEFT JOIN drivers d ON p.id = d.user_id
      ${whereClause} 
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo detalles del usuario" });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "El campo status es obligatorio" });
  }

  try {
    const driver = await changeStatus(id, status);

    if (!driver) {
      return res
        .status(404)
        .json({
          message: "Conductor no encontrado o el usuario no es conductor.",
        });
    }

    res.json({ message: "Estado actualizado correctamente", driver });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Estado inválido")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
