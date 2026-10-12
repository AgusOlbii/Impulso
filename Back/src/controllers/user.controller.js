// src/controllers/user.controller.js
import db from "../config/db.js"; 

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Usamos SELECT * para traer todos los campos existentes de la tabla users
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    // Removemos la contraseña del objeto antes de enviarlo al cliente
    const { password, ...userWithoutPassword } = rows[0];

    res.json({
      ok: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error SQL al obtener usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};