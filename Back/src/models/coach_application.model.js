import pool from "../config/db.js";

export class CoachApplicationModel {
  // Crear una nueva solicitud de profesor
  static async create({ user_id, specialty, experience, description }) {
    const [result] = await pool.query(
      `INSERT INTO coach_applications (user_id, specialty, experience, description, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [user_id, specialty, experience, description]
    );
    return { id: result.insertId, user_id, specialty, experience, description, status: "pending" };
  }

  // Buscar todas las solicitudes pendientes (para el Panel de Admin)
  static async findPending() {
    const [rows] = await pool.query(
      `SELECT ca.*, u.name, u.lastname, u.email, u.phone, u.image_url 
       FROM coach_applications ca
       JOIN users u ON ca.user_id = u.id
       WHERE ca.status = 'pending'
       ORDER BY ca.created_at ASC`
    );
    return rows;
  }

  // Buscar una solicitud específica por su ID
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT ca.*, u.name, u.lastname, u.email, u.phone, u.image_url 
       FROM coach_applications ca
       JOIN users u ON ca.user_id = u.id
       WHERE ca.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Verificar si un usuario ya tiene una solicitud en curso
  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      `SELECT * FROM coach_applications 
       WHERE user_id = ? AND status = 'pending'`,
      [user_id]
    );
    return rows[0];
  }

  // Cambiar el estado de la solicitud (Aprobar o Rechazar)
  static async updateStatus(id, status) {
    const [result] = await pool.query(
      `UPDATE coach_applications SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  }
}