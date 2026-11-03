import pool from "../config/db.js";

export class NotificationModel {
  // Crear una nueva notificación
  static async create({ user_id, title, message, type }) {
    const [result] = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, is_read)
       VALUES (?, ?, ?, ?, FALSE)`,
      [user_id, title, message, type || "info"]
    );
    return { id: result.insertId, user_id, title, message, type: type || "info", is_read: false };
  }

  // Obtener todas las notificaciones de un usuario
  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  }

  // Obtener solo las notificaciones NO leídas de un usuario + el contador
  static async findUnreadByUserId(user_id) {
    const [rows] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? AND is_read = FALSE 
       ORDER BY created_at DESC`,
      [user_id]
    );

    return {
      unread_count: rows.length,
      notifications: rows,
    };
  }

  // Marcar una notificación específica como leída
  static async markAsRead(id, user_id) {
    const [result] = await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
    return result.affectedRows > 0;
  }

  // Marcar TODAS las notificaciones de un usuario como leídas
  static async markAllAsRead(user_id) {
    const [result] = await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE user_id = ? AND is_read = FALSE`,
      [user_id]
    );
    return result.affectedRows > 0;
  }

  // Eliminar una notificación
  static async delete(id, user_id) {
    const [result] = await pool.query(
      `DELETE FROM notifications 
       WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
    return result.affectedRows > 0;
  }
}