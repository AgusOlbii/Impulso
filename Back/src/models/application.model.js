// src/models/application.model.js
import pool from "../config/db.js";

export class ApplicationModel {
  // Crear una nueva solicitud de profesor (hecha por el alumno)
  static async create(userId, data) {
    const { specialty, experience, description, price } = data;
    const [result] = await pool.query(
      `INSERT INTO coach_applications (user_id, specialty, experience, description, price, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, specialty, experience, description, price]
    );
    return { id: result.insertId, userId, status: 'pending' };
  }

  // Obtener todas las solicitudes pendientes para el panel admin
  static async findPending() {
    const [rows] = await pool.query(
      `SELECT a.*, u.name, u.email, u.phone 
       FROM coach_applications a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.status = 'pending'`
    );
    return rows;
  }

  // Actualizar el estado de la solicitud (approved / rejected)
  static async updateStatus(id, status) {
    const [result] = await pool.query(
      `UPDATE coach_applications SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM coach_applications WHERE id = ?`, [id]);
    return rows[0];
  }
}